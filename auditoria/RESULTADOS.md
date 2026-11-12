# Resultados — antes y después

Mismas condiciones que la [línea de base](linea-de-base.md): Lighthouse 12.8.2, `next start` local, 3 pasadas, mediana por Performance. Móvil = 4G lento simulado + CPU ×4.
JSON completos en `auditoria/evidencia/lighthouse/` (`antes/` y `despues/`).

## Lo que no se alcanzó

Antes que lo logrado, lo que falta: **ninguna página llega al objetivo de Performance ≥ 90 en móvil**, y solo Artistas queda al borde del LCP < 2,5 s. Best Practices sigue en 79 en las rutas de Next. Las causas y qué haría falta están al final.

## Lighthouse móvil

| Página | Performance | LCP | TBT | CLS | A11y | BP | SEO |
|---|---|---|---|---|---|---|---|
| Home PLAY | **65 → 81** | 5,2 → 3,8 s | 607 → 301 ms | 0,016 | 96 | 79 | 100 |
| Ficha de título | **77 → 82** | 4,2 → 3,7 s | 348 → 308 ms | 0,011 | 96 | 79 | 100 |
| `/web/` | 78 → 74 ¹ | 3,5 → 3,5 s | 405 → 536 ms | 0 | 100 | 96 → 100 | 100 |
| Servicio `/diseno-web/` | **72 → 82** | 2,8 → 3,0 s | 846 → 480 ms | 0 | 96 | 79 | 100 |
| Agentes IA | **87 → 83** ² | 2,6 → 2,9 s | 384 → 491 ms | 0,018 | 96 | 79 | 100 |
| Artistas | 85 → 86 | 2,6 → 2,5 s | 463 → 453 ms | 0 | 100 | 79 | 100 |
| Casting | 82 → 85 | 3,3 → 2,8 s | 408 → 436 ms | 0 | 100 | 79 | 100 |

¹ `/web/` no cambió en nada que afecte la carga (su motor 3D es el mismo); sus tres pasadas dieron 63/80/74 y en la base 62/78/80. Es ruido de medición, no una regresión.
² **Esta sí es una baja real y es de la capa inmersiva.** Ver "La decisión que te queda".

## Lighthouse escritorio

| Página | Performance | LCP | TBT |
|---|---|---|---|
| Home PLAY | 97 → 99 | 0,9 → 0,9 s | 16 → 3 ms |
| Ficha de título | **63 → 100** | 1,2 → 0,8 s | **1081 → 9 ms** |
| `/web/` | 95 → 95 | 1,1 s | 133 → 138 ms |
| Servicio | 100 → 100 | 0,5 → 0,6 s | 12 → 13 ms |
| Agentes IA | 100 → 100 | 0,6 s | 0 → 19 ms |
| Artistas | 100 → 100 | 0,6 s | 14 → 13 ms |
| Casting | 100 → 100 | 0,6 → 0,7 s | 0 → 4 ms |

## Peso (móvil, transferido)

| Página | Total | Imágenes | JS | Requests |
|---|---|---|---|---|
| Home PLAY | 1459 → **1132 KB** | 847 → 552 KB | 358 → 325 KB | 49 → 48 |
| Ficha | 847 → **630 KB** | 292 → 106 KB | 358 → 325 KB | 32 → 30 |
| Servicio | 519 → 512 KB | — | 418 → 407 KB | 26 → 25 |
| Artistas | 471 → 421 KB | — | 361 → 311 KB | 23 → 19 |
| Casting | 630 → 580 KB | 163 KB | 360 → 310 KB | 23 → 20 |

En escritorio la portada baja de 4,6 a 3,7 MB (imágenes 1598 → 763 KB); el resto es el tráiler de YouTube del hero, que no se tocó.

## Qué cambio logró cada mejora

