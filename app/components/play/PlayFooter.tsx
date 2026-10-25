import Link from "next/link";
import LogoAnimated from "../ui/LogoAnimated";

/** Pie de PLAY, el mismo en la portada y en las fichas. */
export default function PlayFooter() {
  return (
    <footer className="hp-footer">
      <div className="hp-footer-brand">
        <Link href="/play/" className="hp-logo hp-footer-mark" aria-label="Hivrido PLAY, inicio">
          <LogoAnimated height={26} startOnView />
          <span className="hp-logo-pill">Play</span>
        </Link>
        <p>Cine y series independientes, hechos en Argentina.</p>
      </div>
      <nav className="hp-footer-cols" aria-label="Pie de página">
        <div>
          <span className="hp-footer-label">Explorar</span>
          <Link href="/play/#series">Series</Link>
          <Link href="/play/#peliculas">Películas</Link>
          <Link href="/play/#proximamente">Próximamente</Link>
        </div>
        <div>
          <span className="hp-footer-label">Hivrido</span>
          <Link href="/casting/">Casting</Link>
          <Link href="/">Productora</Link>
          <a href="https://wa.me/5491156072460?text=Hola!%20Quiero%20hablar%20con%20HIVRIDO" target="_blank" rel="noopener noreferrer">Contacto</a>
        </div>
        <div>
          <span className="hp-footer-label">Redes</span>
          <a href="https://www.instagram.com/hivrido.product.x1_ok/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:hola@hivrido.com">hola@hivrido.com</a>
        </div>
      </nav>
      <p className="hp-footer-legal">© 2026 Hivrido PLAY</p>
    </footer>
  );
}
