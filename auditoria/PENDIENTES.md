# Pendientes — lo que queda en tus manos

## 1. `TODO-CONTENIDO` (datos que solo vos tenés)

Fuente: `app/lib/catalog.ts`. No se inventó ningún dato: donde falta, la ficha muestra menos.

| Título | Falta |
|---|---|
| Érase una vez en Virreyes | año |
| 3 A.M. | año, duración |
| Esnob | año, sinopsis de trama (hoy va la bajada del afiche) |
| El rectángulo de Ángeles | año |
| Matanza (Hungry 2) | año, sinopsis de trama |
| Mia | año, sinopsis de trama |
| El armario de Dani | año, duración, sinopsis de trama |
| Cuchillo Paz | tráiler (cuando exista) |
| El Monarco | sinopsis, datos de producción (hoy "Sinopsis provisoria") |
| Insomnio · Haters · Hackers · Alma | sinopsis, afiche, datos (provisorias) |
| El Cambio · Atómico 82 | sinopsis, afiche, duración (provisorias) |

Las seis provisorias sin afiche están enlazadas desde "Próximamente" y llevan `noindex`. El año, cuando lo cargues, entra solo al schema.org de la ficha.

Otros:
- **Imagen para compartir de la productora.** `public/images/bg/hivrido-chrome.jpg` es la imagen que aparece al compartir `/web/` y cualquier página sin imagen propia. Tiene pirámides, ovnis y el ojo de Horus. Si la marca ya no usa esa imaginería, hace falta una pieza nueva de 1200×630 (puedo generarla a partir del logo 3D si me lo pedís).
- **Imagen 1200×630 por título de PLAY.** Hoy cada ficha comparte su afiche 16:9. Para la proporción exacta que piden Facebook e Instagram habría que producir una pieza por título.

## 2. Decisiones que necesito de vos

1. **Paleta de marca.** El encargo fija como identidad `#0D0717`, `#3C1053`, `#5F259F`, `#8246AF`, `#AC4FC6` y cromo. El sitio publicado no usa ninguno de esos valores: usa violeta `#7C3AED`, magenta `#FF1B8D`/`#FF0A82`, dorado `#C9A84C` y, en PLAY, violeta + ámbar. **No repinté nada**: sería un cambio visual de todo el sitio. Lo nuevo (logo 3D y colmena) sí está hecho con la paleta del encargo. Decime si querés migrar el sitio entero o dejar las dos convivir.
2. **La cortina "Is the Future / 0%".** Tapa 1,8 s las landings de servicio, que son las que reciben pauta. Opciones: (a) dejarla, (b) sacarla solo de las landings con anuncios, (c) convertirla en una entrada que no tape el contenido. Recomiendo (b): `/artistas/` ya funciona así.
3. **Testimonios.** Confirmame el apellido correcto ("M. Maioli" figura en el código) y si **Rappi** y **Flow** son clientes que se pueden nombrar. Si no lo son, hay que retirarlos: nombrar marcas grandes sin respaldo es un riesgo legal. Con tu respuesta además los unifico en un solo archivo (hoy están copiados en cinco).
4. **Cifras de la colmena y de los servicios.** "Eficiencia 96%", "×3 conversión de leads", "x10 piezas por semana", "100% de las consultas": ¿son datos medidos? Si son ilustrativos conviene decirlo o cambiarlos por algo comprobable. No los toqué.
5. **Derechos de *Okupas*.** Es una obra de Bruno Stagnaro para Canal 7 y los episodios se reproducen desde videos de YouTube. Confirmá que hay autorización para presentarla dentro de PLAY, y si el "9.2" (nota de la casa) puede prestarse a confusión con un puntaje público. *Mia* se presenta como homenaje a *Pulp Fiction*: mismo cuidado con el uso del personaje. No quité nada.
6. **Medir `/web/`.** La portada institucional no carga la etiqueta de Google: los clics a WhatsApp desde ahí no se cuentan. Sumarla es poner un script de terceros en la única página que hoy no tiene ninguno.
7. **Privacidad.** El sitio carga una etiqueta publicitaria con cookies de terceros en todas las rutas y no tiene aviso ni política de privacidad. Es lo que baja Best Practices a 79. Decidí si querés aviso de cookies / consentimiento.
8. **Botón de WhatsApp en PLAY.** La portada y las fichas no tienen botón flotante. ¿Querés uno, o PLAY se queda como plataforma de contenido?
9. **Vercel sin GitHub.** El proyecto sigue sin conectarse al repo: cada publicación es manual. Conectarlo (`vercel git connect`) te daría además una URL de vista previa por rama, que es el staging que hoy no existe.
10. **Reglas de proyecto para las redirecciones nuevas.** Las 17 variantes nuevas viven en `vercel.json`; sin su espejo como regla de proyecto, la versión sin barra llega en dos saltos. Se cargan con `vercel routes` (desde PowerShell).

