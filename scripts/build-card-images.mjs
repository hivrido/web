/**
 * Genera las variantes chicas del material de las tarjetas del cosmos.
 *
 * Las texturas se componen en un canvas de 512x384 en táctiles, pero las
 * fuentes son las fotos del sitio a tamaño completo: se descargaban 702 KiB
 * para pintar unos doscientos mil píxeles. Cada archivo se reduce al lado que
 * la textura puede llegar a usar y nada más: 280 KiB.
 *
 * Las originales no se tocan: las usan /equipo, /orbital y About, donde sí se
 * ven a tamaño completo. Esto es una copia paralela en /images/cards.
 *
 * ── Sobre por qué hay un manifiesto ──
 * El reencodeo usa System.Drawing vía PowerShell, que solo existe en Windows,
 * y el build de producción corre en Linux. Las variantes van commiteadas, así
 * que allá no hay nada que generar: el manifiesto guarda el hash de cada
 * fuente y, si coincide, el script no toca nada y no necesita PowerShell.
 * Comparar fechas no serviría —git no preserva mtimes, en un clon nuevo son
 * todas la del checkout—, y si una foto cambia de verdad, avisa fuerte en vez
 * de romper el deploy.
 *
 * Corre antes de `next build`, vía el script `prebuild`.
 */
import { readFile, writeFile, mkdir, stat, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(root, "public", "images", "cards");
const manifestPath = path.join(root, "scripts", "card-images.manifest.json");

/* Tope del lado largo. Estas variantes las consume solo el teléfono, donde la
   textura mide 512x384: drawCover escala la foto para cubrir ese rectángulo,
   así que con 720 en el lado mayor sobra en todos los encuadres. Escritorio
   sigue usando los originales, que ahí sí se ven a 1024x768. */
const MAX_SIDE = 720;
const QUALITY = 72;

/** Fuentes, tomadas de las rutas que declara public/cosmos/projects.js. */
const SOURCES = [
  "bg/21.jpg",
  "bg/docke.jpg",
  "bg/animacion-poster.jpg",
  "bg/hivrido-chrome.jpg",
  "team/1.jpg",
  "team/2.jpg",
];

/* Los valores viajan por entorno y no como argumentos: -Command no los
   recibe, y así ninguna ruta con espacios necesita comillas. */
const PS = `
Add-Type -AssemblyName System.Drawing
$src = $env:CARD_SRC; $dst = $env:CARD_DST
$maxSide = [int]$env:CARD_MAXSIDE; $q = [long]$env:CARD_Q
$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width; $h = $img.Height
$long = [math]::Max($w, $h)
if ($long -gt $maxSide) {
  $k = $maxSide / $long
  $w = [int][math]::Round($w * $k); $h = [int][math]::Round($h * $k)
}
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(255,10,7,16))
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose()
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q
$bmp.Save($dst, $codec, $ep)
$bmp.Dispose(); $img.Dispose()
`;

const sha = async (p) =>
  createHash("sha256").update(await readFile(p)).digest("hex").slice(0, 16);

const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };

const readManifest = async () => {
  try { return JSON.parse(await readFile(manifestPath, "utf8")); } catch { return {}; }
};

await mkdir(outDir, { recursive: true });

const manifest = await readManifest();
const next = {};
const stale = [];
let total = 0;

for (const rel of SOURCES) {
  const src = path.join(root, "public", "images", rel);
  const dst = path.join(outDir, rel.replace(/[/\\]/g, "-"));
  const key = `${rel}@${MAX_SIDE}q${QUALITY}`;

  const hash = await sha(src);
  next[key] = hash;

  if (manifest[key] === hash && (await exists(dst))) {
    total += (await stat(dst)).size;
    continue;
  }
  stale.push({ src, dst });
}

if (stale.length) {
  const canResize = process.platform === "win32";

  if (!canResize) {
    /* No se puede regenerar acá, pero romper el deploy por esto sería peor:
       las variantes commiteadas siguen sirviendo. Que se note, eso sí. */
    console.warn(
      `\n  ⚠ ${stale.length} variante(s) de tarjeta desactualizada(s) y este sistema no ` +
        `puede regenerarlas (requiere Windows).\n    Corré \`node scripts/build-card-images.mjs\` ` +
        `en Windows y commiteá el resultado junto al manifiesto.\n`
    );
  } else {
    for (const { src, dst } of stale) {
      await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", PS], {
        env: {
          ...process.env,
          CARD_SRC: src, CARD_DST: dst,
          CARD_MAXSIDE: String(MAX_SIDE), CARD_Q: String(QUALITY),
        },
      });

      /* Una foto ya chica y bien comprimida puede salir más pesada de un
         reencodeo que no la achica. En ese caso la variante es la original. */
      if ((await stat(dst)).size >= (await stat(src)).size) await copyFile(src, dst);
    }
    await writeFile(manifestPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  }

  for (const { dst } of stale) if (await exists(dst)) total += (await stat(dst)).size;
}

console.log(
  `cards -> ${SOURCES.length} variantes, ${(total / 1024).toFixed(0)} KiB` +
    (stale.length ? ` (${stale.length} regeneradas)` : " (sin cambios)")
);