| Mejora | Cambio |
|---|---|
| Home PLAY móvil 65 → 81, LCP −1,4 s | Hero como `<img>` con `srcset` y prioridad; afiches en 640/960 px; GSAP fuera del arranque |
| Ficha escritorio 63 → 100 | El logo ya no carga GSAP, y el fondo desenfocado usa la variante de 640 px |
| TBT de las landings 846 → 480 ms | Etiqueta de Google diferida; cursor sin `MutationObserver`; Lenis solo con mouse; entradas en CSS |
| JS −50 KB en Artistas y Casting | GSAP y Lenis dejan de bajarse donde no se usan |
| Imágenes −295 KB en la portada, −186 KB en la ficha | Variantes de afiche |

## Verificaciones

| Chequeo | Resultado |
|---|---|
| Tests end-to-end (`tests/e2e/flujos.py`) | **17 de 17 pasan**: catálogo, buscador, hero, tráiler sin YouTube hasta el clic, "Avisame", casting, formato de todos los WhatsApp, botón flotante, menú móvil, colmena por teclado, sin JS, `/web/` en HTML, cabeceras SEO, JSON-LD, enlaces |
| Enlaces internos | 38 páginas rastreadas desde `/` y `/web/`: 0 rotas, 0 con redirección |
| Sin JavaScript | `<h1>` único y texto visible en portada, `/web/`, servicio, artistas, ficha y casting; el cartel que tapaba todo ya no existe |
| JSON-LD | Se parsea en todas; `Service`, `Person`, `Movie` (con `duration` y `trailer`), `TVSeries`, `Organization` presentes. **No lo pasé por el validador de Google** (Rich Results Test): es una herramienta externa |
| Consola | Sin errores de JavaScript en las 42 rutas. Sigue el 404 de una miniatura de YouTube en `/artistas/zurdosound/`, que ya estaba |
| Capturas | `auditoria/evidencia/capturas/antes/` y `despues/`, mismas rutas y anchos. Las revisé a ojo en portada, ficha, servicio y `/web/`; **no hice una comparación automática píxel a píxel** de las 164 |

Cabeceras de seguridad, caché y redirecciones viven en `vercel.json`: **no se pueden verificar en local**, recién al publicar.

## Por qué no se llega a 90 en móvil

1. **React + Next pesan ~325 KB de JS por ruta** y casi todo el contenido de PLAY y de las landings es componente cliente. Con CPU ×4 eso son 300–500 ms de bloqueo que no se van sin pasar secciones enteras a componentes de servidor. Es el trabajo de fondo que queda (P1, esfuerzo alto).
2. **La cortina de carga** de las landings (1,8 s). Decisión tuya: PENDIENTES, punto 2.
3. **La etiqueta de Google**: aun diferida, sus 165 KB y ~300 ms caen dentro de la ventana que mide Lighthouse, y sus cookies de terceros son lo que deja Best Practices en 79. Solo sube con consentimiento previo o cargándola tras el primer gesto.
4. **El CSS incrustado**: `globals.css` entero (3,9 mil líneas) va dentro del HTML de cada ruta.

## La decisión que te queda (más efecto o más velocidad)

En las cinco landings de servicio, el logo 3D y la colmena suman trabajo aun optimizados (compilación en paralelo, en táctiles recién tras el primer gesto, respaldo sin desenfoque en móvil):

| Agentes IA móvil | Performance | LCP | TBT |
|---|---|---|---|
| Sin capa inmersiva (base) | 87 | 2,6 s | 384 ms |
| Con capa inmersiva | 83 | 2,9 s | 491 ms |

En `/diseno-web/` el saldo neto es positivo (72 → 82) porque las otras mejoras pesan más, pero la capa cuesta lo mismo ahí. Opciones: **(a)** dejarla como está; **(b)** mostrar en móvil solo el símbolo estático, sin colmena ni 3D, y dejar el efecto completo para escritorio, donde no cuesta nada (100/100). Recomiendo **(b)** si la pauta entra por teléfono.
