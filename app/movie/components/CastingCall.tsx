"use client";

/**
 * Puerta de entrada de Hivrido PLAY: el llamado a casting de El Docke, antes
 * del slider del catálogo.
 *
 * No hay servidor —la ruta es export estático— así que el formulario no POSTea
 * a ningún lado: compone el mensaje y abre WhatsApp con los datos cargados. El
 * envío lo hace la persona, que es además lo que abre la conversación del lado
 * correcto: nos escribe ella, con su número real, y la respuesta ya tiene a
 * dónde ir.
 */

import { useState } from "react";

const WHATSAPP = "5491156072460";

type Fields = { nombre: string; telefono: string; email: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { nombre: "", telefono: "", email: "" };

/* Suficiente para atajar el error de tipeo, no para pelear con direcciones
   raras: lo que valida de verdad el dato es que la persona conteste. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ nombre, telefono, email }: Fields): Errors {
  const errors: Errors = {};
  if (nombre.trim().length < 3) errors.nombre = "Escribí tu nombre y apellido.";
  // Solo los dígitos: la gente escribe el teléfono con espacios, guiones y +54
  if (telefono.replace(/\D/g, "").length < 8) errors.telefono = "Falta un teléfono con característica.";
  if (!EMAIL.test(email.trim())) errors.email = "Revisá el email.";
  return errors;
}

function waLink({ nombre, telefono, email }: Fields) {
  const text = [
    "Hola HIVRIDO! Quiero sumarme al casting de la serie El Docke.",
    "",
    `Nombre: ${nombre.trim()}`,
    `Teléfono: ${telefono.trim()}`,
    `Email: ${email.trim()}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
    <path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0012.05 0zm0 21.79a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.27c0-5.45 4.44-9.88 9.89-9.88a9.83 9.83 0 019.88 9.89c0 5.45-4.43 9.89-9.88 9.89z"/>
  </svg>
);

export default function CastingCall() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Fields | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    // El error se va al corregir, no al reenviar: castigar dos veces el mismo
    // typo es lo que hace que la gente abandone un formulario.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    if (Object.keys(found).length) { setErrors(found); return; }

    const url = waLink(fields);
    /* La pestaña se abre dentro del gesto del click, que es la única ventana
       en que el navegador la deja pasar. Si igual la bloquea, se navega. */
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;

    setSent(fields);
    setFields(EMPTY);
  };

  const verCatalogo = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            Casting abierto · 2026
          </div>

          <h1 className="mp-casting-title">
            Sé parte
            <strong>El Docke</strong>
          </h1>

          <p className="mp-casting-lead">
            Buscamos caras nuevas para la próxima temporada de la serie. Dejanos
            tus datos y te escribimos por WhatsApp con la fecha, el lugar y el
            personaje que estamos buscando.
          </p>

          <ul className="mp-casting-points">
            <li>Casting presencial en Buenos Aires</li>
          </ul>
        </div>

        <div className="mp-casting-card">
          <div className="mp-casting-card-glow" aria-hidden="true" />

          {sent ? (
            <div className="mp-casting-done" role="status" aria-live="polite">
              <div className="mp-casting-done-mark" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="mp-casting-done-title">Listo, {sent.nombre.trim().split(" ")[0]}</h2>
              <p className="mp-casting-done-text">
                Se abrió WhatsApp con tus datos cargados. Enviá el mensaje y
                quedás anotado en el casting.
              </p>
              <a className="mp-casting-submit" href={waLink(sent)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Abrir WhatsApp de nuevo
              </a>
              <button type="button" className="mp-casting-ghost" onClick={verCatalogo}>
                Mientras tanto, mirá el catálogo
              </button>
            </div>
          ) : (
            <form className="mp-casting-form" onSubmit={onSubmit} noValidate>
              <div className="mp-casting-form-head">
                <span className="mp-casting-form-kicker">Formulario de casting</span>
                <h2 className="mp-casting-form-title">Anotate</h2>
              </div>

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

              <label className="mp-casting-field">
                <span>Teléfono</span>
                <input
                  type="tel"
                  name="telefono"
                  inputMode="tel"
                  value={fields.telefono}
                  onChange={set("telefono")}
                  placeholder="11 5607 2460"
                  autoComplete="tel"
                  aria-invalid={!!errors.telefono}
                />
                {errors.telefono && <em className="mp-casting-error">{errors.telefono}</em>}
              </label>

              <label className="mp-casting-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  value={fields.email}
                  onChange={set("email")}
                  placeholder="camila@mail.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <em className="mp-casting-error">{errors.email}</em>}
              </label>

              <button type="submit" className="mp-casting-submit">
                <WhatsAppIcon />
                Enviar por WhatsApp
              </button>

              <p className="mp-casting-fine">
                Se abre WhatsApp con tus datos escritos. No compartimos nada con
                nadie.
              </p>
            </form>
          )}
        </div>
      </div>

      <button type="button" className="mp-casting-scroll" onClick={verCatalogo}>
        Explorar el catálogo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
