# Auditoría de hivrido.com

Rama `optimizacion-integral`, sobre el commit `f6938a1` (el que está en producción).
Números de partida en [linea-de-base.md](linea-de-base.md); resultado en [RESULTADOS.md](RESULTADOS.md); lo que queda en tus manos en [PENDIENTES.md](PENDIENTES.md).

**Alcance real de esta auditoría.** Las cinco auditorías por área se lanzaron en paralelo y se cortaron dos veces por el límite de uso de la cuenta antes de escribir sus informes. Lo que sigue es lo que verifiqué yo mismo, más los datos crudos que esas corridas alcanzaron a dejar (el rastreo de las 42 rutas sin JavaScript y el crawl de enlaces). Las áreas E (recorrido UX móvil completo) y F (barrido con axe-core ruta por ruta) quedaron **parciales**: lo que no se llegó a revisar está listado al final, sin disimular.

Prioridades: **P0** crítico · **P1** alto impacto · **P2** mejora · **P3** idea a futuro.
Estado: ✅ hecho en esta rama · ◐ parcial · ☐ pendiente.

## Matriz de prioridades

| ID | Hallazgo | Prioridad | Esfuerzo | Estado |
|---|---|---|---|---|
| B1 | Un cartel a pantalla completa tapaba todo el sitio sin JavaScript | P0 | bajo | ✅ |
| B2 | `/web/` no tenía contenido en el HTML: preloader en 0% y un panel con guiones | P0 | medio | ✅ |
| A1 | GSAP se cargaba en todas las rutas solo para dibujar el logo (~2 s de hilo principal en móvil) | P0 | medio | ✅ |
| A2 | Los afiches de PLAY bajaban a 1600 px para tarjetas de 340 px (~850 KB en móvil) | P1 | medio | ✅ |
| A3 | El LCP de la portada y de las fichas es un `background-image` que el navegador descubre tarde | P1 | bajo | ◐ |
| A4 | La etiqueta de Google (165 KB) competía con la hidratación y perdía clics tempranos | P1 | bajo | ✅ |
| A5 | Cursor propio y scroll suave activos en táctil; el cursor recorría todo el DOM en cada cambio | P1 | bajo | ✅ |
| A6 | La cortina "Is the Future / 0%" tapa 1,8 s las landings de servicio | P1 | medio | ☐ |
| C1 | Enlaces internos y canónicas sin barra final: cada clic del menú pagaba un 308 | P1 | bajo | ✅ |
| C2 | Faltaban datos estructurados: negocio local, Service, Person, tráiler, duración, migas | P1 | medio | ✅ |
| C3 | Variantes probables de URL daban 404 (`/colmenas-agentes/`, `/agentes/`, `/artista/`…) | P1 | bajo | ✅ |
| C4 | `lang="es"` en lugar de `es-AR` | P2 | bajo | ✅ |
| D1 | 25 enlaces a WhatsApp en dos formatos y con mensajes genéricos repetidos | P1 | medio | ✅ |
| D2 | Códigos internos visibles en Agentes IA ("ANL", "CTN", "VNT") | P1 | bajo | ✅ |
| D3 | Fichas de PLAY sin año, duración o sinopsis | P1 | — | ☐ contenido |
| D4 | Testimonios duplicados en cinco archivos; nombres y marcas a confirmar | P1 | bajo | ☐ decisión |
| D5 | "Ver más →" de las filas de servicio | P2 | bajo | ☐ |
| F1 | La colmena de agentes no se podía usar con teclado | P1 | bajo | ✅ |
| F2 | Textos de 7–8 px y contraste bajo dentro de la colmena | P1 | bajo | ✅ |
| G1 | Sin cabeceras de seguridad más allá de HSTS | P1 | bajo | ✅ |
| G2 | Sin CSP completa | P2 | medio | ◐ |
| H1 | Los clics a WhatsApp no distinguían origen; los de `/web/` no se miden | P1 | bajo | ◐ |
| H2 | No hay GA4, Search Console ni Meta Pixel | P2 | — | ☐ cuentas |

---

## A. Rendimiento

### [A1] GSAP en todas las rutas por una animación de dos segundos — ✅
- **Evidencia:** `app/components/ui/LogoAnimated.tsx` hacía `import("gsap")`; el logo está en el header de todo el sitio. En el Lighthouse móvil de la portada, el chunk `c15bf2b0` (GSAP) sumaba **1996 ms** de evaluación, y 1051 ms en la ficha. `app/components/ui/SmoothScroll.tsx` además importaba `gsap/ScrollTrigger` en cada ruta con `ClientShell`, y `app/hooks/useStaggerReveal.ts` lo pedía para un fundido.
- **Impacto:** alto. Es el mayor costo de hilo principal de PLAY, por donde entra el tráfico de los estrenos. Y una vez cargado, su reloj corre en cada cuadro.
- **Solución aplicada:** el logo se dibuja con CSS (`.hv-logo` en `globals.css`), con el logo lleno como estado de reposo: sin JS o con movimiento reducido se ve igual. Las entradas escalonadas pasan a transiciones CSS. GSAP queda solo donde hace coreografía de verdad (`SectionTitle`, `CountUp`, `/estudio/`).

