import Image from "next/image";

const WA_URL = "https://api.whatsapp.com/send?phone=5491156072460&text=Hola%20H%C3%ADvrido!";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Image
                src="/images/logo/logofinal.svg"
                alt="Hivrido"
                width={120}
                height={42}
                style={{ objectFit: "contain", width: "auto", height: 42 }}
                unoptimized
              />
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
              <li><a href="mailto:hola@hivrido.com">hola@hivrido.com</a></li>
              <li>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li><a href="mailto:hola@hivrido.com">Trabaja con nosotros</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 <span>Hivrido</span>. Todos los derechos reservados.
          </div>
          <div className="footer-copy">
            Desarrollado por <span>Skynet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
