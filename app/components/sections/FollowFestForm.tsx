"use client";
import { useState } from "react";

type EsArtista = "si" | "no" | null;
type Asistencia = "solo" | "invitados" | null;

interface FormData {
  nombre: string;
  instagram: string;
  telefono: string;
  esArtista: EsArtista;
  dedicacion: string;
  asistencia: Asistencia;
  motivacion: string;
}

type FormState = "idle" | "loading" | "success" | "error";

function validate(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.nombre.trim()) errors.nombre = "Este campo es requerido";
  const ig = data.instagram.replace(/^@/, "").trim();
  if (!ig) errors.instagram = "Ingresá tu usuario de Instagram";
  const tel = data.telefono.trim();
  if (!tel) errors.telefono = "Este campo es requerido";
  else if (!/^[+\d\s-]+$/.test(tel)) errors.telefono = "Solo números, espacios, guiones y el símbolo +";
  if (!data.esArtista) errors.esArtista = "Seleccioná una opción";
  if (!data.asistencia) errors.asistencia = "Seleccioná una opción";
  if (!data.motivacion.trim()) errors.motivacion = "Este campo es requerido";
  else if (data.motivacion.trim().length < 20) errors.motivacion = "Escribí al menos 20 caracteres";
  return errors;
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: "12px",
  padding: "15px 18px",
  color: "#fff",
  fontSize: "16px",
  transition: "border-color .2s ease, background .2s ease",
  boxSizing: "border-box",
};

const labelBase: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: ".16em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.5)",
  marginBottom: "10px",
};

const errorBase: React.CSSProperties = {
  fontSize: "12px",
  color: "#FF1B8D",
  marginTop: "6px",
};

function getToggleStyle(active: boolean): React.CSSProperties {
  return {
    padding: "11px 22px",
    minHeight: "44px",
    borderRadius: "100px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all .2s ease",
    letterSpacing: ".04em",
    border: active ? "1px solid rgba(182,69,214,.6)" : "1px solid rgba(255,255,255,.12)",
    background: active ? "rgba(182,69,214,.15)" : "rgba(255,255,255,.04)",
    color: active ? "#fff" : "rgba(255,255,255,.55)",
    fontWeight: active ? 700 : 500,
  };
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "4px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.07)" }} />
      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".2em", color: "rgba(255,255,255,.28)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.07)" }} />
    </div>
  );
}

function SuccessScreen() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(182,69,214,.2), rgba(0,217,255,.2))",
        border: "1px solid rgba(182,69,214,.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "30px", marginBottom: "28px",
        boxShadow: "0 0 40px rgba(182,69,214,.25)",
      }}>✓</div>
      <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 900, color: "#fff", marginBottom: "14px", letterSpacing: "-.02em" }}>
        ¡Aplicación enviada!
      </h2>
      <p style={{ fontSize: "16px", color: "rgba(255,255,255,.5)", lineHeight: 1.7, maxWidth: "380px" }}>
        Recibimos tu registro para Follow Fest. Te contactaremos pronto con más información.
      </p>
    </div>
  );
}

