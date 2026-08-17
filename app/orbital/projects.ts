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
    id: "okupas",
    index: "02",
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
    id: "docke",
    index: "03",
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
    index: "04",
    title: "BRANDING",
    category: "Branding",
    year: "2025",
    client: "HIVRIDO",
    body: "Identidad de marca completa: diseño de logo, paleta, tipografía, voz y todo el sistema visual, documentado en un manual de marca que tu equipo puede aplicar sin depender de nosotros.",
    tags: ["Identidad", "Logo", "Manual de Marca", "Naming"],
    accent: "#39FF88",
    image: "/images/okupas/okupas-home.webp",
  },
  {
    id: "sintesis",
    index: "05",
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
    index: "06",
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
    index: "07",
    title: "HIVRIDO PLAY",
    category: "Plataforma",
    year: "2026",
    client: "HIVRIDO",
    body: "Nuestra plataforma audiovisual: cine, series, documentales y música de habla hispana en un solo lugar. Producciones propias y contenido curado. Es donde vive todo lo que producimos.",
    tags: ["Streaming", "Cine", "Series", "Originales"],
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
