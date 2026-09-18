/**
 * Lectura de IP y parseo de user agent.
 *
 * Portado de la defensa de clics de Aqua Climas, que ya resolvía el mismo
 * problema: el cliente no puede decir cuál es su propia IP, así que el dato
 * sale de los headers que pone el proxy y de ningún otro lado.
 */

import type { NextRequest } from "next/server";

export function extractRealIp(req: NextRequest): string {
  // 1. Cloudflare — más confiable cuando hay CF proxy delante
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && isPublicIp(cfIp)) return cfIp.trim();

  /* 2. X-Forwarded-For — primera IP no privada de la cadena. En Vercel este
        es el header que llega, y el cliente puede mandar uno falso: por eso se
        toma la primera pública y no la primera a secas. */
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded
      .split(",")
      .map((s) => s.trim())
      .find((ip) => isPublicIp(ip));
    if (first) return first;
  }

  // 3. X-Real-IP de Nginx — se confía porque lo setea el servidor, no el cliente
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  // 4. Último recurso: cualquier IP de X-Forwarded-For (incluye privadas)
  if (forwarded) {
    const any = forwarded.split(",")[0]?.trim();
    if (any) return any;
  }

  // En localhost no hay headers de proxy — 127.0.0.1 es el fallback de dev
  return "127.0.0.1";
}

function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]{2,45}$/;
  if (!v4.test(ip) && !v6.test(ip)) return false;

  // Excluye loopback, rangos privados y link-local
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  ) {
    return false;
  }
  return true;
}

export interface ParsedUA {
  browser: string;
  os: string;
  device_type: "desktop" | "mobile" | "tablet";
}

export function parseUserAgent(ua: string): ParsedUA {
  const r: ParsedUA = { browser: "Unknown", os: "Unknown", device_type: "desktop" };
  if (!ua) return r;

  // El orden importa: Edge y Opera se anuncian como Chrome, y Chrome como Safari
  if (/Edg\/|EdgA\/|EdgW\//.test(ua)) r.browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) r.browser = "Opera";
  else if (/SamsungBrowser/.test(ua)) r.browser = "Samsung";
  else if (/Chrome\//.test(ua)) r.browser = "Chrome";
  else if (/Firefox\//.test(ua)) r.browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) r.browser = "Safari";
  else if (/MSIE|Trident\//.test(ua)) r.browser = "IE";

  /* La versión va aparte del nombre: el token que la lleva cambia según el
     navegador, así que se busca el que corresponde al ya detectado. */
  const version = extractVersion(ua, r.browser);
  if (version) r.browser = `${r.browser} ${version}`;

  if (/Windows NT/.test(ua)) r.os = "Windows";
  else if (/Android/.test(ua)) r.os = "Android";
  else if (/iPhone|iPad/.test(ua)) r.os = "iOS";
  else if (/Mac OS X/.test(ua)) r.os = "macOS";
  else if (/CrOS/.test(ua)) r.os = "ChromeOS";
  else if (/Linux/.test(ua)) r.os = "Linux";

  if (/iPad|Tablet/.test(ua)) {
    r.device_type = "tablet";
  } else if (/Mobile|Android|iPhone|iPod|mobi/i.test(ua)) {
    r.device_type = "mobile";
  }

  return r;
}

function extractVersion(ua: string, browser: string): string | null {
  const token: Record<string, RegExp> = {
    Edge: /Edg[AW]?\/(\d+[\d.]*)/,
    Opera: /OPR\/(\d+[\d.]*)/,
    Samsung: /SamsungBrowser\/(\d+[\d.]*)/,
    Chrome: /Chrome\/(\d+[\d.]*)/,
    Firefox: /Firefox\/(\d+[\d.]*)/,
    Safari: /Version\/(\d+[\d.]*)/,
    IE: /(?:MSIE |rv:)(\d+[\d.]*)/,
  };
  const re = token[browser];
  if (!re) return null;
  const m = ua.match(re);
  return m ? m[1] : null;
}
