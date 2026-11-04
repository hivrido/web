# Fuentes del sitio

Regla: toda cifra, fecha, cargo u obra lleva un campo `fuente` en `_content/`.
Sin fuente, o con `pendiente: true`, el dato no se publica en producción.

**DOC** = *Documento de gestión (Ruth Alejandra Delfino)*, PDF de 26 páginas,
guardado en el material crudo (`public/aledelfino/ale/`, ignorado por git).

## Trayectoria (`perfil.json`, `trayectoria.json`)

| Dato | Fuente | Estado |
|---|---|---|
| Primeros cargos en Merlo, Morón y Gral. San Martín (desde 1990) | DOC p. 4 | publicado |
| Administración Pública Nacional desde 2003 (Presidencia, Jefatura de Gabinete) | DOC p. 6 | publicado |
| Presidenta nacional del Frente de Organizaciones Peronistas (2010) | DOC p. 7 | **pendiente**: ¿Frente o Federación? |
| Subsecretaria de Coordinación y Relaciones Institucionales: juró el 12/11/2018 | DOC p. 9 y 13–14 (nota de El Diario) | publicado; **falta el número de decreto** |
| Autoridad de la Casa del Chubut en Buenos Aires | DOC p. 24 | **pendiente**: faltan los años |
| Precandidata a gobernadora (2023) | DOC p. 25 | **pendiente**: falta fuente externa |
| "Más de 25 años de trayectoria en gestión pública" | DOC p. 3 y 26 | **pendiente**: confirmar con ella |
| Abogacía en curso; Psicología Social; Mediación Comunitaria | CV; DOC p. 5 | publicado |

### Lo que el documento dice distinto de la revisión

- **Años de trayectoria.** El DOC dice "más de tres décadas" (p. 3 y p. 26), y
  sus fechas arrancan en 1990. La revisión pide "más de 25 años" hasta que
  ella confirme: el dato quedó pendiente con esa redacción.
- **Frente / Federación.** El DOC dice siempre **Frente** de Organizaciones
  Peronistas (FOP), en las p. 2, 3, 7, 8, 24 y 26.
- **Año de las recorridas.** El sitio decía "2018" para Cholila y El Maitén.
  Ella juró el 12/11/2018, y la nota de El Maitén habla de inaugurar el
  gimnasio "en octubre". Las dos recorridas serían, entonces, de 2019. El año
  no se publica hasta confirmarlo.

## Gestión (`gestion.json`, `expediente.json`)

| Caso | Fuente | Estado |
|---|---|---|
| Cholila: obras y "+80% de avance en la mayoría" | DOC p. 18–20 (Noticias del Corredor) | publicado, sin año |
| El Maitén: 15 obras en ejecución | DOC p. 21–23 (El Chubut) | publicado, sin año |
| Patrimonio: 7 cooperativas, 4 edificios | DOC p. 15–17 (El Diario) | **borrador** (tema sensible) |

El instrumento de financiamiento de esas obras no se nombra en ningún texto.

## Datos de contexto (regiones y fotos del expediente)

| Dato | Fuente |
|---|---|
| Los Alerces, Patrimonio de la Humanidad | Lista del Patrimonio Mundial de la UNESCO (2017) |
| Península Valdés, Patrimonio Natural de la Humanidad | Lista del Patrimonio Mundial de la UNESCO (1999) |
| Colonos galeses, 1865 | Llegada del velero Mimosa, 28/07/1865 |
| Petróleo en Comodoro Rivadavia, 1907 | Descubrimiento del 13/12/1907 |
| El Hoyo, sede de la Fiesta Nacional de la Fruta Fina | Municipalidad de El Hoyo |

## Mapa

Los 15 departamentos salen de la capa `departamento` del **Instituto
Geográfico Nacional (IGN)**, servicio WFS público, filtrada por la provincia
(código INDEC 26). La licencia es de datos abiertos con cita de la fuente, que
figura en el pie del sitio. Ver `_scripts/build-map.mjs`.
