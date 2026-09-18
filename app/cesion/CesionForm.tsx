"use client";

/**
 * Formulario público de cesión de derechos de imagen.
 *
 * Pensado para firmarse con el dedo en un celular de gama media con datos
 * móviles: un solo paso, scroll vertical, sin wizard y sin motor 3D. Lo único
 * que se carga de más es signature_pad, que son unos 5 KB y resuelve el trazo
 * —ancho variable por velocidad— y los bordes ásperos del touch en iOS.
 *
 * Lo que este componente NO decide: la hora, la IP y el hash del texto legal.
 * Eso lo resuelve el servidor en /api/cesion, porque quien firma es parte
 * interesada y no puede ser la fuente de su propia prueba.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { VERSIONES, VERSION_ACTUAL } from "@/app/lib/cesion/textos";

type ApiFirma = { vacio: () => boolean; png: () => string | null; limpiar: () => void };

type Campos = {
  nombre: string;
  dni: string;
  fecha_nacimiento: string;
  domicilio: string;
  telefono: string;
  email: string;
  instagram: string;
  numero_orden: string;
  adulto_nombre: string;
  adulto_dni: string;
  adulto_vinculo: string;
  adulto_telefono: string;
};

const VACIO: Campos = {
  nombre: "",
  dni: "",
  fecha_nacimiento: "",
  domicilio: "",
  telefono: "",
  email: "",
  instagram: "",
  numero_orden: "",
  adulto_nombre: "",
  adulto_dni: "",
  adulto_vinculo: "",
  adulto_telefono: "",
};

/** Edad cumplida. El servidor la vuelve a calcular; acá solo decide qué mostrar. */
function calcularEdad(fecha: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  const nac = new Date(`${fecha}T00:00:00Z`);
  if (Number.isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getUTCFullYear() - nac.getUTCFullYear();
  const mes = hoy.getUTCMonth() - nac.getUTCMonth();
  if (mes < 0 || (mes === 0 && hoy.getUTCDate() < nac.getUTCDate())) edad--;
  return edad;
}

/* ─────────────────────────────── Firma ─────────────────────────────── */

function CampoFirma({
  id,
  etiqueta,
  ayuda,
  apiRef,
  onCambio,
}: {
  id: string;
  etiqueta: string;
  ayuda: string;
  apiRef: React.RefObject<ApiFirma | null>;
  onCambio: (tieneTrazo: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [tieneTrazo, setTieneTrazo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Tinta oscura, no blanca: el panel se ve claro en pantalla, pero el PNG
       sale con fondo transparente y termina sobre el blanco de un PDF. Una
       firma blanca ahí sería invisible. */
    const pad = new SignaturePad(canvas, {
      penColor: "#141024",
      backgroundColor: "rgba(0,0,0,0)",
      minWidth: 0.7,
      maxWidth: 2.4,
    });
    padRef.current = pad;

    /* El canvas se dibuja a escala del dispositivo para que el PNG salga
       nítido en papel. El piso de 2 evita que una pantalla de ratio 1 entregue
       una firma pixelada cuando se imprime. */
    const dimensionar = () => {
      const previo = pad.toData();
      const ratio = Math.max(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      // Redimensionar vacía el lienzo: los trazos se reponen a mano.
      pad.clear();
      if (previo.length) pad.fromData(previo);
    };

    dimensionar();

    const marcar = () => {
      const hay = !pad.isEmpty();
      setTieneTrazo(hay);
      onCambio(hay);
    };
    pad.addEventListener("endStroke", marcar);

    /* Solo se re-dimensiona al girar el teléfono. Escuchar `resize` a secas
       haría que la barra de direcciones de Chrome en Android, que aparece y
       desaparece con el scroll, rehiciera el lienzo en medio de la firma. */
    const alGirar = () => window.setTimeout(dimensionar, 120);
    window.addEventListener("orientationchange", alGirar);

    return () => {
      pad.removeEventListener("endStroke", marcar);
      window.removeEventListener("orientationchange", alGirar);
      pad.off();
    };
  }, [onCambio]);

  useEffect(() => {
    apiRef.current = {
      vacio: () => padRef.current?.isEmpty() ?? true,
      png: () => {
        const pad = padRef.current;
        if (!pad || pad.isEmpty()) return null;
        return pad.toDataURL("image/png");
      },
      limpiar: () => padRef.current?.clear(),
    };
  }, [apiRef]);

  const borrar = useCallback(() => {
    padRef.current?.clear();
    setTieneTrazo(false);
    onCambio(false);
  }, [onCambio]);

  return (
    <div className="cs-firma">
      <div className="cs-firma-head">
        <span className="cs-label" id={`${id}-label`}>
          {etiqueta}
        </span>
        <button type="button" className="cs-firma-borrar" onClick={borrar} disabled={!tieneTrazo}>
          Borrar y firmar de nuevo
        </button>
      </div>

      <div className={`cs-firma-panel${tieneTrazo ? " is-firmado" : ""}`}>
        <canvas ref={canvasRef} className="cs-firma-canvas" aria-labelledby={`${id}-label`} />
        {!tieneTrazo && (
          <span className="cs-firma-hint" aria-hidden="true">
            Firmá acá con el dedo
          </span>
        )}
        <span className="cs-firma-linea" aria-hidden="true" />
      </div>

      <p className="cs-ayuda">{ayuda}</p>
    </div>
  );
}

/* ─────────────────────────────── Formulario ─────────────────────────────── */

export default function CesionForm() {
  const version = VERSIONES[VERSION_ACTUAL];

  const [campos, setCampos] = useState<Campos>(VACIO);
  const [acepta, setAcepta] = useState(false);
  const [firmado, setFirmado] = useState(false);
  const [firmadoAdulto, setFirmadoAdulto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState<{ id: string; creado_en: string } | null>(null);

  const firmaRef = useRef<ApiFirma | null>(null);
  const firmaAdultoRef = useRef<ApiFirma | null>(null);

  const edad = calcularEdad(campos.fecha_nacimiento);
  const esMenor = edad !== null && edad < 18;

  const set = (clave: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampos((c) => ({ ...c, [clave]: e.target.value }));
    if (error) setError(null);
  };

  const parrafos = useMemo(() => version.texto.split("\n\n"), [version.texto]);

  /* El botón se habilita solo cuando están las dos condiciones que pediste:
     términos aceptados y trazo en el lienzo. Si es menor, además la firma del
     adulto. El servidor vuelve a exigir las tres, porque un botón deshabilitado
     no es una validación. */
  const puedeEnviar = acepta && firmado && (!esMenor || firmadoAdulto) && !enviando;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEnviar) return;

    const firmaPng = firmaRef.current?.png() ?? null;
    if (!firmaPng) {
      setError("Falta la firma.");
      return;
    }

    let firmaAdultoPng: string | null = null;
    if (esMenor) {
      firmaAdultoPng = firmaAdultoRef.current?.png() ?? null;
      if (!firmaAdultoPng) {
        setError("Falta la firma del adulto responsable.");
        return;
      }
    }

    setEnviando(true);
    setError(null);

    /* Los datos del dispositivo se leen recién acá, en el momento del envío:
       son constancia del acto de firma, no del momento en que se abrió la
       página. */
    const cuerpo = {
      ...campos,
      acepta: true,
      firma_png: firmaPng,
      firma_adulto_png: firmaAdultoPng,
      texto_version: version.id,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone_dispositivo: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
    };

    try {
      /* La barra final no es cosmética: con `trailingSlash: true`, pedir
         /api/cesion devuelve un 308 hacia /api/cesion/. El POST sobrevive el
         salto, pero son dos viajes en una conexión móvil en vez de uno. */
      const res = await fetch("/api/cesion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "No pudimos registrar la firma. Intentá de nuevo.");
        setEnviando(false);
        return;
      }

      setListo({ id: data.id, creado_en: data.creado_en });
    } catch {
      setError("No hay conexión. Revisá los datos móviles e intentá de nuevo.");
      setEnviando(false);
    }
  };

  if (listo) {
    return (
      <div className="cs-listo" role="status" aria-live="polite">
        <div className="cs-listo-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="cs-listo-title">Firma registrada</h2>
        <p className="cs-listo-text">
          Gracias, {campos.nombre.trim().split(" ")[0]}. Tu cesión quedó asentada
          con fecha, hora y constancia técnica. Guardá este comprobante.
        </p>
        <dl className="cs-comprobante">
          <div>
            <dt>Comprobante</dt>
            <dd>{listo.id}</dd>
          </div>
          <div>
            <dt>Fecha y hora</dt>
            <dd>{listo.creado_en}</dd>
          </div>
          <div>
            <dt>Documento</dt>
            <dd>
              {version.titulo} ({version.id})
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form className="cs-form" onSubmit={onSubmit} noValidate>
      <section className="cs-bloque">
        <h2 className="cs-bloque-title">Tus datos</h2>

        <label className="cs-campo">
          <span className="cs-label">Nombre y apellido</span>
          <input type="text" value={campos.nombre} onChange={set("nombre")} autoComplete="name" required />
        </label>

        <div className="cs-fila">
          <label className="cs-campo">
            <span className="cs-label">DNI</span>
            <input type="text" inputMode="numeric" value={campos.dni} onChange={set("dni")} required />
          </label>

          <label className="cs-campo">
            <span className="cs-label">Fecha de nacimiento</span>
            <input type="date" value={campos.fecha_nacimiento} onChange={set("fecha_nacimiento")} required />
          </label>
        </div>

        {edad !== null && edad >= 0 && edad <= 120 && (
          <p className="cs-edad">
            {edad} años{esMenor ? " — se necesita la firma de un adulto responsable" : ""}
          </p>
        )}

        <label className="cs-campo">
          <span className="cs-label">Domicilio</span>
          <input type="text" value={campos.domicilio} onChange={set("domicilio")} autoComplete="street-address" required />
        </label>

        <div className="cs-fila">
          <label className="cs-campo">
            <span className="cs-label">Teléfono / WhatsApp</span>
            <input type="tel" inputMode="tel" value={campos.telefono} onChange={set("telefono")} autoComplete="tel" required />
          </label>

          <label className="cs-campo">
            <span className="cs-label">Correo electrónico</span>
            <input type="email" inputMode="email" value={campos.email} onChange={set("email")} autoComplete="email" required />
          </label>
        </div>

        <div className="cs-fila">
          <label className="cs-campo">
            <span className="cs-label">
              Instagram <em>opcional</em>
            </span>
            <input type="text" value={campos.instagram} onChange={set("instagram")} placeholder="@usuario" />
          </label>

          <label className="cs-campo">
            <span className="cs-label">
              N.º de orden <em>opcional</em>
            </span>
            <input type="text" inputMode="numeric" value={campos.numero_orden} onChange={set("numero_orden")} />
          </label>
        </div>
      </section>

      {esMenor && (
        <section className="cs-bloque cs-bloque-menor">
          <h2 className="cs-bloque-title">Adulto responsable</h2>
          <p className="cs-bloque-lead">
            Quien firma es menor de 18 años, así que la cesión la otorga su
            madre, padre, tutor o representante legal.
          </p>

          <label className="cs-campo">
            <span className="cs-label">Nombre y apellido del adulto</span>
            <input type="text" value={campos.adulto_nombre} onChange={set("adulto_nombre")} required />
          </label>

          <div className="cs-fila">
            <label className="cs-campo">
              <span className="cs-label">DNI del adulto</span>
              <input type="text" inputMode="numeric" value={campos.adulto_dni} onChange={set("adulto_dni")} required />
            </label>

            <label className="cs-campo">
              <span className="cs-label">Vínculo</span>
              <input type="text" value={campos.adulto_vinculo} onChange={set("adulto_vinculo")} placeholder="Madre, padre, tutor" required />
            </label>
          </div>

          <label className="cs-campo">
            <span className="cs-label">Teléfono del adulto</span>
            <input type="tel" inputMode="tel" value={campos.adulto_telefono} onChange={set("adulto_telefono")} required />
          </label>
        </section>
      )}

      <section className="cs-bloque">
        <h2 className="cs-bloque-title">{version.titulo}</h2>

        <div className="cs-legal" tabIndex={0} role="region" aria-label="Texto de la cesión">
          {parrafos.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <label className="cs-check">
          <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
          <span>Leí y acepto los términos</span>
        </label>
      </section>

      <section className="cs-bloque">
        <CampoFirma
          id="firma-participante"
          etiqueta={esMenor ? "Firma del participante" : "Tu firma"}
          ayuda="Firmá con el dedo dentro del recuadro. Si no te gusta cómo quedó, borrala y hacela de nuevo."
          apiRef={firmaRef}
          onCambio={setFirmado}
        />

        {esMenor && (
          <CampoFirma
            id="firma-adulto"
            etiqueta="Firma del adulto responsable"
            ayuda="Esta segunda firma es la que da validez a la cesión de un menor de edad."
            apiRef={firmaAdultoRef}
            onCambio={setFirmadoAdulto}
          />
        )}
      </section>

      {error && (
        <p className="cs-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="cs-submit" disabled={!puedeEnviar}>
        {enviando ? "Registrando…" : "Firmar y enviar"}
      </button>

      {!puedeEnviar && !enviando && (
        <p className="cs-ayuda cs-ayuda-centro">
          {!acepta
            ? "Aceptá los términos para poder enviar."
            : !firmado
              ? "Falta tu firma."
              : "Falta la firma del adulto responsable."}
        </p>
      )}
    </form>
  );
}
