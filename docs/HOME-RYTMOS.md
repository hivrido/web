# Home de RYTMOS

La raíz de hivrido.com deja de ser el catálogo de Hivrido PLAY y pasa a ser
el lanzamiento de **RYTMOS**, la nueva serie de la plataforma. El catálogo se
muda entero, sin cambios visuales, a **`/play/`**. La home nueva es además la
puerta a todo Hivrido: cualquier página del sitio queda a uno o dos toques.

Rama: `home-rytmos`, mergeada a `main`. **Publicado el 22/11/2026**
(deploy `hivrido-cq4y333vp`, reglas de proyecto de Vercel actualizadas).

---

## 1 · Qué se construyó

### Rutas

| Ruta | Antes | Ahora |
|---|---|---|
| `/` | Catálogo de PLAY | Home de RYTMOS |
| `/play/` | Redirigía a `/` | Catálogo de PLAY, idéntico, con canónica propia |
| `/play/rytmos/` | — | Ficha de la serie (mismo componente que el resto) |
| `/#series`, `/#peliculas`, `/#proximamente` | Anclas del catálogo | Redirigen a `/play/#…` (ver abajo) |
| `/movie`, `/series`, `/peliculas` | → `/` | → `/play/`, `/play/#series`, `/play/#peliculas` |
| `/play/<id>/`, `/okupas/` y todo lo demás | — | Sin cambios |

**Anclas viejas.** El `#series` de una URL no llega al servidor, así que no
se puede redirigir en `vercel.json`. Lo resuelve un script en línea al tope de
la home, que corre antes del primer pintado, más un efecto de React que cubre
la navegación interna de Next.

**Enlaces actualizados.** Header y pie de PLAY, menú del teléfono, menú de
las páginas institucionales (`Header.tsx`), menú y tarjeta del anillo de
`/web/` ("03 Hivrido PLAY" y "Ver el catálogo"), "Mirá el catálogo" del
casting, "Ver catálogo completo" de Okupas, migas de las fichas y de Okupas,
y el nombre de sección de los mensajes de WhatsApp.

**Logo partido.** En PLAY, el logo de Hivrido vuelve a `/` y la píldora
**PLAY** lleva a `/play/`. "Inicio" va a `/`.

### La home

En orden. Cada bloque aparece solo si tiene contenido real en
`app/lib/rytmos.ts`. **Hoy se ven el hero, "Seguí en Hivrido PLAY", "Todo
Hivrido" y el pie**, porque la ficha de la serie llegó vacía.

