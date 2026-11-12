# Línea de base — hivrido.com

Medida el 2026-11-11 sobre el commit `f6938a1` (el mismo que está en producción),
rama `optimizacion-integral`, antes de tocar nada.

## Fase 0 — Reconocimiento

| Dato | Lo que se encontró |
|---|---|
| Stack | Next.js 16.2.2 (App Router, `next build --webpack`), React 19.2, TypeScript, Tailwind v4, GSAP, Lenis, framer-motion, three 0.170 |
| Build | `npm run build`: cuatro scripts de `prebuild` (CSS y bundle del anillo, variantes de imagen) + Next. 47 páginas prerenderizadas; lo único dinámico es `/api/cesion` |
| Hosting | Vercel (plan Hobby), proyecto **sin conectar a GitHub**: el push no publica, se despliega a mano desde una copia limpia de `HEAD` |
| Entorno de pruebas | No hay staging. Se midió sobre `next start` local (puerto 3311) |
| Servicios pagos | Ninguno nuevo. Regla aplicada: no se contrata nada sin consultar |

Los cuatro datos entre corchetes del encargo llegaron sin completar; son los de esta tabla.

### Cómo se midió

- **Lighthouse 12.8.2**, Chrome de escritorio en modo headless, 3 pasadas por página y factor de forma; se informa la **mediana por puntaje de Performance**. Móvil: 4G lento simulado + CPU ×4. Escritorio: preset `desktop`.
- Servidor local: no aplica los `headers` de `vercel.json` ni Brotli. La caché y la compresión de producción se auditan aparte (área A/G); los números de laboratorio sirven para comparar antes y después en las mismas condiciones.
- Los pesos son de transferencia (comprimidos), los que informa Lighthouse.
- El script y los JSON completos están en `auditoria/evidencia/lighthouse/antes/`.

## Inventario de rutas (44 + API)

| Grupo | Rutas |
|---|---|
| PLAY | `/` · `/okupas/` · `/play/<id>/` × 15: `cuchillo-paz`, `el-monarco`, `insomnio`, `haters`, `hackers`, `alma`, `erase-una-vez-en-virreyes`, `3-am`, `esnob`, `el-rectangulo-de-angeles`, `matanza`, `mia`, `el-armario-de-dani`, `el-cambio`, `atomico-82` |
| Productora | `/web/` (HTML estático, no es página de Next) · `/diseno-web/` · `/branding/` · `/equipo/` · `/publicidad/` · `/colmena-agentes/` · `/estudio/` · `/orbital/` |
| Artistas | `/artistas/` + 13 fichas: `amplax`, `kareen-nahirr`, `jairito-veras`, `enzo-arancibia`, `nahuel-m17`, `nicolas`, `florencia-martinez`, `kevo-kbron`, `alan-torres`, `uriel-g3`, `fasterdakill`, `flavia-rotela`, `zurdosound` |
| Convocatorias | `/casting/` · `/origen/` · `/cesion/` (+ `POST /api/cesion`) |
| Sistema | `/sitemap.xml` (35 URLs) · `/robots.txt` |
| Fuera de alcance | `/alejandradelfino/` (sitio de un tercero alojado en el dominio) |

Redirecciones vigentes (`vercel.json`): `/play`, `/movie` → `/` · `/movie/okupas` → `/okupas/` · `/firma` → `/cesion/` · `/casting/cuchillo-paz`, `/suscribite` → `/casting/` · `/cine-video` → `/web/`.
`/colmenas-agentes/` hoy responde **404** en producción.

## Lighthouse — móvil

| Página | Perf (3 pasadas) | A11y | BP | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| Home PLAY `/` | **65** (61/73/65) | 96 | 79 | 100 | 1,7 s | **5,2 s** | 607 ms | 0,016 | 1,9 s |
| Ficha `/play/el-rectangulo-de-angeles/` | **77** (77/77/73) | 96 | 79 | 100 | 1,7 s | **4,2 s** | 348 ms | 0,011 | 1,7 s |
| Institucional `/web/` | **78** (62/78/80) | 100 | 96 | 100 | 2,2 s | 3,5 s | 405 ms | 0 | 3,3 s |
| Servicio `/diseno-web/` | **72** (72/81/71) | 96 | 79 | 100 | 1,5 s | 2,8 s | **846 ms** | 0 | 4,8 s |
| Agentes IA `/colmena-agentes/` | **87** (88/79/87) | 96 | 79 | 100 | 1,4 s | 2,6 s | 384 ms | 0,018 | 2,2 s |
| Artistas `/artistas/` | **85** (83/85/85) | 100 | 79 | 100 | 1,4 s | 2,6 s | 463 ms | 0 | 1,8 s |
| Casting `/casting/` | **82** (75/85/82) | 100 | 79 | 100 | 1,4 s | 3,3 s | 408 ms | 0 | 2,2 s |