### [A2] Afiches a resolución de escritorio en el teléfono — ✅
- **Evidencia:** `images.unoptimized: true` (`next.config.ts`) hace que `next/image` no genere `srcset`. Lighthouse móvil: `virreyes.webp` 203 KB de más, `elmonarco.jpg` 188 KB, `cuchillo-paz.webp` 118 KB; 847 KB de imágenes en la portada.
- **Solución aplicada:** variantes de 640 y 960 px (`scripts/build-poster-variants.mjs`, 18 archivos, commiteados) y componente `Poster` con `srcset`/`sizes`. El hero pasa de `background-image` a `<img>` con `fetchpriority="high"` y el `preload` anuncia el mismo `srcset`.

### [A3] El elemento LCP es un fondo por CSS — ◐
- **Evidencia:** LCP de la portada = `div.hp-hero-img`; de la ficha = `div.tv-ambient` (el afiche con `filter: blur(80px)`, `app/play/[id]/title.css:9`).
- **Hecho:** portada resuelta en A2. En la ficha, el fondo desenfocado y la miniatura usan ahora la variante de 640 px.
- **Pendiente (P2):** la ficha sigue teniendo como LCP un fondo desenfocado. Y la ficha en escritorio midió 98/63/54 con hasta 2 s de bloqueo: el candidato es ese `blur(80px)` sobre 80vh en un Chrome sin GPU (headless). No lo confirmé con una traza; ver RESULTADOS para el número posterior.

### [A4] Etiqueta de Google — ✅
- **Evidencia:** `app/components/analytics/GoogleTag.tsx` usaba `afterInteractive` sin definir antes `gtag`/`dataLayer`. 165 KB y 370–475 ms de hilo en móvil en cada ruta; un clic a WhatsApp anterior a su llegada no se registraba (`window.gtag?.()` no existía).
- **Solución aplicada:** la cola va en línea en el HTML y la librería baja con `lazyOnload`.

### [A5] Cursor y scroll suave en táctil — ✅
- **Evidencia:** `Cursor.tsx` ponía `cursor: none`, corría un `requestAnimationFrame` permanente y un `MutationObserver` que ante cada cambio del DOM volvía a recorrer todos los enlaces; nada de eso se limitaba a dispositivos con mouse. `SmoothScroll.tsx` instanciaba Lenis siempre.
- **Solución aplicada:** ambos solo con `(hover: hover) and (pointer: fine)`; Lenis ni se descarga en táctil o con movimiento reducido; el cursor usa un oyente delegado.

### [A6] La cortina de carga — ☐ P1
- **Evidencia:** `app/components/layout/Loader.tsx`: cortina opaca renderizada desde el servidor, 1,8 s fijos (más la hidratación), en `/diseno-web/`, `/branding/`, `/equipo/`, `/publicidad/`, `/colmena-agentes/`, `/casting/`, `/estudio/`, `/origen/`. `/artistas/` ya la saltea (`preloader={false}`). Se salta 30 minutos después de verla. Speed Index móvil de `/diseno-web/`: 4,8 s.
- **Por qué no la toqué:** el propio código la justifica como decisión de identidad ("la identidad tiene que ser la misma en las dos rutas"). Quitarla de las landings que reciben pauta es lo que más mejoraría la primera impresión, pero cambia cómo se presenta la marca: es tu decisión. Ver PENDIENTES.

### Verificado, sin hallazgo
- **Tráileres:** ningún pedido a YouTube antes del clic en las fichas (`CinePlayer.tsx` monta el iframe recién al dar play). Lo cubre un test.
- **Hero con video:** solo en escritorio, con la página ya cargada, sin ahorro de datos ni movimiento reducido (`Hero.tsx`, `canPreview`).
- **Fuentes:** `next/font` con subset latino y `display: swap`; en `/web/`, variables autoalojadas con una sola precarga.
- **CLS:** ≤ 0,021 en todas las páginas.
- **Caché:** `vercel.json` ya declara un año inmutable para fuentes, imágenes, video y audio.
- **HLS:** no se justifica. No hay películas autoalojadas: todo el video es YouTube, y los `.mp4` propios son clips de `/estudio/`.

## B. Renderizado e indexación

