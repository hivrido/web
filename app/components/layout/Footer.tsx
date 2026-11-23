import LogoAnimated from "../ui/LogoAnimated";
import WaGeneral from "../../components/ui/WaGeneral";


export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            {/* El mismo logo animado del menú. El SVG estático que había acá
                decía HIVRIDA, con A final. */}
            <div className="footer-logo">
              <LogoAnimated height={40} startOnView />
            </div>
            <p className="footer-desc">
              Conectamos marcas con artistas talentosos para crear eventos,
              colaboraciones y experiencias culturales que inspiran, generan
              emociones y dejan una huella duradera.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Servicios</div>
            <ul className="footer-links">
              <li><a href="#sec3">Producción de eventos</a></li>
              <li><a href="#sec3">Activaciones de marca</a></li>
              <li><a href="#sec3">Contenido artístico</a></li>
              <li><a href="#sec3">Estrategia cultural</a></li>
              <li><a href="#sec3">Gestión de artistas</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Contacto</div>
            <ul className="footer-links">
              <li><a href="mailto:hivridoads@gmail.com">hivridoads@gmail.com</a></li>
              <li>
                <WaGeneral lugar="el pie">WhatsApp</WaGeneral>
              </li>
              <li><a href="mailto:hivridoads@gmail.com">Trabaja con nosotros</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 <span>Hivrido</span>. Todos los derechos reservados.
          </div>
          <div className="footer-copy">
            Desarrollado por <span>Lucas Manzano</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
