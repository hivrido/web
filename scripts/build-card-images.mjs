/**
 * Genera las variantes chicas del material de las tarjetas del cosmos.
 *
 * Las texturas se componen en un canvas de 512x384 en táctiles y 1024x768 en
 * escritorio, pero las fuentes son las fotos del sitio a tamaño completo: se
 * descargaban 702 KiB para pintar, en un teléfono, unos 200 mil píxeles. Cada
 * archivo se reduce al ancho que la textura puede llegar a usar y nada más.
 *
 * Las originales no se tocan: las usan /equipo, /orbital y About, donde sí se
 * ven a tamaño completo. Esto es una copia paralela en /images/cards.
 *
 * Corre antes de `next build`, vía el script `prebuild`. Si una variante ya
 * está al día se saltea, así el build no vuelve a comprimir en cada corrida.
 */
import { readdir, mkdir, stat, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(root, "public", "images", "cards");

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

/** Nombre plano: /images/bg/21.jpg -> /images/cards/bg-21.jpg */
export const cardVariant = (src) =>
  "/images/cards/" + src.replace(/^\/images\//, "").replace(/\//g, "-");

/* System.Drawing vía PowerShell: reencodear seis JPEG una vez por build no
   justifica sumar una dependencia binaria al proyecto. Los valores viajan por
   entorno y no como argumentos: -Command no los recibe, y así ninguna ruta
   con espacios necesita comillas. */
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

await mkdir(outDir, { recursive: true });

const mtime = async (p) => {
  try { return (await stat(p)).mtimeMs; } catch { return -1; }
};

let made = 0, total = 0;
for (const rel of SOURCES) {
  const src = path.join(root, "public", "images", rel);
  const dst = path.join(outDir, rel.replace(/[/\\]/g, "-"));

  if (await mtime(dst) >= await mtime(src)) {
    total += (await stat(dst)).size;
    continue;
  }

  await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", PS], {
    env: {
      ...process.env,
      CARD_SRC: src,
      CARD_DST: dst,
      CARD_MAXSIDE: String(MAX_SIDE),
      CARD_Q: String(QUALITY),
    },
  });

  /* Una foto ya chica y bien comprimida puede salir más pesada de un
     reencodeo que no la achica. En ese caso la variante es la original. */
  if ((await stat(dst)).size >= (await stat(src)).size) await copyFile(src, dst);

  total += (await stat(dst)).size;
  made++;
}

const files = (await readdir(outDir)).length;
console.log(
  `cards -> ${files} variantes, ${(total / 1024).toFixed(0)} KiB` +
    (made ? ` (${made} regeneradas)` : " (sin cambios)")
);
