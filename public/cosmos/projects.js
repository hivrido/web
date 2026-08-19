/**
 * Datos del carrusel orbital.
 * `image` es opcional: si falla la carga, cards.js genera un fondo procedural
 * con la misma paleta, así nunca queda un hueco en el anillo.
 * `logo`  es opcional: si está, reemplaza al título tipográfico en la tarjeta.
 * `href`  es opcional: si está, la tarjeta muestra la pastilla PLAY y el botón
 *         del panel lleva a verla.
 * `link`  es la alternativa a `href` para las fichas sin nada publicado: da
 *         destino y etiqueta al botón del panel, sin encender el PLAY.
 * `hudCategory` es opcional: reemplaza a `category` en el rótulo del HUD,
 *         para las fichas donde la disciplina repetiría el título que ya se
 *         lee gigante debajo. La lista de disciplinas sigue usando
 *         `category`, que es la palabra con la que la gente busca.
 */

export const PROJECTS = [
  {
    id: 'nebula',
    index: '01',
    title: 'GROW DIGITAL',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Digital'],
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
    /* Destino del botón del panel: la landing de desarrollo digital */
    link: { label: 'Ir a Desarrollo digital', href: '/diseno-web/' },
    accent: '#B026FF',
    image: '/images/bg/21.jpg',
  },
  {
    id: 'docke',
    index: '02',
    title: 'AGENTES',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Colmena'],
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Agentes IA',
    category: 'Automatización',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Trabajan solos las 24 horas',
    year: '2025',
    /* Sin `client`: es un servicio propio, no una pieza para alguien */
    body: 'Colmenas de agentes IA que operan solas: atienden consultas, califican interesados, ejecutan procesos y reportan a escala. Conectados a tu CRM, tus campañas y tus canales de comunicación, trabajando mientras dormís. Es PUNY, el motor que corre dentro de Hivrido, adaptado a tu negocio.',
    tags: ['Multi-agente', 'CRM', 'Autónomo', '24/7'],
    /* Destino del botón del panel: la landing de la colmena */
    link: { label: 'Ir a Colmena de agentes', href: '/colmena-agentes/' },
    accent: '#39FF88',
    image: '/images/bg/docke.jpg',
  },
  {
    id: 'oraculo',
    index: '03',
    title: 'BRANDING',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Marcas'],
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Identidad de',
    category: 'Branding',
    /* El título ya dice BRANDING: el rótulo aporta la otra mitad del oficio */
    hudCategory: 'Identidad',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Manual de marca y sistema visual',
    year: '2025',
    /* Sin `client`: es un servicio propio, no una pieza para alguien */
    body: 'Identidad de marca completa: diseño de logo, paleta, tipografía, voz y todo el sistema visual, documentado en un manual de marca que tu equipo puede aplicar sin depender de nosotros. Construimos marcas que generan reconocimiento y conexión emocional, no un archivo suelto.',
    tags: ['Identidad', 'Logo', 'Manual de Marca', 'Naming'],
    /* Destino del botón del panel: la landing de branding */
    link: { label: 'Ir a Branding', href: '/branding/' },
    accent: '#00E5FF',
    /* Sin `image` a propósito: la ficha se pintaba con el logotipo de Okupas,
       una marca ajena ilustrando nuestra propia identidad. Hasta que tenga
       arte propio va el fondo procedural en su acento, que es de la casa. */
  },
  {
    id: 'animacion',
    index: '04',
    title: 'CINE & VIDEO',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Cine'],
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Producción Audiovisual',
    category: 'Cine & Video',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'De la idea a la pantalla',
    year: '2025',
    /* Sin `client`: es un servicio propio, no una pieza para alguien */
    body: 'Producción cinematográfica, videoclips y contenido para marcas. Desarrollamos proyectos desde la idea hasta la pantalla, cuidando cada etapa: desarrollo, guion, rodaje y postproducción. Apostamos a narrativas que trascienden y construyen universos propios.',
    tags: ['Cine', 'Videoclips', 'Dirección', 'Post'],
    /* Destino del botón del panel: la landing audiovisual */
    link: { label: 'Ir a Cine & Video', href: '/cine-video/' },
    accent: '#7C3AED',
    image: '/images/bg/animacion-poster.jpg',
  },
  {
    id: 'ritual',
    index: '05',
    title: 'EQUIPO',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Equipo'],
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Lucas Manzano & Sergio Podeley',
    category: 'Equipo',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Los que te atienden son los que hacen',
    year: '2025',
    /* Sin `client`: es la propia agencia */
    body: 'Hivrido lo dirigen Lucas Manzano y Sergio Podeley, sus dos CEOs. Dos perfiles opuestos complementarios: la dirección artística que pone lo emocional en cada pieza, y la capa tecnológica que la convierte en un sistema que escala. No trabajamos con equipos tercerizados.',
    tags: ['Dirección', 'Estrategia', 'IA', 'Producción'],
    /* Destino del botón del panel: la página del equipo */
    link: { label: 'Ir a Equipo', href: '/equipo/' },
    accent: '#FF6A00',
    image: '/images/team/1.jpg',
  },
  {
    id: 'monolito',
    index: '06',
    title: 'HIVRIDO PLAY',
    /* La ficha lleva el logotipo en blanco en lugar de un título tipografiado */
    brandLogo: true,
    /* Con `href` la tarjeta muestra el PLAY y el click navega */
    href: '/movie/',
    cta: 'Entrar a Hivrido PLAY',
    /* Reemplaza al ornamento de índice sobre el título de la ficha */
    kicker: 'Plataforma Audiovisual',
    category: 'Contenidos',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Cine y series en un solo lugar',
    year: '2026',
    /* Sin `client`: es plataforma propia */
    body: 'Nuestra plataforma audiovisual: cine, series, documentales y música de habla hispana en un solo lugar. Producciones propias y contenido curado, con estrenos, tendencias y calendario. Es donde vive todo lo que producimos.',
    tags: ['Streaming', 'Cine', 'Series', 'Originales'],
    accent: '#C9A84C',
    image: '/images/bg/hivrido-chrome.png',
  },
  {
    id: 'puny',
    index: '07',
    title: 'PUBLICIDAD',
    /* La ficha dice otra cosa que el HUD */
    cardTitle: ['Ads'],
    /* Reemplaza al ornamento de índice sobre el título de la ficha. Cada
       entrada es una línea: en un renglón solo ocupaba casi todo el ancho
       de la ficha y competía con el título. */
    kicker: ['Partner de', 'Google y Meta'],
    category: 'Publicidad',
    /* Pie de la ficha, en lugar de `categoría · año` */
    meta: 'Inversión que vuelve en clientes',
    year: '2026',
    /* Sin `client`: es un servicio propio */
    body: 'Campañas en Meta, Google y YouTube en todos sus formatos: búsqueda, Performance Max, Shopping, in-stream, bumpers y Shorts. Los creativos los producimos nosotros. Y lo que la pauta empuja, el crecimiento de redes y las colaboraciones con artistas e influencers lo sostienen. Todo medido contra el costo real de conseguir un cliente.',
    tags: ['Meta Ads', 'Google Ads', 'YouTube', 'Influencers'],
    /* Destino del botón del panel: la landing de publicidad */
    link: { label: 'Ir a Publicidad', href: '/publicidad/' },
    accent: '#A78BFA',
    image: '/images/team/2.jpg',
  },
];
