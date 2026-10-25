/**
 * Salto a una sección de la portada de PLAY. Si ya se está en la portada, el
 * router de Next no ayuda: un link a la misma URL sin hash no vuelve arriba,
 * y uno con hash salta seco. Acá se baja suave a la sección (el scroll-margin
 * del CSS deja libre el header) o al tope para "Inicio", y la barra de
 * direcciones queda con el ancla correcta. Fuera de la portada, el link
 * navega normal y Next resuelve el ancla al llegar.
 */
export function jumpTo(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
  const [path, hash = ""] = url.split("#");
  if (path.replace(/\/$/, "") !== location.pathname.replace(/\/$/, "")) return;
  const target = hash ? document.getElementById(hash) : null;
  if (hash && !target) return;
  e.preventDefault();
  const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (target) target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  history.replaceState(history.state, "", url);
}
