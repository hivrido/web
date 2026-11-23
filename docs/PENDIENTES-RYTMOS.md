# RYTMOS — lo que falta cargar

La ficha de la serie llegó sin completar, así que la home se construyó con
cada bloque preparado y vacío. Todo vive en un solo archivo,
[app/lib/rytmos.ts](../app/lib/rytmos.ts), con cada campo marcado
`TODO-CONTENIDO`. **Un bloque sin datos no se muestra**: hoy la home enseña
solo lo que no depende de la ficha (el nombre, "Próximamente", Avisame, el
catálogo y el mapa del sitio).

Cuando cargás un dato, su bloque aparece solo, con su número de sección, su
ancla en el header y su lugar en el schema.org.

---

## Cómo se entrega el material

- **Imágenes:** los másters van en `material/rytmos/` (carpeta fuera de git y
  fuera de `public/`: un máster suelto en `public/` quedaría servido por URL).
  Después se corre `node scripts/build-rytmos-images.mjs`, que genera las
  variantes AVIF y WebP en `public/images/rytmos/` e imprime las líneas para
  pegar en `rytmos.ts`. Nunca agranda: si el máster es chico, la variante
  grande no se genera.
- **Texto:** mandámelo como texto plano. No hace falta formato.
- **Video y audio:** ver cada ítem.

---

## 1 · Identidad de la serie

| Pieza | Formato y medida | Archivo / campo | Si falta |
|---|---|---|---|
| **Nombre exacto** | Confirmar mayúsculas, tildes y estilo: hoy figura `RYTMOS` | `nombre` | Se usa `RYTMOS` |
| **Logo de la serie** | **Recibido** (`rytmos-logo.svg`, blanco). El hero lo anima en 3D | `logo` | — |
| **Tagline** | Una línea, hasta 60 caracteres | `tagline` | No se muestra |

## 2 · Key art (la pieza más importante)

Es el fondo del hero, el elemento que define la velocidad de carga (LCP) y la
fuente de la imagen para compartir y del afiche del catálogo.

| Pieza | Formato y medida | Archivo |
|---|---|---|
| **Key art apaisado** | **2400 × 1350 px (16:9), sin texto ni logo.** JPG de máxima calidad, PNG o TIFF. El sujeto en el centro o el tercio derecho: el tercio inferior izquierdo queda libre, porque ahí van el logo, el badge y los botones | `material/rytmos/key-art.jpg` |
| **Key art vertical** (muy recomendado) | **1080 × 1920 px (9:16), sin texto.** El sujeto en la mitad superior: la mitad de abajo la ocupan logo y botones | `material/rytmos/key-art-vertical.jpg` |

Sin la versión vertical, el teléfono recorta el centro del apaisado y pierde
casi tres cuartos de la imagen.

De `key-art.jpg` salen solas la **imagen para compartir** (1200 × 630,
`public/images/share/rytmos-key-art-share.jpg`) y el **afiche de la tarjeta** del
catálogo (1600 × 900, `public/images/series/rytmos.webp`). Hoy la imagen para
compartir es el logo sobre la sala violeta (`rytmos-portada-v2.jpg`). Si preferís una
pieza diseñada con el logo, mandala en 1200 × 630 y menos de 300 KB, con lo
importante en el centro, porque WhatsApp la recorta cuadrada.

**Loop de video del hero (opcional).** MP4 H.264, 1920 × 1080, entre 6 y 12 s,
**sin audio**, que empalme sin corte, sin texto, **hasta 3 MB**. Se carga
recién después de que la página terminó y nunca con movimiento reducido o
ahorro de datos. Va en `public/video/rytmos/loop.mp4` → campo `loop`.

## 3 · Tráiler

| Opción | Formato | Campo |
|---|---|---|
| **YouTube** (recomendada) | El ID del video, por ejemplo `dQw4w9WgXcQ` | `trailer: { ytId: "…" }` |
| Archivo propio | MP4 H.264 1080p, hasta 40 MB, más subtítulos en español en `.vtt` | `trailer: { src: "/video/rytmos/trailer.mp4", subtitulos: "/video/rytmos/trailer.es.vtt" }` |

YouTube es la opción recomendada porque no consume el ancho de banda del sitio
y el reproductor de PLAY ya le saca la interfaz de YouTube. Con tráiler cargado
aparecen el botón "Ver tráiler" del hero y la sección, y el schema.org suma el
`VideoObject`.

## 4 · La serie

