/**
 * El nombre de la transición de vista que lleva RYTMOS a su ficha
 * (transicion.tsx). En un módulo común y no en el de cliente: lo usan
 * también páginas de servidor, que de un archivo "use client" recibirían una
 * referencia en vez del objeto.
 */
export const VIAJA = { viewTransitionName: "rytmos-obra" } as React.CSSProperties;