## 3. Medición: qué quedó listo y qué falta

Ya emite, sin cuentas nuevas (los recibe la etiqueta de Ads y quedan en `dataLayer`):

| Evento | Cuándo | Parámetros |
|---|---|---|
| `conversion` (Ads) | clic a WhatsApp | sin cambios |
| `whatsapp_click` | clic a WhatsApp | `seccion`, `lugar`, `page_path` |
| `mail_click` | clic a un `mailto:` | `seccion`, `lugar`, `page_path` |
| `instagram_click` | clic a Instagram | `seccion`, `page_path` |

Para verlos en Analytics: crear una propiedad GA4 y cargar `NEXT_PUBLIC_GA4_ID=G-XXXX` en Vercel y en `.env.local`. No hay que tocar código.

Propuesto y **no implementado**:

| Evento | Dónde se engancha |
|---|---|
| `trailer_play` (+ 25/50/75/100 %) | `CinePlayer.tsx`, que ya consulta el tiempo cada 250 ms |
| `avisame_click` con el título | el enlace de "Próximamente" en `PlayHome.tsx` |
| `casting_submit` | `onSubmit` de `CastingCall.tsx` |
| `scroll_depth` 50/90 % en servicios | un `IntersectionObserver` en `WebDesign.tsx` |
| `search` en PLAY | `SearchOverlay.tsx` |
| `cesion_firmada` | respuesta OK de `/api/cesion` |

Cuentas que harían falta: GA4, Google Search Console (verificar el dominio y enviar el sitemap) y, si hay pauta en Meta, Pixel + Conversions API.

## 4. Lo que el encargo pedía y no se hizo

Para que no haya sorpresas. Todo esto queda fuera de la rama:

- **Fase 3 parcial.** Se construyeron el logo H▷ 3D y el fondo de colmena. **No** se hicieron: la vista previa del tráiler al pasar el cursor, las View Transitions del afiche a la ficha, la inercia al arrastrar los carruseles, el storytelling por scroll de `/web/`, la colmena de agentes rediseñada como panal con flujo de datos (se la hizo accesible y legible, no se la rediseñó), las microinteracciones por oficio en Artistas, la estela del cursor y los botones magnéticos en los CTA de WhatsApp.
- **Auditoría parcial** en UX móvil y accesibilidad (ver AUDITORIA, secciones E y F).
- **Videos de verificación** del hero, el catálogo y la colmena: no se grabaron.
- **Objetivos de Lighthouse:** ver RESULTADOS para lo que se alcanzó y lo que no.

## 5. Propuestas P3

| Idea | Impacto | Esfuerzo |
|---|---|---|
| Storytelling por scroll en `/web/`: cada sección como capítulo real y el anillo girando con el scroll | alto (SEO + experiencia) | alto |
| Vista previa muda del tráiler al pasar el cursor por un afiche | medio | medio |
| View Transitions del afiche a la ficha | medio | medio |
| Clips propios de 5–8 s por título para el hero y las vistas previas (hoy todo es YouTube, ~2,6 MB en escritorio) | alto en peso | medio, requiere material |
| CSP completa con nonces (obliga a que las páginas dejen de ser estáticas) o con hashes | medio | alto |
| Tests en CI con `@playwright/test` al conectar el repo a Vercel | medio | bajo |
| Partir `globals.css` (3,9 mil líneas, se incrusta en todas las rutas, PLAY incluida) | medio | medio |
