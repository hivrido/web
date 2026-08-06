"use client";

/**
 * Entrada del carrusel orbital: rueda, touch y arrastre → un solo ángulo.
 *
 * Modelo: cada gesto empuja `target`, y en cada frame `theta` persigue a
 * `target` con lerp amortiguado. El retardo de esa persecución ES la inercia
 * — un flick acumula mucho delta y el lerp lo descarga suave.
 *
 * Todo vive en refs: el bucle de render lee `thetaRef.current` sin provocar
 * un solo re-render de React. El único estado que sube a React es el índice
 * activo, y solo cuando cambia.
 */

import { useCallback, useEffect, useRef } from "react";
import { activeIndexFor, damp, nearestThetaForIndex, snapTheta, spacingFor } from "./orbital-math";

export interface OrbitalInputOptions {
  count: number;
  /** Radianes por píxel de rueda. */
  wheelSensitivity?: number;
  /** Radianes por píxel de arrastre / swipe. */
  dragSensitivity?: number;
  /** Fracción sin recorrer tras 1 s. Más chico = más pegado al gesto. */
  smoothing?: number;
  /** Inactividad (ms) antes de imantar al proyecto más cercano. */
  snapDelay?: number;
  /** Cuánto se prolonga el gesto al soltar, en segundos de velocidad. */
  momentum?: number;
  onActiveChange?: (index: number) => void;
}

export interface OrbitalInput {
  thetaRef: React.RefObject<number>;
  /** Llamar una vez por frame desde el bucle de render. */
  update: (dt: number) => void;
  goTo: (index: number) => void;
  step: (direction: number) => void;
  /** Conecta los listeners. Devuelve la función de limpieza. */
  attach: (element: HTMLElement) => () => void;
  isDragging: React.RefObject<boolean>;
}

/** Normaliza deltaY: Firefox reporta líneas y algunos navegadores páginas. */
function normalizeWheel(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 16;   // líneas
  if (e.deltaMode === 2) return e.deltaY * 100;  // páginas
  return e.deltaY;
}

export function useOrbitalInput({
  count,
  wheelSensitivity = 0.0016,
  dragSensitivity = 0.0052,
  smoothing = 0.0015,
  snapDelay = 130,
  momentum = 0.14,
  onActiveChange,
}: OrbitalInputOptions): OrbitalInput {
  const thetaRef = useRef(Math.PI / 2);   // arranca con el índice 0 al frente
  const targetRef = useRef(Math.PI / 2);
  const isDragging = useRef(false);
  const activeRef = useRef(0);

  const lastInputAt = useRef(0);
  const snapped = useRef(true);

  // Velocidad reciente del gesto, para el envión al soltar
  const velocity = useRef(0);
  const lastMoveAt = useRef(0);

  // Espejos de las props que necesitan los callbacks estables. Se sincronizan
  // en un efecto, no durante el render: escribir refs al renderizar rompe las
  // garantías de React (y lo marca react-hooks/refs).
  const countRef = useRef(count);
  const onActiveRef = useRef(onActiveChange);

  useEffect(() => { countRef.current = count; }, [count]);
  useEffect(() => { onActiveRef.current = onActiveChange; }, [onActiveChange]);

  /** Registra un empujón del usuario y cancela el imán pendiente. */
  const push = useCallback((deltaRadians: number) => {
    targetRef.current += deltaRadians;
    lastInputAt.current = performance.now();
    snapped.current = false;

    const now = performance.now();
    const dt = Math.max(1, now - lastMoveAt.current);
    lastMoveAt.current = now;
    velocity.current = deltaRadians / (dt / 1000);
  }, []);

  const goTo = useCallback((index: number) => {
    targetRef.current = nearestThetaForIndex(targetRef.current, index, countRef.current);
    snapped.current = true;
    lastInputAt.current = 0;
  }, []);

  const step = useCallback((direction: number) => {
    // Encadena desde el destino, no desde theta: clicks rápidos deben sumarse
    const spacing = spacingFor(countRef.current);
    const base = snapTheta(targetRef.current, countRef.current);
    targetRef.current = base - direction * spacing;
    snapped.current = true;
    lastInputAt.current = 0;
  }, []);

  /** Un frame de amortiguado + imán por inactividad. */
  const update = useCallback((dt: number) => {
    const now = performance.now();

    if (!isDragging.current && !snapped.current && now - lastInputAt.current > snapDelay) {
      targetRef.current = snapTheta(targetRef.current, countRef.current);
      snapped.current = true;
    }

    thetaRef.current = damp(thetaRef.current, targetRef.current, smoothing, dt);

    const next = activeIndexFor(thetaRef.current, countRef.current);
    if (next !== activeRef.current) {
      activeRef.current = next;
      onActiveRef.current?.(next);
    }
  }, [smoothing, snapDelay]);

  /** Conecta rueda, touch y puntero. */
  const attach = useCallback((element: HTMLElement) => {
    /* ── Rueda ── */
    const onWheel = (e: WheelEvent) => {
      const delta = normalizeWheel(e) + e.deltaX;
      // Scrollear hacia abajo avanza: el índice sube cuando theta baja
      push(-delta * wheelSensitivity);
    };

    /* ── Touch ──
       passive:false porque hay que frenar el scroll de la página. */
    let touchX = 0;
    let touchY = 0;
    let touchActive = false;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touchActive = true;
      isDragging.current = true;
      touchX = t.clientX;
      touchY = t.clientY;
      velocity.current = 0;
      lastMoveAt.current = performance.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!touchActive || !t) return;
      e.preventDefault();

      const dx = t.clientX - touchX;
      const dy = t.clientY - touchY;
      touchX = t.clientX;
      touchY = t.clientY;

      // Eje dominante: el swipe horizontal y el vertical mueven el mismo aro
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      push(delta * dragSensitivity);
    };

    const onTouchEnd = () => {
      if (!touchActive) return;
      touchActive = false;
      isDragging.current = false;
      // Envión: prolonga el gesto en proporción a lo rápido que se soltó
      targetRef.current += velocity.current * momentum;
      velocity.current = 0;
      lastInputAt.current = performance.now();
      snapped.current = false;
    };

    /* ── Arrastre con mouse ── */
    let pointerId: number | null = null;
    let pointerX = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;   // el touch va por su propia vía
      pointerId = e.pointerId;
      pointerX = e.clientX;
      isDragging.current = true;
      velocity.current = 0;
      lastMoveAt.current = performance.now();
      element.setPointerCapture(e.pointerId);
      element.classList.add("is-dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - pointerX;
      pointerX = e.clientX;
      push(dx * dragSensitivity);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      isDragging.current = false;
      element.classList.remove("is-dragging");
      if (element.hasPointerCapture?.(e.pointerId)) element.releasePointerCapture(e.pointerId);
      targetRef.current += velocity.current * momentum;
      velocity.current = 0;
      lastInputAt.current = performance.now();
      snapped.current = false;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchEnd, { passive: true });
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("wheel", onWheel);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchEnd);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    };
  }, [push, wheelSensitivity, dragSensitivity, momentum]);

  /* Teclado: accesibilidad básica del carrusel */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return { thetaRef, update, goTo, step, attach, isDragging };
}
