/**
 * Registro de una cesión de derechos de imagen firmada.
 *
 * Todo lo que hace de esto una prueba y no un formulario se decide acá, del
 * lado del servidor: la hora, la IP y el hash del texto. Nada de eso se acepta
 * del cliente, porque el cliente es justamente la parte interesada.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { extractRealIp, parseUserAgent } from "@/app/lib/cesion/ipUtils";
import { getVersion } from "@/app/lib/cesion/textos";
import { insertarCesion, firmasRecientesDeIp, type FilaCesion } from "@/app/lib/cesion/db";

/* El handler lee headers del request, así que no puede prerenderizarse. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FIRMAS_POR_IP = 8;
const VENTANA_MINUTOS = 10;

/* Una firma PNG ronda los 10-40 KB en base64. 400 KB deja lugar de sobra para
   una pantalla grande y corta cualquier intento de usar la tabla de depósito. */
const MAX_FIRMA_BYTES = 400_000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const DATA_URL_PNG = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

/** Recorta y limpia lo que entra antes de que toque la base. */
function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const limpio = v.trim().slice(0, max).replace(/[<>]/g, "");
  return limpio || null;
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "hv-salt-change-me";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}

/** Edad cumplida al día de hoy. El mes y el día deciden, no solo el año. */
function calcularEdad(fechaNacimiento: string): number {
  const nac = new Date(`${fechaNacimiento}T00:00:00Z`);
  const hoy = new Date();
  let edad = hoy.getUTCFullYear() - nac.getUTCFullYear();
  const mes = hoy.getUTCMonth() - nac.getUTCMonth();
  if (mes < 0 || (mes === 0 && hoy.getUTCDate() < nac.getUTCDate())) edad--;
  return edad;
}

/** Marca temporal del servidor con el offset de Buenos Aires, en ISO 8601. */
function ahoraBuenosAires(): string {
  const ahora = new Date();

  const fecha = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(ahora)
    .replace(" ", "T");

  /* El offset se deriva del propio formateo en lugar de fijarlo en -03:00: si
     alguna vez vuelve el horario de verano, esto lo sigue solo. */
  const etiqueta =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
      timeZoneName: "longOffset",
    })
      .formatToParts(ahora)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT-03:00";

  const offset = etiqueta.replace("GMT", "") || "-03:00";
  return `${fecha}${offset}`;
}

function esPngRazonable(v: unknown): v is string {
  return typeof v === "string" && v.length <= MAX_FIRMA_BYTES && DATA_URL_PNG.test(v);
}