export default function FollowFestForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "", instagram: "", telefono: "",
    esArtista: null, dedicacion: "", asistencia: null, motivacion: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<FormState>("idle");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const next = { ...prev }; delete next[key]; return next; });
  }

  const onFocus = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.background = "rgba(255,255,255,.07)";
    if (!hasError) e.target.style.borderColor = "rgba(182,69,214,.5)";
  };

  const onBlur = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.background = "rgba(255,255,255,.05)";
    if (!hasError) e.target.style.borderColor = "rgba(255,255,255,.1)";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setFormState("loading");

    const ig = formData.instagram.startsWith("@") ? formData.instagram : `@${formData.instagram}`;

    try {
      const res = await fetch("/api/send_mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          instagram: ig,
          telefono: formData.telefono.trim(),
          es_artista: formData.esArtista === "si" ? "Sí" : "No",
          dedicacion: formData.dedicacion.trim() || "No especificó",
          asistencia: formData.asistencia === "solo" ? "Solo/a" : "Con invitados",
          motivacion: formData.motivacion.trim(),
          fecha: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") return <SuccessScreen />;

  const loading = formState === "loading";

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "60px 20px 80px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        {/* Badge con borde gradiente */}
        <div style={{ display: "inline-block", padding: "1px", borderRadius: "100px", background: "linear-gradient(135deg, #FF1B8D, #B645D6, #7B61FF)", marginBottom: "22px" }}>
          <div style={{ padding: "7px 20px", borderRadius: "100px", background: "#0d0d0d", fontSize: "10px", fontWeight: 700, letterSpacing: ".18em", color: "rgba(255,255,255,.8)", textTransform: "uppercase" }}>
            EVENTO EXCLUSIVO · REGISTRO PRIVADO
          </div>
        </div>

        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".3em", color: "rgba(255,255,255,.35)", textTransform: "uppercase", fontStyle: "italic", marginBottom: "10px" }}>
          BY HIVRIDO
        </div>

        <h1 style={{
          fontSize: "clamp(3rem,10vw,5.5rem)",
          fontWeight: 900,
          letterSpacing: "-.02em",
          lineHeight: 1,
          marginBottom: "18px",
          background: "linear-gradient(135deg, #B645D6, #7B61FF, #00D9FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 40px rgba(182,69,214,.3))",
        }}>
          FOLLOW FEST
        </h1>

        <p style={{ fontSize: "15px", color: "rgba(255,255,255,.45)", marginBottom: "22px" }}>
          Aplicá para formar parte de la lista
        </p>

        {/* Línea decorativa */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "80px", height: "1px", background: "linear-gradient(to right, transparent, rgba(0,217,255,.4))" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D9FF", boxShadow: "0 0 12px #00D9FF, 0 0 24px rgba(0,217,255,.5)", flexShrink: 0, margin: "0 2px" }} />
          <div style={{ width: "80px", height: "1px", background: "linear-gradient(to left, transparent, rgba(0,217,255,.4))" }} />
        </div>
      </div>

      {/* Form card */}
      <div style={{ position: "relative", background: "rgba(255,255,255,.03)", borderRadius: "24px" }}>
        {/* Borde gradiente simulado */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "24px", padding: "1px",
          background: "linear-gradient(135deg, rgba(255,27,141,.35), rgba(182,69,214,.35), rgba(0,217,255,.2))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude",
          pointerEvents: "none",
        }} />

        <form onSubmit={handleSubmit} noValidate style={{ padding: "clamp(24px,5vw,40px)", display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* Nombre */}
          <div>
            <label htmlFor="ff-nombre" style={labelBase}>Nombre completo <span style={{ color: "#FF1B8D" }}>*</span></label>
            <input
              id="ff-nombre"
              type="text"
              placeholder="Tu nombre y apellido"
              value={formData.nombre}
              onChange={e => set("nombre", e.target.value)}
              disabled={loading}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "ff-nombre-err" : undefined}
              style={{ ...inputBase, ...(errors.nombre ? { borderColor: "rgba(255,27,141,.5)" } : {}) }}
              onFocus={onFocus(!!errors.nombre)}
              onBlur={onBlur(!!errors.nombre)}
            />
            {errors.nombre && <p id="ff-nombre-err" role="alert" style={errorBase}>{errors.nombre}</p>}
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="ff-instagram" style={labelBase}>Usuario de Instagram <span style={{ color: "#FF1B8D" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <span aria-hidden="true" style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", color: "rgba(255,255,255,.45)", pointerEvents: "none", fontWeight: 600 }}>@</span>
              <input
                id="ff-instagram"
                type="text"
                placeholder="tuusuario"
                value={formData.instagram.replace(/^@/, "")}
                onChange={e => set("instagram", e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.instagram}
                aria-describedby={errors.instagram ? "ff-instagram-err" : undefined}
                style={{ ...inputBase, paddingLeft: "36px", ...(errors.instagram ? { borderColor: "rgba(255,27,141,.5)" } : {}) }}
                onFocus={onFocus(!!errors.instagram)}
                onBlur={onBlur(!!errors.instagram)}
              />
            </div>
            {errors.instagram && <p id="ff-instagram-err" role="alert" style={errorBase}>{errors.instagram}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="ff-telefono" style={labelBase}>Número de teléfono <span style={{ color: "#FF1B8D" }}>*</span></label>
            <input
              id="ff-telefono"
              type="tel"
              placeholder="+54 9 11 0000-0000"
              value={formData.telefono}
              onChange={e => set("telefono", e.target.value)}
              disabled={loading}
              aria-invalid={!!errors.telefono}
              aria-describedby={errors.telefono ? "ff-telefono-err" : undefined}
              style={{ ...inputBase, ...(errors.telefono ? { borderColor: "rgba(255,27,141,.5)" } : {}) }}
              onFocus={onFocus(!!errors.telefono)}
              onBlur={onBlur(!!errors.telefono)}
            />
            {errors.telefono && <p id="ff-telefono-err" role="alert" style={errorBase}>{errors.telefono}</p>}
          </div>

          {/* — SOBRE VOS — */}
          <Divider label="Sobre vos" />

          {/* Artista */}
          <div>
            <span id="ff-artista-label" style={labelBase}>¿Sos artista o creador de contenido? <span style={{ color: "#FF1B8D" }}>*</span></span>
            <div role="group" aria-labelledby="ff-artista-label" style={{ display: "flex", gap: "10px" }}>
              {(["si", "no"] as const).map(val => (
                <button key={val} type="button" onClick={() => set("esArtista", val)} disabled={loading}
                  aria-pressed={formData.esArtista === val}
                  style={getToggleStyle(formData.esArtista === val)}>
                  {val === "si" ? "+ Sí" : "No"}
                </button>
              ))}
            </div>
            {errors.esArtista && <p role="alert" style={errorBase}>{errors.esArtista}</p>}
          </div>

          {/* Dedicación */}
          <div>
            <label htmlFor="ff-dedicacion" style={labelBase}>¿A qué te dedicás?</label>
            <input
              id="ff-dedicacion"
              type="text"
              placeholder="Ej: fotógrafa, DJ, influencer, diseñador..."
              value={formData.dedicacion}
              onChange={e => set("dedicacion", e.target.value)}
              disabled={loading}
              style={inputBase}
              onFocus={onFocus(false)}
              onBlur={onBlur(false)}
            />
          </div>

          {/* — ASISTENCIA — */}
          <Divider label="Asistencia" />

          {/* Solo o con invitados */}
          <div>
            <span id="ff-asistencia-label" style={labelBase}>¿Venís solo o con invitados? <span style={{ color: "#FF1B8D" }}>*</span></span>
            <div role="group" aria-labelledby="ff-asistencia-label" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {(["solo", "invitados"] as const).map(val => (
                <button key={val} type="button" onClick={() => set("asistencia", val)} disabled={loading}
                  aria-pressed={formData.asistencia === val}
                  style={getToggleStyle(formData.asistencia === val)}>
                  {val === "solo" ? "Solo/a" : "Con invitados"}
                </button>
              ))}
            </div>
            {errors.asistencia && <p role="alert" style={errorBase}>{errors.asistencia}</p>}
          </div>

          {/* — TU MOTIVACIÓN — */}
          <Divider label="Tu motivación" />

          {/* Motivación */}
          <div>
            <label htmlFor="ff-motivacion" style={labelBase}>¿Por qué querés ser parte de Follow Fest? <span style={{ color: "#FF1B8D" }}>*</span></label>
            <textarea
              id="ff-motivacion"
              placeholder="Contanos un poco sobre vos y por qué te gustaría asistir..."
              value={formData.motivacion}
              onChange={e => set("motivacion", e.target.value)}
              disabled={loading}
              rows={5}
              aria-invalid={!!errors.motivacion}
              aria-describedby={errors.motivacion ? "ff-motivacion-err" : undefined}
              style={{ ...inputBase, resize: "vertical", minHeight: "120px", ...(errors.motivacion ? { borderColor: "rgba(255,27,141,.5)" } : {}) }}
              onFocus={onFocus(!!errors.motivacion)}
              onBlur={onBlur(!!errors.motivacion)}
            />
            {errors.motivacion && <p id="ff-motivacion-err" role="alert" style={errorBase}>{errors.motivacion}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "100px",
              border: "none",
              background: loading ? "rgba(182,69,214,.35)" : "linear-gradient(135deg, #B645D6, #7B61FF, #00D9FF)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              boxShadow: loading ? "none" : "0 0 40px rgba(182,69,214,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "opacity .2s ease",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: "inline-block",
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "ff-form-spin .6s linear infinite",
                }} />
                Enviando...
              </>
            ) : "ENVIAR APLICACIÓN"}
          </button>

          {formState === "error" && (
            <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,120,120,.9)", padding: "12px 16px", background: "rgba(255,50,50,.08)", borderRadius: "10px", border: "1px solid rgba(255,50,50,.2)" }}>
              Hubo un error al enviar. Intentá de nuevo.
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes ff-form-spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,.42); }
        form input:focus-visible,
        form textarea:focus-visible,
        form button:focus-visible {
          outline: 2px solid #00D9FF;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
