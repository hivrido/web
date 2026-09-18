/**
 * Acceso a la tabla de cesiones.
 *
 * Aqua Climas usa `node:sqlite` contra un archivo en disco, que en Vercel no
 * sirve: el filesystem es efímero y cada request puede caer en otra instancia,
 * así que la base se perdería en cada deploy. Acá el almacenamiento es Postgres
 * en Supabase, hablado por HTTP contra PostgREST.
 *
 * Se accede con `fetch` en lugar del SDK a propósito: son dos requests con
 * headers, no justifica una dependencia más. La service_role key ignora las
 * políticas RLS, así que este módulo es de servidor y nunca debe importarse
 * desde un componente cliente: solo lo usa el route handler.
 */

const URL_BASE = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLA = "cesiones";

export type FilaCesion = {
  id: string;
  creado_en: string;
  nombre: string;
  dni: string;
  fecha_nacimiento: string;
  edad: number;
  domicilio: string;
  telefono: string;
  email: string;
  instagram: string | null;
  numero_orden: string | null;
  es_menor: boolean;
  adulto_nombre: string | null;
  adulto_dni: string | null;
  adulto_vinculo: string | null;
  adulto_telefono: string | null;
  firma_png: string;
  firma_adulto_png: string | null;
  texto_version: string;
  texto_sha256: string;
  ip: string;
  ip_hash: string;
  user_agent: string;
  browser: string;
  os: string;
  device_type: string;
  screen_resolution: string | null;
  viewport: string | null;
  language: string | null;
  timezone_dispositivo: string | null;
  referrer: string | null;
};

function headers(): Record<string, string> {
  if (!URL_BASE || !SERVICE_KEY) {
    throw new Error(
      "Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno."
    );
  }
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function insertarCesion(fila: FilaCesion): Promise<void> {
  const res = await fetch(`${URL_BASE}/rest/v1/${TABLA}`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(fila),
    cache: "no-store",
  });

  if (!res.ok) {
    /* El cuerpo del error trae el detalle de Postgres —qué constraint falló—,
       que es lo único con lo que se puede diagnosticar después. */
    const detalle = await res.text().catch(() => "");
    throw new Error(`PostgREST ${res.status}: ${detalle.slice(0, 500)}`);
  }
}

/**
 * Cuántas firmas entraron desde esta IP en la última ventana.
 *
 * El limitador en memoria de Aqua Climas no se puede portar: en serverless cada
 * instancia tendría su propio Map y el contador arrancaría de cero todo el
 * tiempo. Acá la cuenta la lleva la base, que es la única memoria compartida.
 */
export async function firmasRecientesDeIp(
  ip: string,
  ventanaMinutos: number
): Promise<number> {
  const desde = new Date(Date.now() - ventanaMinutos * 60_000).toISOString();
  const query = `ip=eq.${encodeURIComponent(ip)}&creado_en=gte.${encodeURIComponent(desde)}`;

  const res = await fetch(`${URL_BASE}/rest/v1/${TABLA}?${query}&select=id`, {
    method: "HEAD",
    headers: { ...headers(), Prefer: "count=exact" },
    cache: "no-store",
  });

  if (!res.ok) return 0;

  /* PostgREST devuelve el total en Content-Range con la forma "0-24/135";
     lo que interesa es lo que va después de la barra. */
  const rango = res.headers.get("content-range");
  const total = rango?.split("/")[1];
  const n = total ? parseInt(total, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
