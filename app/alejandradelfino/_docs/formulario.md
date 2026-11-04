# Formulario de contacto

## Estado al 04/11/2026

- **El formulario "Sumate" está desactivado.** Pedía la localidad, el WhatsApp
  y casillas como "Fiscalizar" o "Recorrer mi barrio". Anotarse en un espacio
  político revela una opinión política, que es un **dato sensible** según la
  Ley 25.326 (arts. 2 y 7). Su componente, su API, la validación y el SQL de la
  tabla están en `_archivo/sumate/`. No se compila ni se sirve. **No
  reactivarlo sin la revisión de un abogado.**
- **El formulario de contacto nuevo** (`_components/FormContacto.tsx`) pide
  solo nombre, localidad, email o WhatsApp y mensaje.
- **No envía ni guarda nada todavía.** `CONTACTO.endpoint` y
  `CONTACTO.responsable` (en `_config/site.ts`) están en `null`. Mientras falte
  cualquiera de los dos:
  - **en producción** no se muestra el formulario: se ofrece escribir por
    Instagram;
  - **en desarrollo** el formulario se ve, con "COMPLETAR" donde va el
    responsable, y al enviarlo avisa que el envío está desactivado.
- El formulario no usa `localStorage` ni servicios de terceros.

## Qué hace falta para habilitarlo

1. **Responsable de la base de datos.** Razón social (o persona) y un contacto
   (email o domicilio) para ejercer los derechos. Va en `CONTACTO.responsable`
   tal como debe leerse, por ejemplo: `"Asociación X (CUIT …), datos@dominio"`.
2. **Revisión legal** del texto de privacidad (`sitio.json → formulario.privacidad`).
   Hoy incluye:
   - el responsable y la finalidad (responder la consulta);
   - que no se ceden a terceros;
   - los derechos de acceso, rectificación y supresión, y el acceso gratuito
     cada seis meses (art. 14, inc. 3);
   - la AAIP como órgano de control.
3. **Inscripción de la base** en el Registro Nacional de Bases de Datos de la
   AAIP, si el abogado lo indica.
4. **Endpoint.** Un servicio propio que reciba el `POST` y guarde la consulta
   donde se decida. Va en `CONTACTO.endpoint`. TODO: hoy no existe.
   - Cuerpo JSON: `{ nombre, localidad, contacto, mensaje, acepta, sitio_web }`.
   - `sitio_web` es una trampa para bots: si llega con texto, descartar el envío.
   - Validar del lado del servidor: largos máximos (120, 80, 120 y 2000
     caracteres) y `acepta === true`.
   - Límite de envíos por IP, guardando solo un hash de la IP (como hacía
     `_archivo/sumate/route.ts`).
   - Definir el plazo de conservación y quién lee las consultas.
   - Responder `2xx` si se guardó. Cualquier otra respuesta muestra el error.

Con las dos variables completas, el formulario se habilita solo, también en
producción.

## Consentimiento

La casilla de aceptación **no viene marcada** y es obligatoria. El texto de
privacidad se muestra completo encima, no detrás de un enlace.
