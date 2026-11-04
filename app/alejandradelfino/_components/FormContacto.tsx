"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sitio } from "../_lib/contenido";
import { CONTACTO, PRODUCCION } from "../_config/site";

/* Contacto mínimo: nombre, localidad, un medio para responder y el mensaje.
   Nada que revele afinidad política (Ley 25.326, arts. 2 y 7). Hasta que haya
   endpoint y responsable de la base, en producción se ofrece Instagram en su
   lugar, y en desarrollo el formulario se ve pero no envía ni guarda nada. */

type Estado = "listo" | "enviando" | "ok" | "error" | "desactivado";

const EASE = [0.22, 1, 0.36, 1] as const;
const f = sitio.formulario;
const habilitado = Boolean(CONTACTO.endpoint && CONTACTO.responsable);

function Instagram() {
  return (
    <div className="ad-sin-envio">
      <p>{f.sinEnvio}</p>
      <a href={sitio.meta.instagram} target="_blank" rel="noopener noreferrer" className="ad-btn ad-btn-primario">
        {f.instagram}
      </a>
    </div>
  );
}

function Privacidad() {
  return (
    <div className="ad-privacidad ad-campo-ancho">
      {f.privacidad.map((parrafo) => {
        const [antes, despues] = parrafo.split("{responsable}");
        return (
          <p key={parrafo}>
            {antes}
            {despues !== undefined &&
              (CONTACTO.responsable ?? <span className="ad-marca">COMPLETAR razón social y contacto</span>)}
            {despues}
          </p>
        );
      })}
    </div>
  );
}

function Formulario() {
  const [estado, setEstado] = useState<Estado>("listo");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!habilitado || !CONTACTO.endpoint) {
      setEstado("desactivado");
      return;
    }
    const datos = new FormData(e.currentTarget);
    setEstado("enviando");
    try {
      const res = await fetch(CONTACTO.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          localidad: datos.get("localidad"),
          contacto: datos.get("contacto"),
          mensaje: datos.get("mensaje"),
          acepta: datos.get("acepta") === "si",
          sitio_web: datos.get("sitio_web"),
        }),
      });
      setEstado(res.ok ? "ok" : "error");
    } catch {
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
          {f.gracias}
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
            <span>{f.campos.nombre}</span>
            <input name="nombre" required minLength={2} maxLength={120} autoComplete="given-name" />
          </label>
          <label className="ad-campo">
            <span>{f.campos.localidad}</span>
            <input name="localidad" required minLength={2} maxLength={80} list="ad-localidades" autoComplete="address-level2" />
            <datalist id="ad-localidades">
              {f.localidades.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </label>
          <label className="ad-campo ad-campo-ancho">
            <span>{f.campos.contacto}</span>
            <input name="contacto" required minLength={6} maxLength={120} autoComplete="email" />
          </label>
          <label className="ad-campo ad-campo-ancho">
            <span>{f.campos.mensaje}</span>
            <textarea name="mensaje" required minLength={5} maxLength={2000} rows={4} />
          </label>

          {/* Trampa para bots: fuera de pantalla y fuera del orden de tabulación. */}
          <input className="ad-trampa" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <Privacidad />

          {/* Sin marcar por defecto: el consentimiento tiene que ser un acto. */}
          <label className="ad-consiente ad-campo-ancho">
            <input type="checkbox" name="acepta" value="si" required />
            <span>{f.acepto}</span>
          </label>

          <div className="ad-form-pie ad-campo-ancho">
            <button type="submit" className="ad-btn ad-btn-primario" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : f.enviar}
            </button>
            <p className="ad-form-error" role="alert">
              {estado === "error" ? f.error : estado === "desactivado" ? f.sinEnvioDev : ""}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function FormContacto() {
  return habilitado || !PRODUCCION ? <Formulario /> : <Instagram />;
}
