/* Alta de quien se suma desde el formulario de /alejandradelfino. Vive dentro
   de la carpeta del sitio para que la mudanza a alejandradelfino.com.ar siga
   siendo mover la carpeta y nada más. */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sitio } from "../../_lib/contenido";
import { insertarSumate, recientesDeIp } from "../../_lib/sumate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_POR_IP = 5;
const VENTANA_MINUTOS = 10;
const AYUDAS = new Set(sitio.sumate.ayudas);

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const limpio = v.trim().slice(0, max).replace(/[<>]/g, "");
  return limpio || null;
}

/* La IP no se guarda: solo su hash, que alcanza para frenar envíos en serie y
   no es un dato personal más que cuidar. */
function hashIp(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const salt = process.env.IP_HASH_SALT || "hv-salt-change-me";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}

function malo(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return malo("Cuerpo inválido.");
  }

  /* Campo trampa: invisible para las personas, los bots lo completan. Se les
     responde ok para que no reintenten con otra estrategia. */
  if (body.sitio_web) return NextResponse.json({ ok: true });

  const nombre = str(body.nombre, 120);
  const localidad = str(body.localidad, 80);
  const whatsapp = str(body.whatsapp, 30);
  const ayudas = Array.isArray(body.ayudas) ? body.ayudas.filter((a): a is string => typeof a === "string" && AYUDAS.has(a)) : [];
  const digitos = whatsapp?.replace(/\D/g, "") ?? "";

  if (!nombre || nombre.length < 3) return malo("Falta tu nombre y apellido.");
  if (!localidad || localidad.length < 2) return malo("Falta tu localidad.");
  if (!whatsapp || digitos.length < 8 || digitos.length > 15) return malo("El WhatsApp no es válido.");
  /* Sin consentimiento expreso no se guarda nada (Ley 25.326, art. 5). */
  if (body.consiente !== true) return malo("Necesitamos tu consentimiento para guardar los datos.");

  const ipHash = hashIp(req);
  try {
    if ((await recientesDeIp(ipHash, VENTANA_MINUTOS)) >= MAX_POR_IP) {
      return NextResponse.json({ ok: false, error: "Demasiados envíos desde esta conexión. Probá en unos minutos." }, { status: 429 });
    }
  } catch {
    /* Si el conteo falla, el alta pasa igual: perder a alguien que quiere
       sumarse es peor que guardar un registro de más. */
  }

  try {
    await insertarSumate({
      nombre,
      localidad,
      whatsapp,
      ayudas: [...new Set(ayudas)],
      /* El texto exacto que la persona aceptó, como constancia. */
      consentimiento: sitio.sumate.consentimiento,
      ip_hash: ipHash,
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
    });
  } catch (e) {
    console.error("[sumate] no se pudo registrar:", e);
    return NextResponse.json({ ok: false, error: sitio.sumate.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