function malo(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const ip = extractRealIp(req);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return malo("Cuerpo inválido.");
  }

  // ---- Datos del participante ---------------------------------------------
  const nombre = str(body.nombre, 120);
  const dni = str(body.dni, 20);
  const fechaNacimiento = str(body.fecha_nacimiento, 10);
  const domicilio = str(body.domicilio, 200);
  const telefono = str(body.telefono, 40);
  const email = str(body.email, 160);

  if (!nombre || nombre.length < 3) return malo("Falta el nombre y apellido.");
  if (!dni || dni.replace(/\D/g, "").length < 7) return malo("El DNI no es válido.");
  if (!fechaNacimiento || !FECHA.test(fechaNacimiento)) return malo("Falta la fecha de nacimiento.");
  if (!domicilio || domicilio.length < 5) return malo("Falta el domicilio.");
  if (!telefono || telefono.replace(/\D/g, "").length < 8) return malo("El teléfono no es válido.");
  if (!email || !EMAIL.test(email)) return malo("El correo no es válido.");

  const edad = calcularEdad(fechaNacimiento);
  if (edad < 0 || edad > 120) return malo("La fecha de nacimiento no es válida.");
  const esMenor = edad < 18;

  // ---- Conformidad y firma ------------------------------------------------
  if (body.acepta !== true) return malo("Hay que aceptar los términos.");
  if (!esPngRazonable(body.firma_png)) return malo("Falta la firma.");
  const firmaPng = body.firma_png;

  /* La edad la recalcula el servidor: si el bloque del adulto se exigiera
     según lo que el cliente dice ser, alcanzaría con mentir la edad en el
     formulario para saltearlo. */
  let adultoNombre: string | null = null;
  let adultoDni: string | null = null;
  let adultoVinculo: string | null = null;
  let adultoTelefono: string | null = null;
  let firmaAdultoPng: string | null = null;

  if (esMenor) {
    adultoNombre = str(body.adulto_nombre, 120);
    adultoDni = str(body.adulto_dni, 20);
    adultoVinculo = str(body.adulto_vinculo, 60);
    adultoTelefono = str(body.adulto_telefono, 40);

    if (!adultoNombre || adultoNombre.length < 3) return malo("Falta el nombre del adulto responsable.");
    if (!adultoDni || adultoDni.replace(/\D/g, "").length < 7) return malo("El DNI del adulto responsable no es válido.");
    if (!adultoVinculo) return malo("Falta el vínculo del adulto responsable.");
    if (!adultoTelefono || adultoTelefono.replace(/\D/g, "").length < 8) return malo("El teléfono del adulto responsable no es válido.");
    if (!esPngRazonable(body.firma_adulto_png)) return malo("Falta la firma del adulto responsable.");

    firmaAdultoPng = body.firma_adulto_png;
  }

  // ---- Integridad del texto firmado ---------------------------------------
  /* El cliente manda el id de versión, nunca el hash: el servidor busca el
     texto en el archivo versionado y lo hashea él mismo. Un hash informado por
     quien firma no probaría nada, porque elegiría qué decir. */
  const versionId = str(body.texto_version, 20);
  const version = versionId ? getVersion(versionId) : null;
  if (!version) return malo("La versión del texto legal no existe.");

  const textoSha256 = crypto.createHash("sha256").update(version.texto, "utf8").digest("hex");

  // ---- Freno por IP -------------------------------------------------------
  try {
    const recientes = await firmasRecientesDeIp(ip, VENTANA_MINUTOS);
    if (recientes >= MAX_FIRMAS_POR_IP) {
      return NextResponse.json(
        { ok: false, error: "Demasiadas firmas desde esta conexión. Probá en unos minutos." },
        { status: 429 }
      );
    }
  } catch {
    /* Si el conteo falla, la firma pasa igual: perder una cesión legítima es
       peor que registrar una de más. */
  }

  // ---- Registro -----------------------------------------------------------
  const ua = req.headers.get("user-agent") || "";
  const parsed = parseUserAgent(ua);

  const fila: FilaCesion = {
    id: crypto.randomUUID(),
    creado_en: ahoraBuenosAires(),
    nombre,
    dni,
    fecha_nacimiento: fechaNacimiento,
    edad,
    domicilio,
    telefono,
    email,
    instagram: str(body.instagram, 80),
    numero_orden: str(body.numero_orden, 40),
    es_menor: esMenor,
    adulto_nombre: adultoNombre,
    adulto_dni: adultoDni,
    adulto_vinculo: adultoVinculo,
    adulto_telefono: adultoTelefono,
    firma_png: firmaPng,
    firma_adulto_png: firmaAdultoPng,
    texto_version: version.id,
    texto_sha256: textoSha256,
    ip,
    ip_hash: hashIp(ip),
    user_agent: ua.slice(0, 500),
    browser: parsed.browser,
    os: parsed.os,
    device_type: parsed.device_type,
    screen_resolution: str(body.screen_resolution, 20),
    viewport: str(body.viewport, 20),
    language: str(body.language, 20),
    timezone_dispositivo: str(body.timezone_dispositivo, 60),
    referrer: str(body.referrer, 500),
  };

  try {
    await insertarCesion(fila);
  } catch (e) {
    console.error("[cesion] no se pudo registrar:", e);
    return NextResponse.json(
      { ok: false, error: "No pudimos registrar la firma. Intentá de nuevo." },
      { status: 500 }
    );
  }

  /* Se devuelve el id y la hora para que la confirmación pueda mostrarle a la
     persona la constancia de lo que quedó registrado. */
  return NextResponse.json({ ok: true, id: fila.id, creado_en: fila.creado_en });
}
