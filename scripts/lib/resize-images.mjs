/**
 * Reencodeo de imágenes a una variante más chica, compartido por los dos
 * pipelines que lo necesitan: las texturas de las tarjetas del cosmos y los
 * fondos del slider de Hivrido PLAY.
 *
 * ── Sobre por qué hay un manifiesto ──
 * El reencodeo usa System.Drawing vía PowerShell, que solo existe en Windows,
 * y el build de producción corre en Linux. Las variantes van commiteadas, así
 * que allá no hay nada que generar: el manifiesto guarda el hash de cada
 * fuente y, si coincide, el script no toca nada y no necesita PowerShell.
 * Comparar fechas no serviría —git no preserva mtimes, en un clon nuevo son
 * todas la del checkout—, y si una foto cambia de verdad, avisa fuerte en vez
 * de romper el deploy.
 */
import { readFile, writeFile, mkdir, stat, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

/* Los valores viajan por entorno y no como argumentos: -Command no los
   recibe, y así ninguna ruta con espacios necesita comillas. */
const PS = `
Add-Type -AssemblyName System.Drawing
$src = $env:IMG_SRC; $dst = $env:IMG_DST
$maxSide = [int]$env:IMG_MAXSIDE; $q = [long]$env:IMG_Q
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

const readManifest = async (p) => {
  try { return JSON.parse(await readFile(p, "utf8")); } catch { return {}; }
};

/**
 * @param {object} o
 * @param {{src: string, dst: string, key: string}[]} o.jobs  par de rutas
 *        absolutas más la clave con que la fuente figura en el manifiesto
 * @param {string} o.outDir       directorio de salida, se crea si no está
 * @param {string} o.manifestPath dónde vive el registro de hashes
 * @param {number} o.maxSide      tope del lado largo, en píxeles
 * @param {number} o.quality      calidad JPEG, 1..100
 * @param {string} o.label        nombre del pipeline, para el log
 */
export async function resizeAll({ jobs, outDir, manifestPath, maxSide, quality, label }) {
  await mkdir(outDir, { recursive: true });

  const manifest = await readManifest(manifestPath);
  const next = {};
  const stale = [];
  let total = 0;

  for (const { src, dst, key: base } of jobs) {
    const key = `${base}@${maxSide}q${quality}`;
    const hash = await sha(src);
    next[key] = hash;

    if (manifest[key] === hash && (await exists(dst))) {
      total += (await stat(dst)).size;
      continue;
    }
    stale.push({ src, dst });
  }

  if (stale.length) {
    if (process.platform !== "win32") {
      /* No se puede regenerar acá, pero romper el deploy por esto sería peor:
         las variantes commiteadas siguen sirviendo. Que se note, eso sí. */
      console.warn(
        `\n  ⚠ ${label}: ${stale.length} variante(s) desactualizada(s) y este sistema no ` +
          `puede regenerarlas (requiere Windows).\n    Corré el script en Windows y ` +
          `commiteá el resultado junto al manifiesto.\n`
      );
    } else {
      for (const { src, dst } of stale) {
        await run("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", PS], {
          env: {
            ...process.env,
            IMG_SRC: src, IMG_DST: dst,
            IMG_MAXSIDE: String(maxSide), IMG_Q: String(quality),
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
    `${label} -> ${jobs.length} variantes, ${(total / 1024).toFixed(0)} KiB` +
      (stale.length ? ` (${stale.length} regeneradas)` : " (sin cambios)")
  );
}
