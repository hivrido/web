"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sitio } from "../_lib/contenido";

type Estado = "listo" | "enviando" | "ok" | "error";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FormSumate() {
  const s = sitio.sumate;
  const [estado, setEstado] = useState<Estado>("listo");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEstado("enviando");
    setError("");
    try {
      const res = await fetch("/alejandradelfino/api/sumate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          localidad: datos.get("localidad"),
          whatsapp: datos.get("whatsapp"),
          ayudas: datos.getAll("ayudas"),
          consiente: datos.get("consiente") === "si",
          sitio_web: datos.get("sitio_web"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || s.error);
      setEstado("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : s.error);
      setEstado("error");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {estado === "ok" ? (
        <motion.p
          key="gracias"
          className="ad-form-gracias"
          role="status"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="ad-corazon" aria-hidden="true" />
          {s.gracias}
        </motion.p>
      ) : (
        <motion.form
          key="form"
          className="ad-form"
          onSubmit={enviar}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <label className="ad-campo">
            <span>{s.campos.nombre}</span>
            <input name="nombre" required minLength={3} maxLength={120} autoComplete="name" />
          </label>
          <label className="ad-campo">
            <span>{s.campos.localidad}</span>
            <input name="localidad" required minLength={2} maxLength={80} list="ad-localidades" autoComplete="address-level2" />
            <datalist id="ad-localidades">
              {s.localidades.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </label>
          <label className="ad-campo">
            <span>{s.campos.whatsapp}</span>
            <input
              name="whatsapp"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder="280 412-3456"
            />
          </label>

          <fieldset className="ad-campo ad-campo-ancho">
            <legend>{s.campos.ayuda}</legend>
            <div className="ad-opciones">
              {s.ayudas.map((a) => (
                <label key={a} className="ad-opcion">
                  <input type="checkbox" name="ayudas" value={a} />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Trampa para bots: fuera de pantalla y fuera del orden de tabulación. */}
          <input className="ad-trampa" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <label className="ad-consiente ad-campo-ancho">
            <input type="checkbox" name="consiente" value="si" required />
            <span>{s.consentimiento}</span>
          </label>

          <div className="ad-form-pie ad-campo-ancho">
            <button type="submit" className="ad-btn ad-btn-primario" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : s.enviar}
            </button>
            <p className="ad-form-error" role="alert">
              {estado === "error" ? error : ""}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
