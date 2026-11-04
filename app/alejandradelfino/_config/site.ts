/* Configuración única del sitio de Alejandra Delfino. Todo lo que cambia con
   el lanzamiento o con la mudanza a dominio propio se decide acá. */

/** Identidad de marca —logo AD, corazón verde y "Los sueños se cumplen"—.
    Bloqueada hasta el lanzamiento oficial: con false no aparece en ningún
    lugar (header, expediente, visión, pie, ícono ni imagen para compartir). */
export const LANZAMIENTO = false;

/** Indexación en buscadores. Mientras sea vista previa va `noindex, nofollow`:
    se habilita con SITE_INDEXABLE=true en el entorno, no tocando código. */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

/** En producción no se renderiza nada `pendiente` ni en `borrador`; en
    desarrollo se ve, con su sello, para poder revisarlo. */
export const PRODUCCION = process.env.NODE_ENV === "production";

/** Prefijo de rutas y archivos. Al mudarse a alejandradelfino.com.ar pasa a
    "" (junto con mover la carpeta a la raíz de app/): es la única variable. */
export const BASE_PATH = "/alejandradelfino";

export const DOMINIO = "https://alejandradelfino.com.ar";

/** Ruta del sitio o archivo de public/ con el prefijo aplicado. */
export const ruta = (p = "/") => `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;

/** Formulario de contacto. Sin endpoint ni responsable de la base, en
    producción se muestra el contacto por Instagram en lugar del formulario.
    Ver _docs/formulario.md antes de completar cualquiera de los dos. */
export const CONTACTO = {
  endpoint: null as string | null, // TODO: definir dónde se guardan las consultas (ver _docs/formulario.md)
  responsable: null as string | null, // TODO: razón social y contacto del responsable de la base
};
