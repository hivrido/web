# Contraste (WCAG 2.1 AA)

Generado por `_scripts/contraste.mjs`. Umbrales: 4.5:1 para texto normal y
3:1 para texto grande (≥ 24px, o ≥ 18.66px en negrita) y para elementos
gráficos (subrayados, bordes de botones, anillos de foco).

**Resultado: 26 de 26 pares pasan AA.**

| Dónde | Frente | Fondo | Tipo | Contraste | AA |
|---|---|---|---|---|---|
| Texto de párrafos, bajadas y ayudas | `#24163f` | `#fff7ec` | texto | 15.67:1 | ✓ |
| Ayuda de teclado del expediente | `#24163f` | `#f4ecdf` | texto | 14.20:1 | ✓ |
| Kicker de sección | `#24163f` | `#fff7ec` | texto | 15.67:1 | ✓ |
| Títulos de sección (violeta) | `#6a2ac0` | `#fff7ec` | texto grande | 7.31:1 | ✓ |
| Hero: titular y bajada | `#ffffff` | `#2a1159` | texto | 15.87:1 | ✓ |
| Hero: "con qué" (dorado) | `#e6a92b` | `#2a1159` | texto grande | 7.62:1 | ✓ |
| Hero: subrayado (verde) | `#3e8e2f` | `#2a1159` | gráfico | 3.87:1 | ✓ |
| Botón primario: texto (violeta profundo sobre dorado) | `#2a1159` | `#e6a92b` | texto | 7.62:1 | ✓ |
| Botón primario: texto sobre el tono claro del degradé | `#2a1159` | `#efbb4a` | texto | 8.98:1 | ✓ |
| Botón secundario: texto crema sobre violeta profundo | `#fff7ec` | `#2a1159` | texto | 14.94:1 | ✓ |
| Botón secundario: borde crema sobre violeta profundo | `#fff7ec` | `#2a1159` | gráfico | 14.94:1 | ✓ |
| Header sólido: nombre y menú | `#24163f` | `#fff7ec` | texto | 15.67:1 | ✓ |
| Nombre registral (verde, manuscrita 25.6px) | `#3e8e2f` | `#fff7ec` | texto grande | 3.86:1 | ✓ |
| Línea de tiempo: año (naranja texto, 18.4px) | `#b4530a` | `#ffffff` | texto | 5.02:1 | ✓ |
| Gestión Cholila: cifra (naranja texto, 80px) | `#b4530a` | `#d5efed` | texto grande | 4.16:1 | ✓ |
| Gestión El Maitén: cifra (naranja texto, 80px) | `#b4530a` | `#e9e0f7` | texto grande | 3.94:1 | ✓ |
| Gestión Cholila: leyenda de la cifra (17.6px) | `#0f6d71` | `#d5efed` | texto | 5.05:1 | ✓ |
| Gestión El Maitén: leyenda de la cifra (17.6px) | `#5b2a9e` | `#e9e0f7` | texto | 7.26:1 | ✓ |
| Gestión: lista de obras | `#24163f` | `#d5efed` | texto | 13.79:1 | ✓ |
| Contacto: texto blanco sobre violeta | `#ffffff` | `#6a2ac0` | texto | 7.76:1 | ✓ |
| Contacto: texto blanco sobre el violeta claro del degradé | `#ffffff` | `#8e44c9` | texto | 5.50:1 | ✓ |
| Pie: aviso (blanco al 80%) | `#ffffff al 80% (#d1cfd6)` | `#1b0f33` | texto | 11.70:1 | ✓ |
| Pie: fuente del mapa (blanco al 48%, 12.5px) | `#ffffff al 48% (#888295)` | `#1b0f33` | texto | 4.88:1 | ✓ |
| Pie: enlace a Instagram (dorado) | `#e6a92b` | `#1b0f33` | texto | 8.66:1 | ✓ |
| Foco sobre fondos claros (violeta) | `#6a2ac0` | `#fff7ec` | gráfico | 7.31:1 | ✓ |
| Foco sobre fondos oscuros (dorado) | `#e6a92b` | `#2a1159` | gráfico | 7.62:1 | ✓ |

## Paleta oficial → tokens de `delfino.css`

| Oficial | Token | Valor |
|---|---|---|
| --violeta | `--ad-violeta` | `#6a2ac0` |
| --violeta-profundo | `--ad-violeta-hondo` | `#2a1159` |
| --dorado | `--ad-dorado` | `#e6a92b` |
| --crema | `--ad-crema` | `#fff7ec` |
| --verde | `--ad-verde` | `#3e8e2f` |

El brief de la revisión nombra estos tokens pero no trae sus valores: se
tomaron los del sitio, y el dorado se definió nuevo (más profundo que el
amarillo anterior, `#ffc94a`). **Confirmar los valores con la guía de marca**
y, antes de imprimir, las equivalencias Pantone con la guía física.