### [B1] El cartel que tapaba el sitio — ✅
- **Evidencia:** `app/layout.tsx` tenía un `<noscript>` con un `div` `position: fixed; inset: 0; z-index: 99999` ("Este sitio requiere JavaScript…"). El contenido estaba en el HTML —todas las páginas se prerenderizan, cada una con su `<h1>`, sus textos y sus enlaces— pero ese cartel lo cubría entero. Es el texto que leyó la auditoría externa.
- **Solución aplicada:** se retira el cartel; el `<noscript>` solo saca la cortina y muestra lo que esperaba una animación.

### [B2] `/web/` vacía sin JavaScript — ✅
- **Evidencia:** `public/web/index.html` solo traía el `<h1>` de la tarjeta activa, el menú y un panel con "Serie: —, Año: —, Disciplina: —". Todo lo demás se armaba desde `public/cosmos/projects.js`. Sin JS: 7 palabras visibles y el preloader en 0% para siempre. Además el contador decía "01 / 08" con siete secciones.
- **Solución aplicada:** `scripts/build-cosmos-content.mjs` escribe en el HTML las siete secciones (título, texto, etiquetas y enlace) desde la misma fuente. Con JS es el equivalente en texto del lienzo; sin JS es la página, con estilos. El `<h1>` pasa a ser fijo ("Hivrido: inteligencia creativa") y el título del HUD deja de serlo. La cortina tiene ahora retiro automático por CSS.

### Verificado, sin hallazgo
- Las 42 rutas devuelven HTML con un único `<h1>`, texto y enlaces reales (rastreo sin JS de todas).
- Las fichas provisorias llevan `noindex` y no están en el sitemap.

## C. SEO técnico

### [C1] Barra final — ✅
- **Evidencia:** con `trailingSlash: true`, `NAV_ITEMS` de `Header.tsx` enlazaba `/artistas`, `/branding`, `/web`… El crawl encontró **8 destinos con 308 enlazados desde 20 páginas cada uno**. Las canónicas (`alternates.canonical: "/diseno-web"`) y los `og:url` tampoco llevaban barra.
- **Solución aplicada:** barra final en el menú, en las canónicas de 14 páginas y en los `og:url`.

### [C2] Datos estructurados — ✅
- **Evidencia:** solo la portada y las fichas emitían JSON-LD; servicios, equipo y Okupas, nada.
- **Solución aplicada** (`app/lib/schema.tsx`): `Organization` + `ProfessionalService` con sede en Buenos Aires; `Service` y `BreadcrumbList` en cada landing; `Person` en Equipo; en las fichas, `Movie`/`TVSeries` con `duration` ISO (solo si hay dato), `trailer` como `VideoObject` (solo si es tráiler embebible) y migas; `TVSeries` en Okupas. Sin puntajes: no hay votos reales.
- **Pendiente (P2):** `Person`/`MusicGroup` de artistas ya existía; no lo revisé a fondo.

### [C3] Redirecciones — ✅
17 variantes nuevas en `vercel.json` (con y sin barra): `/colmenas-agentes`, `/agentes`, `/agentes-ia`, `/colmena`, `/diseno`, `/disenoweb`, `/grow-digital`, `/artista`, `/ads`, `/castings`, `/peliculas`, `/series`, `/play/okupas`, `/home`, `/inicio`, `/productora`, `/contacto`.
Ojo: no tienen todavía su espejo como regla de proyecto en Vercel (ver CLAUDE.md, "un solo salto"): llegan en dos saltos cuando se piden sin barra.

### Sin revisar a fondo (P2)
- Imagen OG **propia por título** de PLAY: cada ficha usa su afiche 16:9 (1600×900 o 1280×720), no una pieza 1200×630. Funciona al compartir, pero no es la proporción que pide Facebook.
- `/origen/`, `/estudio/` y `/orbital/` están en el sitemap y nadie las enlaza.
- `lastModified: new Date()` en todo el sitemap: declara como modificadas hoy páginas que no cambiaron.
- La imagen OG por defecto (`hivrido-chrome.jpg`) tiene pirámides, ovnis y el ojo de Horus: imaginería que la marca ya no quiere. Ver PENDIENTES.

## D. Contenido y consistencia

### [D1] WhatsApp — ✅
- **Evidencia:** 25 enlaces repartidos entre `wa.me` y `api.whatsapp.com`; "Hola Hívrido!" idéntico en menú y pie de todas las páginas; tres grafías de la marca en los mensajes.
- **Solución aplicada:** `app/lib/contacto.ts` (número, mail, `whatsapp()`, `mail()`) y `WaGeneral` para los contactos que se repiten: el mensaje dice la sección y el lugar ("Les escribo desde Diseño web (el botón de WhatsApp)"). Los mails llevan asunto. El número y el mail no cambiaron.