Objetivo del encargo en móvil: Performance ≥ 90, LCP < 2,5 s, CLS < 0,1, A11y/BP/SEO ≥ 95.
**Ninguna página llega hoy en Performance ni en LCP; Best Practices falla en todas las de Next.**

## Lighthouse — escritorio

| Página | Perf (3 pasadas) | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Home PLAY | 97 (97/97/97) | 96 | 78 | 100 | 0,4 s | 0,9 s | 16 ms | 0,021 |
| Ficha | **63** (98/63/54) | 96 | 78 | 100 | 0,5 s | 1,2 s | **1081 ms** | 0,008 |
| `/web/` | 95 (78/95/98) | 100 | 100 | 100 | 0,5 s | 1,1 s | 133 ms | 0 |
| Servicio | 100 | 96 | 78 | 100 | 0,3 s | 0,5 s | 12 ms | 0,001 |
| Agentes IA | 100 | 96 | 78 | 100 | 0,3 s | 0,6 s | 0 ms | 0,002 |
| Artistas | 100 | 100 | 78 | 100 | 0,4 s | 0,6 s | 14 ms | 0 |
| Casting | 100 | 100 | 78 | 100 | 0,3 s | 0,6 s | 0 ms | 0,002 |

La ficha en escritorio es inestable (98 → 54 entre pasadas, con hasta 2 s de bloqueo): queda como hallazgo a explicar en la auditoría de rendimiento.

## Peso por página (transferido, móvil)

| Página | Total | Requests | JS | Imágenes | Fuentes | HTML (con CSS incrustado) | Terceros |
|---|---|---|---|---|---|---|---|
| Home PLAY | **1459 KB** | 49 | 358 KB (16) | 847 KB (9) | 94 KB (4) | 68 KB | 168 KB (6) |
| Ficha | 847 KB | 32 | 358 KB (15) | 292 KB (5) | 94 KB (4) | 70 KB | 168 KB (6) |
| `/web/` | 417 KB | 15 | 152 KB (6) | 0 (texturas por `fetch`) | 47 KB (2) | 15 KB | 0 |
| Servicio | 519 KB | 26 | 418 KB (17) | ~0 | 47 KB (2) | 54 KB | 168 KB (7) |
| Agentes IA | 522 KB | 25 | 418 KB (17) | ~0 | 47 KB (2) | 57 KB | 168 KB (6) |
| Artistas | 471 KB | 23 | 361 KB (15) | ~0 | 47 KB (2) | 63 KB | 168 KB (6) |
| Casting | 630 KB | 23 | 360 KB (14) | 163 KB (3) | 47 KB (2) | 60 KB | 168 KB (6) |

- CSS externo: 0 KB en todas (`experimental.inlineCss` lo mete en el HTML; la home pesa 388 KB de HTML sin comprimir).
- Video: 0 KB en la carga inicial móvil. En **escritorio** la home sube a **4,6 MB y 82 requests** porque el hero arranca el tráiler de YouTube de fondo (2,6 MB de terceros).
- Los 168 KB de terceros de cada ruta de Next son la etiqueta de Google Ads.

## Elemento LCP de cada página

| Página | Elemento |
|---|---|
| Home PLAY | `div.hp-hero-img` — el afiche del primer destacado, pintado como `background-image` (`rectangulo-v2.webp`, 180 KB) |
| Ficha | `div.tv-ambient` — el afiche desenfocado de fondo, también por CSS |
| `/web/` | móvil: `#bootTagline` ("Is the Future", el preloader); escritorio: `#hudRight` |
| Servicio / Agentes | `p.dw-hero-text` (texto del hero) |
| Artistas | `p.art-index-lead` |
| Casting | móvil: `.mp-casting-eyebrow`; escritorio: `.nav-btn-text` |

## Consola y red (barrido de las 42 rutas, 390 y 1440 px)

- Sin errores de JavaScript propios ni de hidratación en ninguna ruta.
- `/artistas/zurdosound/`: **404** de `https://i.ytimg.com/vi/9gfOzsrV9Qc/maxresdefault.jpg` (la miniatura en esa resolución no existe).
- `/artistas/amplax/` y `/artistas/zurdosound/`: el `.mp3` del reproductor se empieza a bajar y se aborta al cargar (precarga a revisar).
- Pedidos abortados a `google.com/ccm` y `google.com/rmkt` en cada ruta de Next: son de la etiqueta de Ads en localhost, ruido esperado.

Detalle por ruta en `auditoria/evidencia/capturas/antes/consola.json`.

## Capturas

`auditoria/evidencia/capturas/antes/` — por cada ruta y ancho (390 y 1440 px):
`<ruta>.<ancho>.fold.jpg` (primer pantallazo, ya retirada la cortina) y `<ruta>.<ancho>.full.jpg` (página completa tras recorrerla).
164 imágenes, 22 MB.

> `auditoria/evidencia/` no se versiona (capturas, videos y JSON de Lighthouse pesan decenas de MB): vive en esta carpeta, fuera de git. Los informes `.md` sí se versionan.
