/**
 * Textos legales de la cesión de derechos de imagen, versionados.
 *
 * Cada versión es inmutable: una vez que alguien firmó contra ella, su texto no
 * se toca nunca más. Corregir una coma implica agregar una entrada nueva, no
 * editar la vieja —si el texto cambiara bajo los pies de una firma ya dada, esa
 * firma dejaría de probar qué se aceptó—.
 *
 * El servidor guarda, junto a cada registro, el id de versión y el SHA-256 del
 * texto que hay acá. Con esos dos datos se reconstruye después, palabra por
 * palabra, qué leyó cada persona el día que firmó.
 */

export type VersionCesion = {
  id: string;
  /** Fecha en que esta redacción entró en vigencia (ISO, solo día). */
  vigenteDesde: string;
  titulo: string;
  /** El texto exacto que se muestra y que se hashea. No reformatear. */
  texto: string;
};

/* La redacción nombra las tres normas que dan el marco en Argentina: el
   art. 31 de la ley 11.723 —que exige consentimiento para publicar un
   retrato—, el art. 53 del Código Civil y Comercial —que regula el derecho a
   la imagen— y la ley 25.326, que es la que obliga a declarar que se están
   registrando datos personales. Ese último párrafo no es decorativo: sin él,
   los metadatos que hacen a la firma verificable se tomarían sin avisar. */
const V1 = `CESIÓN DE DERECHOS DE IMAGEN, VOZ Y ACTUACIÓN

1. OBJETO
Por el presente instrumento, la persona firmante (en adelante, "el Cedente") cede a HIVRIDO (en adelante, "el Cesionario") el derecho a captar, fijar, reproducir, editar, comunicar y difundir su imagen, voz, nombre e interpretación, obtenidos durante castings, pruebas de cámara, ensayos, rodajes y toda instancia de producción audiovisual en la que el Cedente participe.

2. ALCANCE
La cesión comprende el material captado en cualquier soporte y formato, presente o futuro, y su utilización en obras audiovisuales, series, películas, cortometrajes, piezas publicitarias, contenidos para redes sociales, material de prensa y promoción, y cualquier otro uso vinculado a la obra y a su difusión.

3. TERRITORIO Y PLAZO
La cesión se otorga para todo el mundo y por el plazo máximo que admita la legislación aplicable, sin límite de cantidad de emisiones, exhibiciones o reproducciones.

4. CARÁCTER GRATUITO
La presente cesión se otorga a título gratuito, sin derecho a contraprestación económica alguna por la captación, el uso o la difusión del material, salvo que exista un acuerdo económico separado y por escrito entre las partes.

5. DERECHOS MORALES
El Cesionario podrá editar, montar, recortar y modificar el material con fines narrativos y de producción. El Cedente presta conformidad a dichas modificaciones, sin que ello afecte el respeto a su persona ni habilite usos injuriosos, difamatorios o que lo expongan al ridículo.

6. MARCO LEGAL
Esta cesión se otorga en los términos del artículo 31 de la Ley 11.723 de Propiedad Intelectual y del artículo 53 del Código Civil y Comercial de la Nación, que requieren el consentimiento de la persona para la reproducción y publicación de su imagen.

7. MENORES DE EDAD
Si el Cedente es menor de dieciocho (18) años, la presente cesión sólo es válida con la firma del padre, madre, tutor o representante legal, quien declara contar con facultades suficientes para otorgarla en su nombre.

8. DATOS PERSONALES Y REGISTRO DE LA FIRMA
En los términos de la Ley 25.326 de Protección de Datos Personales, el Cedente presta conformidad para que el Cesionario registre y conserve los datos consignados en este formulario.

El Cedente reconoce y acepta expresamente que, al momento de enviar este formulario, el Cesionario registra además, como constancia técnica del acto de firma: la fecha y hora del servidor, la dirección IP desde la que se firmó, el navegador, el sistema operativo y el tipo de dispositivo utilizados, la resolución de pantalla, el idioma y la zona horaria del dispositivo, y una huella digital (hash SHA-256) del texto exacto que se le exhibió. Estos datos se conservan con la única finalidad de acreditar quién firmó, cuándo y desde dónde.

El titular de los datos puede ejercer los derechos de acceso, rectificación y supresión escribiendo a HIVRIDO por los canales de contacto publicados en hivrido.com.

9. DECLARACIÓN FINAL
El Cedente declara haber leído íntegramente el presente texto, comprender su alcance y firmarlo de manera libre y voluntaria.`;

export const VERSIONES: Record<string, VersionCesion> = {
  "v1": {
    id: "v1",
    vigenteDesde: "2026-09-18",
    titulo: "Cesión de derechos de imagen, voz y actuación",
    texto: V1,
  },
};

/** La versión que se le muestra hoy a quien entra a firmar. */
export const VERSION_ACTUAL = "v1";

export function getVersion(id: string): VersionCesion | null {
  return Object.prototype.hasOwnProperty.call(VERSIONES, id) ? VERSIONES[id] : null;
}