### [D2] Códigos en Agentes IA — ✅
"AIAN" era el "AI" del centro pegado a "ANL". Las abreviaturas ANL/CTN/ADS/CRM/SEO/VNT se quitaron: cada nodo muestra su nombre ("Análisis", "Contenido", "Ventas"…), más grande y con contraste.

### [D3] Fichas sin datos — ☐ `TODO-CONTENIDO`
Detalle en PENDIENTES. No inventé nada.

### [D4] Testimonios — ☐ decisión
- **Evidencia:** el mismo trío está copiado en `WebDesign.tsx`, `colmena-agentes`, `branding`, `publicidad` y `equipo`. En el repo dicen lo mismo en los cinco: "M. Maioli / mympropiedades.com.ar", "S. Borrero / rappi.com.ar", "H. Winnik / flow.com.ar". "winnikflow.com.ar" es el nombre y el dominio leídos pegados (están en dos `<span>` sin separador); "Maiol/Maiolo" no existe en el código.
- **No los toqué:** no puedo verificar ni el apellido ni que Rappi y Flow sean clientes. Ver PENDIENTES.

### [D5] "Ver más →" — ☐ P2
En las filas de servicio (`WebDesign.tsx`, `Services.tsx`) el rótulo no es un enlace: toda la fila abre un modal con el detalle y el botón de presupuesto, así que sí lleva a contenido. Lo que confunde es que parece un link. Propuesta: "Ver detalle".
En `/web/`, `main.js` ya dice el destino real de cada tarjeta ("Ver el roster", "Ver el catálogo").

## E. UX y conversión — parcial

- **Botón flotante:** existe en todas las rutas con `ClientShell` y en `/web/`; no pisa el CTA del hero en móvil (lo verifica un test). **PLAY no tiene botón flotante**: en la portada y en las fichas el camino a WhatsApp es el pie, "Más → Contacto" o "Avisame". Es coherente con una plataforma de contenidos; queda como decisión (P2).
- **"Avisame":** cada tarjeta manda el título en el mensaje (test).
- **Casting:** valida, arma el WhatsApp con los datos y confirma (test).
- **No revisado:** el recorrido completo de los 5 segundos por página, objetivos táctiles menores a 44 px, desbordes horizontales y el modal de servicios en móvil.

## F. Accesibilidad — parcial

- **[F1] ✅** Los nodos de la colmena eran `<g onClick>` dentro de un `svg role="img"`, con `cursor: none`. Ahora son botones con foco, Enter/espacio y `aria-pressed`.
- **[F2] ✅** Textos de 7,5 px y `rgba(255,255,255,0.2–0.3)` en la colmena: subidos de tamaño y contraste.
- Lighthouse: 96–100 de partida; marcaba `color-contrast` y `label-content-name-mismatch` en portada, ficha y servicios.
- **Movimiento reducido:** el logo, Lenis, el cursor y toda la capa inmersiva lo respetan. No revisé una por una las marquesinas y el hero de PLAY (el CSS de PLAY ya trae su bloque `prefers-reduced-motion`).
- **No revisado:** barrido con axe-core por ruta, trampas de foco en los modales, `div role="button"` del menú, auto-avance del hero sin pausa (WCAG 2.2.2), subtítulos del reproductor.

## G. Seguridad

- **[G1] ✅** Producción solo enviaba `Strict-Transport-Security`. Se agregan `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, HSTS con `includeSubDomains` y una CSP mínima (`frame-ancestors`, `base-uri`, `object-src`).
- **[G2] ◐** Una CSP completa de scripts necesita nonces, y las páginas son estáticas: habría que permitir `'unsafe-inline'`, que le quita casi todo el valor. Queda como P2 con política propuesta en PENDIENTES.
- **Secretos:** `.env*` está ignorado, `.env.example` no trae valores, la `service_role` no tiene prefijo `NEXT_PUBLIC_`. No hice una búsqueda en el historial completo de git.
- **Consola:** sin errores propios en las 42 rutas. Un 404 de miniatura de YouTube en `/artistas/zurdosound/`.
- **No revisado:** `npm audit`, rate limiting y anti-spam de `/api/cesion`.

## H. Medición

- **Instalado:** solo Google Ads (`AW-18174991826`), en las rutas de Next. No hay GA4, GTM, Meta Pixel, Search Console ni Vercel Analytics.
- **[H1] ◐** Cada clic a WhatsApp, mail o Instagram emite ahora un evento con sección y lugar, además de la conversión de Ads de siempre. **`/web/` sigue sin etiqueta**: los clics desde la portada institucional no se miden. Sumarla es cargar un script de terceros donde hoy no hay ninguno: decisión tuya.
- **[H2] ☐** Plan de eventos y qué cuentas hacen falta, en PENDIENTES.
