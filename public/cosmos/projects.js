/**
 * Datos del carrusel orbital.
 * `image` es opcional: si falla la carga, cards.js genera un fondo procedural
 * con la misma paleta, así nunca queda un hueco en el anillo.
 * `logo`  es opcional: si está, reemplaza al título tipográfico en la tarjeta.
 * `href`  es opcional: si está, la tarjeta muestra la pastilla PLAY y el panel
 *         ofrece el CTA para ir a verla.
 */

export const PROJECTS = [
  {
    id: 'nebula',
    index: '01',
    title: 'GROW DIGITAL',
    /* La ficha dice otra cosa que el HUD, y en dos líneas */
    cardTitle: ['Ecosistema', 'Digital'],
    /* Fracción del cuerpo base: dos líneas largas pesan más que un título
       corto, y a cuerpo pleno se comían la ficha */
    cardTitleScale: 0.78,
    /* El título del HUD se pinta con el gradiente epic de la home
       (blanco → lavanda → violeta → magenta → blanco) */
    gradientTitle: true,
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Diseño Web & APP',
    /* Corta —la usan el HUD, la lista de disciplinas y el panel— */
    category: 'Inteligencia Artificial',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Desarrollamos sistemas personalizados',
    year: '2025',
    /* Sin `client`: es un servicio propio, no una pieza para alguien, así que
       el panel retira la ficha técnica de cliente, año y disciplina. */
    body: 'Diseño web y aplicaciones a medida, con el software que hace falta detrás: sistemas CRM, integraciones y automatizaciones que conectan lo que ya usás. Desarrollo de programación a medida personalizada, con Python y las últimas tecnologías, para que cada pieza escale con el negocio.',
    tags: ['Diseño Web', 'Apps', 'CRM', 'Python'],
    /* Desvía el link del pie del panel: en vez del WhatsApp genérico, lleva a
       la landing de desarrollo digital. */
    link: { label: 'Ir a Desarrollo digital', href: '/diseno-web/' },
    accent: '#B026FF',
    image: '/images/bg/21.jpg',
  },
  {
    id: 'okupas',
    index: '02',
    title: 'OKUPAS',
    category: 'Serie · Restauración',
    year: '2025',
    client: 'Underground Contenidos',
    body: 'Restauración y remasterización completa de la serie. Reconstrucción de color plano a plano, limpieza de grano y entrega en 4K para plataforma.',
    tags: ['Color', 'Restauración', '4K'],
    accent: '#FF2E9A',
    image: '/images/okupas/capitulo1.jpg',
    logo: '/images/okupas/logo-okupas.png',
    href: '/movie/okupas/',
    cta: 'Ver la serie',
  },
  {
    id: 'docke',
    index: '03',
    title: 'DOCKE',
    category: 'Campaña · Growth',
    year: '2024',
    client: 'Docke',
    body: 'Campaña de performance con producción audiovisual propia. Del insight a la pieza, medido contra costo por adquisición real.',
    tags: ['Ads', 'Film', 'Data'],
    accent: '#00E5FF',
    image: '/images/bg/docke.jpg',
  },
  {
    id: 'oraculo',
    index: '04',
    title: 'ORÁCULO',
    category: 'Instalación · WebGL',
    year: '2025',
    client: 'Bienal de Arte Digital',
    body: 'Instalación inmersiva que reacciona a la presencia del público. Render en tiempo real proyectado sobre tres superficies sincronizadas.',
    tags: ['WebGL', 'Sonido', 'Escena'],
    accent: '#7C3AED',
    image: '/images/okupas/okupas-home.webp',
  },
  {
    id: 'animacion',
    index: '05',
    title: 'SÍNTESIS',
    category: 'IA · Generativo',
    year: '2024',
    client: 'Laboratorio Síntesis',
    body: 'Modelo entrenado con el universo visual de la marca. Producción de volumen sin perder autoría: cada salida pasa por dirección de arte.',
    tags: ['IA', '3D', 'Dirección'],
    accent: '#39FF88',
    image: '/images/bg/animacion-poster.jpg',
  },
  {
    id: 'ritual',
    index: '06',
    title: 'RITUAL',
    category: 'Live · Mapping',
    year: '2023',
    client: 'Ritual Live',
    body: 'Experiencia en vivo para tres mil personas. Escenografía, mapping y contenido generativo corriendo sincronizado con el set del artista.',
    tags: ['Live', 'Mapping', 'Show'],
    accent: '#FF6A00',
    image: '/images/team/1.jpg',
  },
  {
    id: 'monolito',
    index: '07',
    title: 'MONOLITO',
    category: 'Producto · Sistema',
    year: '2024',
    client: 'Grupo Monolito',
    body: 'Plataforma digital y design system. Componentes documentados, performance auditada y un front que el equipo interno puede sostener solo.',
    tags: ['Producto', 'Front', 'Sistema'],
    accent: '#C9A84C',
    image: '/images/bg/hivrido-chrome.png',
  },
  {
    id: 'puny',
    index: '08',
    title: 'PUNY',
    category: 'Agentes · Automatización',
    year: '2026',
    client: 'HIVRIDO',
    body: 'Nuestra colmena de agentes: responde, califica y hace seguimiento sin intervención. El motor que hoy corre por dentro de la agencia.',
    tags: ['Agentes', 'CRM', 'Auto'],
    accent: '#A78BFA',
    image: '/images/team/2.jpg',
  },
];