1. **Hero de lanzamiento.** Key art de fondo (o, sin él, la sala a oscuras
   con la luz de la marca), loop de video opcional con botón de pausa, el
   logo de la serie en 3D, badge (Próximamente / Estreno /
   clasificación), cuenta regresiva si hay fecha, y los llamados: **Ver
   tráiler**, **Avisame** (abre WhatsApp con "Avisame cuando se estrene
   RYTMOS en PLAY" y el origen) y **Explorar Hivrido PLAY**.
2. **Tráiler**, con carga diferida: portada liviana y el reproductor recién
   al tocar. YouTube usa el reproductor de PLAY; un archivo propio, `<video>`
   con subtítulos.
3. **La serie**: sinopsis larga y ficha técnica.
4. **Elenco**: tarjetas con inclinación hacia el cursor en escritorio y
   deslizables en el teléfono.
5. **Episodios**: la lista, o la línea "Temporada 1 · N episodios".
6. **Detrás de escena**: galería con visor a pantalla completa (teclado y
   Escape).
7. **Banda sonora**: barras que siguen la música después del play, nunca con
   audio automático. Si la serie es musical (`musicaProtagonista`), sube
   debajo del tráiler.
8. **Prensa y premios.**
9. **Seguí en Hivrido PLAY**: "Selección Hivrido" y "Próximamente" con las
   mismas tarjetas del catálogo, y "Ver todo el catálogo".
10. **Todo Hivrido sale de acá**: las diez puertas numeradas sobre la colmena
    y el H▷ cromado de la capa inmersiva.
11. **Pie** con el mapa completo, contacto, redes y "Cine y series hechos en
    Argentina".

Header fijo y mínimo (logo, anclas de la serie que existan, PLAY y menú), menú
con el mapa completo y botón flotante de WhatsApp.

### Movimiento

- **Logo 3D** (`LogoRytmos.tsx`, SVG + CSS, sin WebGL): las letras del logo
  caen a compás (1 · 3 · 2 · 4 · 2 · 4), la extrusión crece hacia atrás en
  capas del ultravioleta al negro de marca, el cartel gira hasta su pose, se
  enciende en neón con un barrido de luz y se inclina hacia el cursor. Cada
  7 s, y al pasar el mouse, la señal se corta: copias en neón lila y ámbar se
  separan en franjas (glitch). Al bajar, se recuesta y se ve su espesor. El
  3D es ortográfico a propósito: con perspectiva, Chrome rasterizaba las
  capas a baja resolución y el logo se pixelaba.
- **Scroll:** titulares que se revelan por palabras, parallax del key art y
  de la galería, entradas escalonadas, secciones que se apagan al salir. Son
  *scroll-driven animations* de CSS: cero JavaScript, y el navegador que no
  las tiene muestra todo quieto y completo.
- **View Transitions:** el nombre de RYTMOS viaja de la home y del catálogo a
  su ficha (`app/components/play/transicion.tsx`).
- **Movimiento reducido:** nada se anima, el loop de video no se carga.

No se sumó GSAP a la home: lo que pedía el encargo se resuelve en CSS sin
costo de arranque.

### SEO

- Título: **"RYTMOS — La nueva serie de Hivrido PLAY"**. Rytmos también es un
  videojuego, así que título, descripción y datos estructurados dicen siempre
  "serie" y "Hivrido PLAY".
- Open Graph y Twitter Card con imagen 1200 × 630. Hoy es una tarjeta
  tipográfica (nombre y marca); con el key art se genera la definitiva.
- JSON-LD: `TVSeries` (solo con los datos cargados; trailer, actor, director,
  género, episodios y fecha entran solos), `Organization`, `WebSite` y
  `BreadcrumbList`.
- Sitemap: `/`, `/play/` y, cuando la ficha deja de ser provisoria,
  `/play/rytmos/`.

### Medición

Todo sale por `medir()` (ver auditoria/PENDIENTES.md: lo recibe la etiqueta
de Ads y aparece en GA4 cuando se cargue `NEXT_PUBLIC_GA4_ID`). Los clics se
marcan con `data-medir` y los mide el mismo oyente global de los contactos.

| Evento | Cuándo | Parámetros |
|---|---|---|
| `ver_trailer_click` | "Ver tráiler" del hero | `origen` |
| `video_start` · `video_progress` (25/50/75) · `video_complete` | Reproducción del tráiler | `video_title`, `video_percent` |
| `avisame_click` | Avisame del hero | `titulo`, `origen` |
| `explorar_play` | Cualquier salida al catálogo | `origen` (hero, header, segui_en_play) |
| `ficha_click` | "Ficha en PLAY" | `origen` |
| `hub_click` | Cada puerta de "Todo Hivrido" | `destino` |
| `ost_play` | Play de un tema | `tema` |
| `whatsapp_click` + conversión de Ads | Cualquier WhatsApp | `lugar` (avisame, hub, el pie, el botón de WhatsApp…) |

Cada WhatsApp lleva su mensaje con el origen: "…(desde la portada)",
"…(Todo Hivrido)", "…desde la portada (el botón de WhatsApp)".

---

## 2 · Cómo se cambia el contenido de la serie

Todo en **[app/lib/rytmos.ts](../app/lib/rytmos.ts)**. Cada campo vacío está
marcado `TODO-CONTENIDO`. Con las imágenes:

1. Poné los másters en `material/rytmos/` con estos nombres: `key-art.jpg`,
   `key-art-vertical.jpg`, `elenco-<nombre>.jpg`, `still-01.jpg`…
2. Corré `node scripts/build-rytmos-images.mjs`. Genera AVIF + WebP por ancho,
   la imagen para compartir y el afiche del catálogo, e imprime las líneas
   para pegar en `rytmos.ts`.
3. `npm run build`, mirar, commitear.

La tarjeta y la ficha del catálogo se derivan de ese mismo archivo: no hay
que tocar `catalog.ts`. Medidas exactas de cada pieza: ver
[PENDIENTES-RYTMOS.md](PENDIENTES-RYTMOS.md).

---

## 3 · Cómo se vuelve a la home anterior

**Un solo cambio, más un deploy.** El interruptor es
[app/lib/portada.ts](../app/lib/portada.ts). Cualquiera de los dos:

- **Sin tocar código:** cargar `PORTADA=play` en las variables de entorno del
  proyecto en Vercel (Production) y volver a desplegar.
- **En el código:** en `app/lib/portada.ts`, que el valor por defecto sea
  `"play"`, y build + deploy.

Con `PORTADA=play`, `/` vuelve a ser el catálogo exacto de antes (mismo
título, misma canónica, mismo schema.org), las anclas `/#series` dejan de
redirigir y `/play/` sigue respondiendo pero declara `/` como canónica, así
que Google no ve dos páginas iguales. Los enlaces a `/play/` siguen
funcionando: no hay que revertirlos.

Probado: `PORTADA=play npm run build` y `PORTADA=play python -I
tests/e2e/rytmos.py` (ver el punto 5).

Para volver del todo atrás a nivel código: los commits de la rama son seis y
se revierten en orden inverso.

---

## 4 · Cómo se publicó (y cómo se repite)

Se hizo en este orden el 22/11/2026:

1. **Reglas de proyecto de Vercel.** Están fuera del repo y corren en el CDN
   antes que el deploy (CLAUDE.md, "Reglas de proyecto: un solo salto"). Hoy
   hay cuatro que contradicen esta rama:

   | # | Regla | Hoy | Tiene que quedar |
   |---|---|---|---|
   | 7 | `^/play/?$` | → `/` | **borrada**: si queda, `/play/` sigue mandando a la home y el catálogo es inalcanzable |
   | 1 | `^/movie/?$` | → `/` | → `/play/` |
   | 18 | `^/peliculas/?$` | → `/` | → `/play/#peliculas` |
   | 19 | `^/series/?$` | → `/` | → `/play/#series` |

   Desde PowerShell (Git Bash rompe las rutas):
   `npx vercel routes ls`, `npx vercel routes update …`,
   `npx vercel routes publish`.
2. **Deploy** desde la copia limpia de `HEAD` (CLAUDE.md, "Deploy manual"): el
   proyecto de Vercel no está conectado a Git, así que el push no publica.
3. **Verificar** con curl: `/` sirve la home de RYTMOS, `/play/` responde 200
   sin redirigir, `/movie` llega a `/play/` en un salto.

**Riesgo a conocer: el 301 viejo quedó guardado en los navegadores.**
`/play → /` era permanente, y los navegadores guardan un 301 sin fecha de
vencimiento. Quien haya entrado alguna vez a `hivrido.com/play` tiene ese
salto guardado y, si escribe `/play/` o llega desde un enlace HTML común (el
menú de `/web/`), su navegador lo manda a la home sin consultar al servidor.
Dentro de la app no pasa: los `Link` de Next piden la página con otra URL
(`?_rsc=…`), que no coincide con la guardada. Se arregla solo cuando esa
persona limpia la caché. Si te preocupa, la alternativa es servir el catálogo
en una URL que nunca redirigió (`/catalogo/`) y dejar `/play/` como alias; no
lo hice porque el encargo pide `/play/`.

---

## 5 · Resultados antes / después

Lighthouse 12.8.2 sobre `next start` local, 3 pasadas por página y factor de
forma, mediana por Performance (mismo método que auditoria/linea-de-base.md).
Antes: `main` en `c70a109`. Después: esta rama, medida antes de sumar el logo
3D, que es SVG en línea y CSS (sin imágenes ni scripts nuevos).

### Móvil (4G lento simulado, CPU ×4)

| Página | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|---|---|---|
| `/` antes (catálogo) | 86 | 96 | 79 | 100 | 1,8 s | 3,6 s | 190 ms | 0,023 | 1134 KB |
| **`/` después (RYTMOS)** | **88** | 96 | 75 | 100 | 2,0 s | **3,5 s** | **138 ms** | **0,013** | **779 KB** |
| `/play/` (el catálogo, ya mudado) | 87 | 96 | 79 | 100 | 1,8 s | 3,6 s | 167 ms | 0,023 | 1169 KB |
| `/play/rytmos/` | 91 | 96 | 79 | 69\* | 1,8 s | 3,2 s | 133 ms | 0,001 | 701 KB |

### Escritorio

| Página | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` antes | 98 | 1,1 s | 0 ms | 0,022 |
| **`/` después** | **100** | **0,7 s** | 9 ms | 0,014 |
| `/play/` | 98 | 1,1 s | 1 ms | 0,022 |
| `/play/rytmos/` | 98 | 1,1 s | 0 ms | 0,001 |

\* SEO 69 en la ficha es el `noindex` de las fichas provisorias: se va solo
al cargar la sinopsis.

**Lo que no llega a los objetivos del encargo, y por qué.** El LCP móvil
(3,5 s contra 2,5 s) y Performance (88 contra 90) no dependen de la home: el
primer pintado ya tarda ~1,8 s en todas las páginas de Next del sitio, por el
CSS en línea y la etiqueta de Google Ads que carga en todas las rutas. Best
Practices (75–79) es la misma etiqueta de terceros, que tira cookies sin
aviso (auditoria/PENDIENTES.md, decisión 7). Accesibilidad 96 es el mismo
hallazgo que ya tenía PLAY. Con key art cargado, el LCP pasa a ser esa imagen,
servida en AVIF con `srcset` y precargada con prioridad alta.

### Pruebas

- `tests/e2e/flujos.py`: 17/17, incluido el rastreo de enlaces internos de
  todo el sitio sin rotos ni saltos.
- `tests/e2e/rytmos.py`: 16/16 con la home nueva (el del tráiler se saltea
  hasta que haya tráiler cargado) y la suite de vuelta atrás con
  `PORTADA=play`.


---

## 6 · Archivos

| Archivo | Qué es |
|---|---|
| `app/lib/portada.ts` | El interruptor de la portada |
| `app/lib/rytmos.ts` | La ficha de la serie: fuente única |
| `app/lib/mapa.ts` | Las diez puertas del hub, el menú y el pie |
| `app/components/rytmos/` | La home: `RytmosHome` (servidor, metadata, JSON-LD) y sus piezas |
| `app/components/play/PlayPortada.tsx` | El catálogo, montado en `/play/` y (si se vuelve atrás) en `/` |
| `app/components/play/transicion.tsx` | View Transitions entre páginas |
| `scripts/build-rytmos-images.mjs` | Másters → variantes AVIF/WebP |
| `tests/e2e/rytmos.py` | Pruebas de punta a punta de la home y la vuelta atrás |
