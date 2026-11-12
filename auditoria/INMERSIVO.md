# Capa inmersiva

Código en `app/components/immersive/`. Hoy está montada en el hero de las cinco landings de servicio (`/diseno-web/`, `/branding/`, `/equipo/`, `/publicidad/`, `/colmena-agentes/`).

## Qué se construyó

### 1. Símbolo H▷ en 3D
- **Geometría vectorial** (`hmark-shape.ts`). El símbolo solo existía pintado dentro de dos imágenes; lo medí sobre ese arte y lo regularicé: barra y travesaño del mismo grosor, triángulo simétrico, hueco a grosor constante. Es la fuente única del SVG y de la malla.
- **Malla extruida con bisel** (`hmark-gl.ts`): cara, chaflán y canto, triangulada en el momento.
- **Cromo**: refleja un estudio descrito por una función, con la paleta del encargo (`#0D0717`, `#3C1053`, `#5F259F`, `#8246AF`, `#AC4FC6`). No baja ninguna textura. Un relieve mínimo en la cara le da aspecto de cromo líquido.
- **Neón lila** en los dos contornos, que **se enciende de abajo hacia arriba** con titileo, como un cartel.
- **Posproceso**: suavizado MSAA, resplandor en dos niveles y aberración cromática mínima (solo en equipos de gama alta).
- **Interacción**: sigue al cursor con un resorte amortiguado; en móvil, al giroscopio donde el sistema lo entrega sin pedir permiso (Android); si no hay ninguno, un vaivén lento.
- **Respaldo**: un SVG con degradado cromado y tubos que se encienden con CSS puro. Es lo que se ve al instante, mismo encuadre que el 3D, así que el lienzo funde encima sin salto.

### 2. Fondo de colmena
- Grilla de hexágonos por shader (`hive-gl.ts`): pulsos de luz violeta que la cruzan, celdas que se prenden, y una zona que se enciende bajo el cursor; se desplaza con el scroll.
- Respaldo: la misma grilla, quieta, como patrón CSS.

## Tecnología: qué elegí y por qué me aparté del encargo

El encargo proponía Three.js, WebGPU con respaldo a WebGL2, GSAP/SplitText y View Transitions. Para estas dos piezas usé **WebGL2 directo, sin motor**:

| | Three.js (como el anillo de `/web/`) | Lo construido |
|---|---|---|
| JS comprimido | ~130 KB | **9,1 KB** (logo 6,3 + colmena 2,9) |
| Presupuesto del encargo | 250 KB | 4 % usado |

Son dos escenas de un puñado de draw calls; traer un motor para eso era pagar 14 veces más por el mismo resultado, con la regla "la velocidad no se negocia" de por medio. Three sigue en el anillo de `/web/`, donde sí se justifica.
**WebGPU: no se usó.** Habría que escribir cada shader dos veces (WGSL y GLSL) sin ninguna diferencia visible en escenas de este tamaño.

## Rendimiento medido

| Pieza | Escritorio | Móvil emulado, CPU ×4 |
|---|---|---|
| Logo H▷ | 60 fps | 60 fps |
| Colmena | 30 fps | 30 fps |

Medido en esta máquina (gráfica integrada Intel UHD) con Chromium y aceleración real. **No lo probé en un teléfono físico.**
La colmena va a 30 fps **a propósito**: es atmósfera lenta y a 60 se vería igual gastando el doble. Eso queda por debajo de los 60/50 fps que pedía el encargo para esa pieza; si la querés a 60 es cambiar una constante.

## Cómo se carga

- Nunca en el camino del primer pintado: cada motor es un `import()` que se pide con la página ya cargada, el navegador libre y **solo si la pieza está en pantalla**.
- Los shaders se compilan sin frenar la página (`KHR_parallel_shader_compile`).
- En táctiles y equipos medios, además, espera al **primer gesto** (tocar o scrollear).
- Se detiene fuera de pantalla y con la pestaña en segundo plano.

## Cómo se degrada

| Situación | Qué pasa |
|---|---|
| Ahorro de datos, 2G, ≤ 2 GB de RAM o ≤ 2 núcleos | No se monta WebGL: quedan el SVG y el patrón CSS |
| Batería ≤ 20 % sin cargar (donde el navegador lo informa) | Ídem |
| Sin WebGL2 o con render por software | Ídem |
| Táctil, o ≤ 4 GB / 4 núcleos, o 3G | Versión liviana: menos resolución, sin aberración, arranca tras el primer gesto |
| Cuadros por debajo de ~45 fps medidos | Baja la resolución; si sigue, apaga el resplandor; si no alcanza, congela el último cuadro |
| `prefers-reduced-motion` | Un solo cuadro del logo, encendido y de frente; colmena quieta; sin animación de encendido |
| Sin JavaScript | SVG y patrón CSS, completos |

Las dos piezas llevan `aria-hidden` y no reciben clics: nada importante vive dentro del lienzo, y no tapan ningún CTA (lo verifica un test).

## Costo real en Lighthouse

No es gratis: ver la tabla "La decisión que te queda" en [RESULTADOS.md](RESULTADOS.md). En escritorio no cuesta nada (100/100); en móvil, Agentes IA quedó en 83 contra 87 de base.

## Lo que no se construyó

De la lista de la Fase 3 quedaron afuera: vista previa del tráiler al pasar el cursor, View Transitions del afiche a la ficha, carruseles con inercia, storytelling por scroll en `/web/`, la colmena de agentes como panal con flujo de datos (se la hizo accesible y legible, no se rediseñó), microinteracciones por oficio en Artistas, estela del cursor y botones magnéticos en los CTA. Tampoco se grabaron los videos de verificación. El logo todavía no está en PLAY ni en `/web/`.
