import Link from "next/link";
import LogoAnimated from "../ui/LogoAnimated";
import WaGeneral from "../../components/ui/WaGeneral";

/** Pie de PLAY, el mismo en la portada y en las fichas. */
export default function PlayFooter() {
  return (
    <footer className="hp-footer">
      <div className="hp-footer-brand">
        <div className="hp-logo hp-footer-mark">
          <Link href="/" aria-label="Hivrido, inicio" className="hp-logo-mark">
            <LogoAnimated height={26} startOnView />
          </Link>
          <Link href="/play/" className="hp-logo-pill" aria-label="Hivrido PLAY, catálogo">Play</Link>
        </div>
        <p>Cine y series hechos en Argentina.</p>
      </div>
      <nav className="hp-footer-cols" aria-label="Pie de página">
        <div>
          <span className="hp-footer-label">Explorar</span>
          <Link href="/play/">Catálogo</Link>
          <Link href="/play/#series">Series</Link>
          <Link href="/play/#peliculas">Películas</Link>
          <Link href="/play/#proximamente">Próximamente</Link>
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
