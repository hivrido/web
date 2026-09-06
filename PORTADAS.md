# Portadas pendientes — Hivrido PLAY

Qué imágenes faltan subir, con las medidas exactas que espera cada componente.
Mientras no estén, la tarjeta se pinta con el degradado de la casa: se ve
terminada, no rota, pero no comunica el título.

Cada ficha nueva está marcada con `isPlaceholder: true` en
[app/lib/catalog.ts](app/lib/catalog.ts). Al cargar los datos reales, sacá ese
flag y completá `synopsis`, `year`, `genre` y —si hay— `rating`.

---

## Cómo se conectan

1. Subí el archivo a `public/images/series/` o `public/images/peliculas/`,
   según corresponda.
2. En `app/lib/catalog.ts`, agregá `poster: "/images/<carpeta>/<archivo>"` a la
   ficha correspondiente.

No hace falta tocar nada más: la tarjeta cambia sola.

---

## 1 · Portadas de tarjeta

**Las dos filas usan el mismo formato: apaisado 16:9.** La tarjeta es
`.mp-card.wide` —320 px en escritorio, 220 px en teléfono, con
`aspect-ratio: 16/9`—, así que al doble de densidad de pantalla pide
**640 × 360 px** en todos los casos.

### Series

| Título | Archivo sugerido | Estado |
|---|---|---|
| El Docke | — | **ya está** (`/images/series/eldocke.jpg`) |
| Session One | `session-one.jpg` | falta |
| El Monarco | `el-monarco.jpg` | falta |
| Insomnio | `insomnio.jpg` | falta |
| Haters | `haters.jpg` | falta |
| Hackers | `hackers.jpg` | falta |
| Alma | `alma.jpg` | falta |
| Okupas | — | **ya está** (`/images/okupas/okupas-home.webp`) |

### Películas

Mismo formato que las series: **640 × 360 px**, apaisado. No son afiches
verticales.

| Título | Archivo sugerido | Estado |
|---|---|---|
| Chamamé | `chamame.jpg` | falta |
| El Cambio | `el-cambio.jpg` | falta |
| Atómico 82 | `atomico-82.jpg` | falta |

---

## 2 · Fondos del slider de portada

Solo si querés sumar un título nuevo al carrusel principal. Hoy lo ocupan El
Docke, Chamamé y Session One, que ya tienen fondo generado.

- **Formato:** JPG apaisado, 16:9, **lado largo mínimo 1600 px**.
- **Encuadre:** el texto se apoya sobre el tercio izquierdo y hay un degradado
  oscuro encima. Dejá esa zona sin nada importante.
- **Dónde:** el original va a `public/pdf/imagenespdf/…` (o donde viva el
  material) y se declara en `scripts/build-hero-images.mjs`. El script genera
  la variante liviana en `public/images/hero/`. **No subas el original a
  `/images/hero/` a mano**: esa carpeta la escribe el build.

Después, en `catalog.ts`, la ficha lleva:

```ts
hero: { image: "/images/hero/<archivo>.jpg", color: "#RRGGBB" },
```

El `color` es el punto de acento del género, arriba del título.

---

## 3 · Datos que también faltan

Además de las imágenes, estas fichas están con texto provisorio:

- **El Monarco, Insomnio, Haters, Hackers, Alma** — sinopsis, año real, género
  y cantidad de temporadas.
- **El Cambio** — todo: no existía en el sitio, se creó de cero. Falta también
  la duración.
- **Atómico 82** — sinopsis, año real, duración.

Ninguna de las fichas nuevas tiene puntaje cargado, a propósito: un número
inventado en un catálogo es peor que un campo vacío. La tarjeta simplemente no
muestra la estrella hasta que haya uno real.
