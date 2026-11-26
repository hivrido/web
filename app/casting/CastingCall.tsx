"use client";

/**
 * La cabecera de /casting: la consigna del selftape a la izquierda y, a la
 * derecha, la tarjeta que arma el mail (CONVOCATORIA y SELFTAPE, en
 * contenido.ts).
 *
 * No se sube nada a ningún lado: con el perfil y el nombre se compone el
 * asunto y el cuerpo, y se abre la aplicación de mail de la persona para que
 * adjunte el video. Como el navegador incrustado de Instagram y WhatsApp a
 * veces no abre `mailto:`, la tarjeta ofrece también Gmail en la web y copiar
 * la dirección.
 */

import { useState } from "react";
import { medir } from "../lib/medir";
import { CONVOCATORIA as C, PERFILES, SELFTAPE as T } from "./contenido";

type Fields = { nombre: string; perfil: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { nombre: "", perfil: "" };

function validate({ nombre, perfil }: Fields): Errors {
  const errors: Errors = {};
  if (!perfil) errors.perfil = "Elegí qué hacés.";
  if (nombre.trim().length < 3) errors.nombre = "Escribí tu nombre y apellido.";
  return errors;
}

function mailtoLink({ nombre, perfil }: Fields) {
  const n = nombre.trim();
  return `mailto:${C.mail}?subject=${encodeURIComponent(T.asunto(perfil, n))}&body=${encodeURIComponent(T.cuerpo(perfil, n))}`;
}

function gmailLink({ nombre, perfil }: Fields) {
  const n = nombre.trim();
  const q = new URLSearchParams({ view: "cm", fs: "1", to: C.mail, su: T.asunto(perfil, n), body: T.cuerpo(perfil, n) });
  return `https://mail.google.com/mail/?${q}`;
}

const MailIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

/** La dirección, con un botón para copiarla: el plan B cuando no abre el mail. */
function Direccion() {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(C.mail);
      setCopiado(true);
      medir("selftape_copiar_mail", { casting: C.slug });
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* Sin permiso de portapapeles queda la dirección a la vista. */
    }
  };
  return (
    <div className="mp-casting-mail">
      <span className="mp-casting-mail-dir">{C.mail}</span>
      <button type="button" className="mp-casting-mail-copiar" onClick={copiar} aria-live="polite">
        {copiado ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export default function CastingCall() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Fields | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    // El error se va al corregir, no al reenviar.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    if (Object.keys(found).length) { setErrors(found); return; }
    medir("selftape_mail", { casting: C.slug, perfil: fields.perfil });
    setSent(fields);
    window.location.href = mailtoLink(fields);
  };

  return (
    <section className="mp-casting" id="casting">
      {/* Atmósfera: dos focos de color, el haz diagonal y la trama de pantalla */}
      <div className="mp-casting-aura" aria-hidden="true" />
      <div className="mp-casting-beam" aria-hidden="true" />
      <div className="mp-casting-scan" aria-hidden="true" />

      <div className="mp-casting-inner">
        <div className="mp-casting-copy">
          <div className="mp-casting-eyebrow">
            <span className="mp-casting-eyebrow-line" />
            Casting abierto · {C.modalidad}
          </div>

          <h1 className="mp-casting-title">
            <span>Sé parte de</span>
            <strong>{C.serie}</strong>
          </h1>

          <p className="mp-casting-lead">
            Una serie argentina. La jornada presencial ya pasó y el casting
            sigue abierto 72 horas: grabá un selftape de hasta {C.duracion} y
            mandalo por mail antes del {C.cierre}. Buscamos caras nuevas.
          </p>

          <ol className="mp-casting-pasos" id="selftape">
            {T.pasos.map((p, i) => (
              <li key={p.titulo}>
                <span className="mp-casting-pasos-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{p.titulo}</strong>
                  <span>{p.texto}</span>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mp-casting-points">
            <li>{C.cierreCorto}</li>
            <li>{C.modalidad} · Máx. {C.duracion}</li>
            <li>Gratis</li>
            <li>Dirección de casting: {C.direccion}</li>
          </ul>
        </div>

        <div className="mp-casting-card">
          <div className="mp-casting-card-glow" aria-hidden="true" />

          {sent ? (
            <div className="mp-casting-done" role="status" aria-live="polite">
              <div className="mp-casting-done-mark" aria-hidden="true">
                <MailIcon size={26} />
              </div>
              <h2 className="mp-casting-done-title">Último paso, {sent.nombre.trim().split(" ")[0]}</h2>
              <p className="mp-casting-done-text">
                Se abrió tu mail con el asunto y tus datos. Completá lo que
                falta, adjuntá el video (o el link de Drive o WeTransfer) y
                envialo.
              </p>
              <a className="mp-casting-submit" href={gmailLink(sent)} target="_blank" rel="noopener noreferrer">
                <MailIcon />
                No se abrió: usar Gmail
              </a>
              <Direccion />
              <button type="button" className="mp-casting-ghost" onClick={() => { setSent(null); setFields(EMPTY); }}>
                Mandar otro selftape
              </button>
            </div>
          ) : (
            <form className="mp-casting-form" onSubmit={onSubmit} noValidate>
              <div className="mp-casting-form-head">
                <span className="mp-casting-form-kicker">{T.kicker}</span>
                <h2 className="mp-casting-form-title">{T.titulo}</h2>
              </div>

              <fieldset className="mp-casting-field mp-casting-perfil" aria-invalid={!!errors.perfil}>
                <legend>¿Qué hacés?</legend>
                <div className="mp-casting-opciones">
                  {PERFILES.map((p) => (
                    <label key={p} className={`mp-casting-opcion${fields.perfil === p ? " is-on" : ""}`}>
                      <input type="radio" name="perfil" value={p} checked={fields.perfil === p} onChange={set("perfil")} />
                      {p}
                    </label>
                  ))}
                </div>
                {errors.perfil && <em className="mp-casting-error">{errors.perfil}</em>}
              </fieldset>

              <label className="mp-casting-field">
                <span>Nombre y apellido</span>
                <input
                  type="text"
                  name="nombre"
                  value={fields.nombre}
                  onChange={set("nombre")}
                  placeholder="Camila Ríos"
                  autoComplete="name"
                  aria-invalid={!!errors.nombre}
                />
                {errors.nombre && <em className="mp-casting-error">{errors.nombre}</em>}
              </label>

              <button type="submit" className="mp-casting-submit">
                <MailIcon />
                Armar el mail
              </button>

              <p className="mp-casting-fine">{T.fino}</p>

              <p className="mp-casting-mail-rotulo">O escribinos directo a</p>
              <Direccion />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
