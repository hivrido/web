import Link from "next/link";
import LogoAnimated from "../ui/LogoAnimated";
import WaGeneral from "../../components/ui/WaGeneral";

/** Pie de PLAY, el mismo en la portada y en las fichas. */
export default function PlayFooter() {
  return (
    <footer className="hp-footer">
      <div className="hp-footer-brand">
        <Link href="/" className="hp-logo hp-footer-mark" aria-label="Hivrido PLAY, inicio">
          <LogoAnimated height={26} startOnView />
          <span className="hp-logo-pill">Play</span>
        </Link>
        <p>Cine y series hechos en Argentina.</p>
      </div>
      <nav className="hp-footer-cols" aria-label="Pie de página">
        <div>
          <span className="hp-footer-label">Explorar</span>
          <Link href="/#series">Series</Link>
          <Link href="/#peliculas">Películas</Link>
          <Link href="/#proximamente">Próximamente</Link>
        </div>
        <div>
          <span className="hp-footer-label">Hivrido</span>
          <Link href="/casting/">Casting</Link>
          <Link href="/web/">Productora</Link>
          <WaGeneral lugar="el pie">Contacto</WaGeneral>
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
