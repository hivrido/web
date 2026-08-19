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
    id: "nebula",
    index: "01",
    title: "GROW DIGITAL",
    category: "Inteligencia Artificial",
    year: "2025",
    client: "HIVRIDO",
    body: "Diseño web y aplicaciones a medida, con el software que hace falta detrás: sistemas CRM, integraciones y automatizaciones que conectan lo que ya usás. Desarrollamos con Python y las últimas tecnologías, y cada pieza escala con el negocio.",
    tags: ["Diseño Web", "Apps", "CRM", "Python"],
    accent: "#B026FF",
    image: "/images/bg/21.jpg",
  },
  {
    id: "docke",
    index: "02",
    title: "AGENTES",
    category: "Automatización",
    year: "2025",
    client: "HIVRIDO",
    body: "Colmenas de agentes IA que operan solas: atienden consultas, califican interesados, ejecutan procesos y reportan a escala. Conectados a tu CRM, tus campañas y tus canales de comunicación, trabajando mientras dormís.",
    tags: ["Multi-agente", "CRM", "Autónomo", "24/7"],
    accent: "#00E5FF",
    image: "/images/bg/docke.jpg",
  },
  {
    id: "oraculo",
    index: "03",
    title: "BRANDING",
    category: "Branding",
    year: "2025",
    client: "HIVRIDO",
    body: "Identidad de marca completa: diseño de logo, paleta, tipografía, voz y todo el sistema visual, documentado en un manual de marca que tu equipo puede aplicar sin depender de nosotros.",
    tags: ["Identidad", "Logo", "Manual de Marca", "Naming"],
    accent: "#39FF88",
    // Sin `image` a propósito: se pintaba con el logotipo de Okupas, una marca
    // ajena ilustrando nuestra identidad. Va el fondo procedural del acento.
  },
  {
    id: "sintesis",
    index: "04",
    title: "CINE & VIDEO",
    category: "Cine & Video",
    year: "2025",
    client: "HIVRIDO",
    body: "Producción cinematográfica, videoclips y contenido para marcas. Desarrollamos proyectos desde la idea hasta la pantalla, cuidando cada etapa: desarrollo, guion, rodaje y postproducción.",
    tags: ["Cine", "Videoclips", "Dirección", "Post"],
    accent: "#7C3AED",
    image: "/images/bg/animacion-poster.jpg",
  },
  {
    id: "ritual",
    index: "05",
    title: "EQUIPO",
    category: "Equipo",
    year: "2025",
    client: "HIVRIDO",
    body: "Hivrido lo dirigen Lucas Manzano y Sergio Podeley, sus dos CEOs. Dos perfiles opuestos complementarios: la dirección artística que pone lo emocional en cada pieza, y la capa tecnológica que la convierte en un sistema que escala.",
    tags: ["Dirección", "Estrategia", "IA", "Producción"],
    accent: "#FF6A00",
    image: "/images/team/1.jpg",
  },
  {
    id: "monolito",
    index: "06",
    title: "HIVRIDO PLAY",
    category: "Contenidos",
    year: "2026",
    client: "HIVRIDO",
    body: "Nuestra plataforma audiovisual: cine, series, documentales y música de habla hispana en un solo lugar. Producciones propias y contenido curado. Es donde vive todo lo que producimos.",
    tags: ["Streaming", "Cine", "Series", "Originales"],
    accent: "#C9A84C",
    image: "/images/bg/hivrido-chrome.png",
  },
  {
    id: "puny",
    index: "07",
    title: "PUBLICIDAD",
    category: "Publicidad",
    year: "2026",
    client: "HIVRIDO",
    body: "Campañas en Meta, Google y YouTube en todos sus formatos: búsqueda, Performance Max, Shopping, in-stream, bumpers y Shorts. Los creativos los producimos nosotros, y el crecimiento de redes y las colaboraciones con artistas sostienen lo que la pauta empuja.",
    tags: ["Meta Ads", "Google Ads", "YouTube", "Influencers"],
    accent: "#A78BFA",
    image: "/images/team/2.jpg",
  },
];