| Dato | Formato | Campo |
|---|---|---|
| **Sinopsis corta** | Una línea, **hasta 155 caracteres** (es la meta description y la tarjeta del catálogo) | `sinopsisCorta` |
| **Sinopsis larga** | Un párrafo, 80 a 150 palabras, sin spoilers | `sinopsisLarga` |
| **Género** | Uno o dos: `["Drama", "Musical"]` | `genero` |
| **Clasificación** | Texto exacto, por ejemplo `+16` | `clasificacion` |
| **Temporada y episodios** | Número de temporada, cantidad de episodios, duración por episodio (`30 min`) | `temporada`, `episodios`, `duracionEpisodio` |
| **Créditos** | Rol y nombre: creación, dirección, guion, producción | `creditos` |
| **Fecha de estreno** | Día **y hora**, con zona: `2027-03-14T21:00:00-03:00` | `estreno` |

Con fecha de estreno aparece la cuenta regresiva en el hero, y al llegar a
cero se oculta sola. El badge ("Próximamente" → "Estreno") y el retiro de
Avisame, en cambio, se deciden al construir el sitio, porque las páginas son
estáticas: hace falta **un deploy después de la hora del estreno**.

**La sinopsis corta es la llave de la ficha:** mientras falte, `/play/rytmos/`
sigue provisoria (noindex, fuera del sitemap, sin schema.org). Al cargarla,
entra sola a Google y al sitemap.

## 5 · Elenco y personajes

| Pieza | Formato | Archivo / campo |
|---|---|---|
| Foto por integrante | **Retrato 4:5, 1080 × 1350 px como mínimo**, misma luz y fondo para todo el elenco, sin texto | `material/rytmos/elenco-<nombre>.jpg` |
| Nombre y personaje | Texto | `elenco: [{ nombre, personaje, foto }]` |

## 6 · Episodios

Título, una o dos líneas de descripción sin spoilers y duración, por episodio →
`listaEpisodios`. Si solo tenés la cantidad, alcanza con `temporada` y
`episodios`: la sección muestra "Temporada 1 · N episodios".

## 7 · Detrás de escena

Entre 8 y 12 stills y fotos de rodaje. **JPG de 1600 px de lado largo como
mínimo**, cada una con una descripción breve (es el texto alternativo) y el
crédito del fotógrafo si hay que darlo. Van como
`material/rytmos/still-01.jpg`, `still-02.jpg`…

## 8 · Banda sonora

Solo si hay música original y derechos para publicarla.

- MP3 de 320 kbps o AAC, con título y autor de cada tema → `bandaSonora`.
  Los archivos van en `public/mp3/rytmos/`.
- **Confirmá si la serie gira alrededor de la música.** El nombre lo sugiere,
  pero no lo di por hecho. Si es así, ponés `musicaProtagonista: true` y la
  sección sube justo debajo del tráiler, en tamaño grande. Las barras que
  reaccionan al audio se encienden solo cuando alguien toca play. Nunca hay
  audio automático.

## 9 · Prensa, premios y festivales

Solo si existen. Por cada uno: tipo (premio, festival o prensa), nombre,
detalle o cita y link → `prensa`.

---

## Decisiones que necesito de vos

1. **Nombre de marca: "Hivrido" o "Hívrido".** El encargo escribe "Hívrido";
   todo el sitio publicado, sus títulos y su schema.org dicen "Hivrido". Para
   no tener dos marcas en Google, la home nueva sigue al sitio. Si la grafía
   correcta lleva tilde, conviene cambiarla en todo el sitio de una vez.
2. **"País · Idioma: Argentina · Español"** aparece en la ficha técnica de
   todas las obras de PLAY, RYTMOS incluida. Confirmá que vale para la serie.
3. **El rol de Leandro Dome** (@leandro_dome) en la serie: hoy figura en
   "El equipo" solo con su nombre y su Instagram (`equipo` en rytmos.ts).
4. **Derechos de la música** (punto 8), antes de publicar cualquier tema.

## Firma de la cesión (/firma → /cesion) — sin base de datos (23/11)

La página ya es la del casting de RYTMOS (texto legal v2, que nombra la serie;
v1 queda intacta para las firmas anteriores). Pero el proyecto de Supabase que
guarda las firmas no existe más —su dirección no resuelve, ni en DNS público—,
así que **hoy enviar la firma da error y no se guarda nada**.

Para volver a activarla:
1. supabase.com → reactivar el proyecto pausado o crear uno nuevo (plan Free).
2. SQL Editor → pegar y correr `scripts/cesiones.sql`.
3. Settings → API: copiar Project URL y la `service_role` key.
4. Cargarlas en Vercel (Production) como `SUPABASE_URL` y
   `SUPABASE_SERVICE_ROLE_KEY`, y en `.env.local`. `IP_HASH_SALT` no se toca.
5. Redeploy y una firma de prueba.
