export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  client: string;
  body: string;
  tags: string[];
  /** Acento del proyecto: retinta el borde 3D y todo el HUD. */
  accent: string;
  /** Opcional: si falla la carga, cards.ts genera un fondo procedural. */
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "okupas",
    index: "01",
    title: "OKUPAS",
    category: "Serie · Restauración",
    year: "2025",
    client: "Underground Contenidos",
    body: "Restauración y remasterización completa de la serie. Reconstrucción de color plano a plano, limpieza de grano y entrega en 4K para plataforma.",
    tags: ["Color", "Restauración", "4K"],
    accent: "#FF2E9A",
    image: "/images/okupas/capitulo1.jpg",
  },
  {
    id: "nebula",
    index: "02",
    title: "GROW DIGITAL",
    category: "Inteligencia Artificial",
    year: "2025",
    client: "Estudio Nebula",
    body: "Sistema de identidad en movimiento: paleta, tipografía y un lenguaje de transiciones que funciona igual en un reel que en una gráfica fija.",
    tags: ["Branding", "Motion", "Arte"],
    accent: "#B026FF",
    image: "/images/bg/21.jpg",
  },
  {
    id: "docke",
    index: "03",
    title: "DOCKE",
    category: "Campaña · Growth",
    year: "2024",
    client: "Docke",
    body: "Campaña de performance con producción audiovisual propia. Del insight a la pieza, medido contra costo por adquisición real.",
    tags: ["Ads", "Film", "Data"],
    accent: "#00E5FF",
    image: "/images/bg/docke.jpg",
  },
  {
    id: "oraculo",
    index: "04",
    title: "ORÁCULO",
    category: "Instalación · WebGL",
    year: "2025",
    client: "Bienal de Arte Digital",
    body: "Instalación inmersiva que reacciona a la presencia del público. Render en tiempo real proyectado sobre tres superficies sincronizadas.",
    tags: ["WebGL", "Sonido", "Escena"],
    accent: "#7C3AED",
    image: "/images/okupas/okupas-home.webp",
  },
  {
    id: "sintesis",
    index: "05",
    title: "SÍNTESIS",
    category: "IA · Generativo",
    year: "2024",
    client: "Laboratorio Síntesis",
    body: "Modelo entrenado con el universo visual de la marca. Producción de volumen sin perder autoría: cada salida pasa por dirección de arte.",
    tags: ["IA", "3D", "Dirección"],
    accent: "#39FF88",
    image: "/images/bg/animacion-poster.jpg",
  },
  {
    id: "ritual",
    index: "06",
    title: "RITUAL",
    category: "Live · Mapping",
    year: "2023",
    client: "Ritual Live",
    body: "Experiencia en vivo para tres mil personas. Escenografía, mapping y contenido generativo corriendo sincronizado con el set del artista.",
    tags: ["Live", "Mapping", "Show"],
    accent: "#FF6A00",
    image: "/images/team/1.jpg",
  },
  {
    id: "monolito",
    index: "07",
    title: "MONOLITO",
    category: "Producto · Sistema",
    year: "2024",
    client: "Grupo Monolito",
    body: "Plataforma digital y design system. Componentes documentados, performance auditada y un front que el equipo interno puede sostener solo.",
    tags: ["Producto", "Front", "Sistema"],
    accent: "#C9A84C",
    image: "/images/bg/hivrido-chrome.png",
  },
  {
    id: "puny",
    index: "08",
    title: "PUNY",
    category: "Agentes · Automatización",
    year: "2026",
    client: "HIVRIDO",
    body: "Nuestra colmena de agentes: responde, califica y hace seguimiento sin intervención. El motor que hoy corre por dentro de la agencia.",
    tags: ["Agentes", "CRM", "Auto"],
    accent: "#A78BFA",
    image: "/images/team/2.jpg",
  },
];
