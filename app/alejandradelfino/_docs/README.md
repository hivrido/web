# Sitio de Alejandra Delfino

Vista previa en `hivrido.com/alejandradelfino/`, con dominio futuro
`alejandradelfino.com.ar`. Es una **carta de presentación de una dirigente,
no una web de campaña**: ella todavía no lanzó candidatura.

## Mapa de la carpeta

```
_config/site.ts      LANZAMIENTO, SITE_INDEXABLE, BASE_PATH, DOMINIO, CONTACTO
_content/            fuente única de textos y datos
  sitio.json         meta, menú, hero, expediente, visión, formulario, pie
  perfil.json        quién es: bio y párrafos con fuente
  trayectoria.json   línea de tiempo con fuente
  gestion.json       obras que coordinó, con páginas del Documento de gestión
  propuestas.json    ejes, todos en borrador
  regiones.json      6 regiones (15 departamentos IGN) y su propuesta en borrador
  expediente.json    piezas del tablero e hilos
  imagenes.json      autor, licencia, lugar y año de cada imagen
  marca.json         logo y lema, bloqueados hasta el lanzamiento
  mapa.generado.json lo escribe _scripts/build-map.mjs (no editar)
_lib/contenido.ts    tipos y filtro de publicación
_components/         Header, Hero, Expediente, Secciones, FormContacto…
_scripts/            build-map.mjs (mapa del IGN), contraste.mjs (informe WCAG)
_docs/               esta guía, fuentes.md, contraste.md, formulario.md
_archivo/            material retirado (formulario Sumate, textos viejos); no se compila
```

## Reglas del contenido

- **Sin fuente no se publica.** Toda cifra, fecha, cargo u obra lleva `fuente`.
- **`pendiente: true` y `estado: "borrador"`** no se renderizan en producción.
  En desarrollo (`npm run dev`) se ven con un sello PENDIENTE o BORRADOR, y el
  tooltip del sello dice qué falta.
- **Fotos:** solo con licencia o permiso registrado en `imagenes.json`. Sin eso,
  en producción va un paisaje ilustrado en el color de la región.
- **Identidad:** el logo AD, el corazón verde y "Los sueños se cumplen" solo
  aparecen con `LANZAMIENTO = true`.
- **Lenguaje:** nada de "Sumate", "Votame", "Fiscalizar" ni llamados al voto.
- Sin botón de donaciones. Sin datos personales (DNI, teléfono, domicilio,
  familia, religión).

## Mudanza a alejandradelfino.com.ar

1. En `_config/site.ts`, `BASE_PATH` pasa a `""`. Todas las rutas a archivos
   (`ruta()`), el canónico, el ícono y el fondo de tulipanes cuelgan de ahí.
2. La carpeta se mueve a la raíz de `app/` del proyecto nuevo, y los archivos
   de `public/alejandradelfino/` a `public/`.
3. `SITE_INDEXABLE=true` en las variables de entorno cuando deje de ser vista
   previa.

## Pendientes para completar con Alejandra

### Datos (no se publican hasta resolverlos)
- [ ] **Años de trayectoria:** ¿"más de 25 años"? El Documento de gestión dice "más de tres décadas".
- [ ] **¿Frente o Federación** de Organizaciones Peronistas? El documento dice "Frente". Con eso se publica también el hito 2010.
- [ ] **Casa del Chubut:** años de inicio y de renuncia.
- [ ] **Precandidatura 2023:** fuente externa (nota de prensa o presentación electoral).
- [ ] **Número de decreto** de la designación como subsecretaria (2018).
- [ ] **Año de las recorridas** de Cholila y El Maitén: ¿2018 o 2019?
- [ ] **Abogacía:** confirmar si sigue en curso.
- [ ] **Patrimonio y cooperativas:** decidir si se publica (hoy en borrador).

### Propuestas (todas en borrador)
- [ ] Aprobación escrita de los 4 ejes: Energía, Producción en origen, Reglas claras, Chubut del futuro.
- [ ] Aprobación de las 6 propuestas por región. La del Sur todavía no tiene texto.

### Fotos
- [ ] Foto oficial de ella para "Quién es" y la ficha Nº 001. Hoy hay un monograma.
- [ ] Fotos propias o con permiso para las 10 polaroids del expediente (ver `imagenes.json`).

### Formulario
- [ ] Responsable de la base de datos y revisión legal del texto (ver `formulario.md`).
- [ ] Endpoint para recibir las consultas.

### Marca
- [ ] Valores oficiales de la paleta. El brief nombra los tokens sin traer los colores (ver `contraste.md`).
- [ ] Al lanzar: `LANZAMIENTO = true`. Revisar `opengraph-image.tsx`, que hoy se genera sin logo.
