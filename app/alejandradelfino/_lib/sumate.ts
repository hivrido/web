/* Acceso a la tabla de quienes se suman (ver _scripts/sumate.sql). Mismo
   enfoque que /cesion —PostgREST por fetch, sin SDK—, pero propio de esta
   carpeta: cuando el sitio se mude a su dominio, se lleva su base con él.

   Usa la service_role key, que saltea RLS: este módulo es solo de servidor y
   únicamente lo importa el route handler. */

const URL_BASE = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLA = "delfino_sumate";

export type FilaSumate = {
  nombre: string;
  localidad: string;
  whatsapp: string;
  ayudas: string[];
  consentimiento: string;
  ip_hash: string;
  user_agent: string;
};

function headers(): Record<string, string> {
  if (!URL_BASE || !SERVICE_KEY) {
    throw new Error("Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  }
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };
}

export async function insertarSumate(fila: FilaSumate): Promise<void> {
  const res = await fetch(`${URL_BASE}/rest/v1/${TABLA}`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(fila),
    cache: "no-store",
  });
  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(`PostgREST ${res.status}: ${detalle.slice(0, 500)}`);
  }
}

/** Cuántos registros entraron desde esta conexión en la última ventana. */
export async function recientesDeIp(ipHash: string, ventanaMinutos: number): Promise<number> {
  const desde = new Date(Date.now() - ventanaMinutos * 60_000).toISOString();
  const query = `ip_hash=eq.${encodeURIComponent(ipHash)}&creado_en=gte.${encodeURIComponent(desde)}&select=id`;
  const res = await fetch(`${URL_BASE}/rest/v1/${TABLA}?${query}`, {
    method: "HEAD",
    headers: { ...headers(), Prefer: "count=exact" },
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const n = parseInt(res.headers.get("content-range")?.split("/")[1] ?? "0", 10);
  return Number.isNaN(n) ? 0 : n;
}
