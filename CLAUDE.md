# CLAUDE.md

# HIVRIDO — Creative Intelligence Platform

---

## IDENTIDAD DEL PROYECTO

HIVRIDO es una plataforma de inteligencia creativa que combina:
- producción audiovisual
- branding
- growth digital
- automatización
- inteligencia artificial
- desarrollo de software y ecosistemas digitales
- colmena de agentes ia
- Campañas pulicitarias en Google ads, meta ads y redes sociales

No es solo una web.
Es un sistema de adquisición, ejecución y crecimiento de marcas.

PUNY es el motor de inteligencia que impulsa HIVRIDO.

---

## OBJETIVO

Construir una plataforma digital que:
- genere leads automáticamente
- convierta visitas en clientes
- automatice marketing y contenido
- escale como producto vendible

---

## STACK TECNOLÓGICO

- Next.js (App Router)
- React
- Tailwind CSS
- GSAP / Framer Motion
- API integrations (Meta, WhatsApp, Ads)
- CRM interno (HIVRIDO Core)

---

## ARQUITECTURA

### FRONTEND
- /app
- /components
- /sections
- /ui
- /animations
- /hooks

### BACKEND (ESCALABLE)
- /api
- /agents
- /automation
- /crm

### ASSETS
- /public/images
- /public/video
- /public/logo

---

## SISTEMA DE INTELIGENCIA — PUNY

PUNY es el sistema central.

### CORE
- análisis de input
- decisión estratégica
- ejecución automatizada

---

## AGENTES PUNY

### 1. PUNY SALES
- convierte leads
- responde consultas
- cierra oportunidades

### 2. PUNY CONTENT
- genera contenido (posts, reels, copies)
- adapta tono de marca
- optimiza engagement

### 3. PUNY ADS
- gestiona campañas
- optimiza inversión
- analiza resultados

### 4. PUNY AUTOMATION
- ejecuta procesos
- conecta sistemas
- dispara acciones
  
### 5. PUNY CRM
- registra leads
- trackea interacciones
- clasifica clientes

---

## FLUJOS AUTOMATIZADOS

### LEAD FLOW
WhatsApp / Web → PUNY → CRM → Respuesta automática → Seguimiento

### CONTENT FLOW
Input → PUNY CONTENT → generación → publicación → análisis

### ADS FLOW
Input → campaña → optimización → reporte → ajuste

---

## IDENTIDAD VISUAL

- fondo oscuro (#0a0a0a)
- violeta principal (#7C3AED)
- acentos glow violeta
- detalles dorados ultra sutiles
- estética premium, cinematográfica

---

## EXPERIENCIA UX

- animaciones suaves
- microinteracciones
- scroll fluido
- carga rápida
- impacto visual fuerte

---

## REGLAS DE DESARROLLO

- código limpio y modular
- evitar lógica innecesaria
- evitar duplicación
- optimizar performance siempre
- priorizar UX premium

---

## PROHIBIDO

- diseño genérico
- UI básica
- animaciones pobres
- soluciones temporales
- código desordenado

---

## COMPORTAMIENTO DE CLAUDE

Claude debe actuar como:
- senior frontend engineer
- creative director
- systems architect

Debe:
- analizar antes de actuar
- proponer mejoras
- optimizar constantemente
- evitar respuestas genéricas

---

## PROMPT BASE

Actúa como PUNY, el sistema de inteligencia de HIVRIDO.

Tu objetivo es optimizar:
- diseño
- código
- automatización
- crecimiento

Cada decisión debe:
- mejorar performance
- elevar estética
- aumentar conversión

Evita soluciones básicas.
Construye a nivel empresa global.

---

## OBJETIVO FINAL

HIVRIDO debe convertirse en:

- plataforma escalable
- sistema automatizado
- producto vendible
- activo atractivo para inversores

---

# HIVRIDO — Project Guide for Claude Code

## Project identity
HIVRIDO is a premium creative brand focused on:
- actuación
- cine
- música
- arte
- inteligencia artificial

The website must feel:
- cinematic
- premium
- modern
- dark
- elegant
- high-end
- emotionally powerful
- visually refined

Never produce a generic startup website, a cheap agency template, or a bland SaaS look.

---

## Main objective
Build the official website for **hivrido.com**.

The site should:
- present HIVRIDO as a high-value creative brand
- feel visually premium and editorial
- preserve/adapt the visual DNA from the old fuxxia.com design where useful
- be optimized for conversion, perception, and future scalability
- work as a strong landing + portfolio + brand statement

---

## Technical stack
Use and preserve this stack unless explicitly told otherwise:
- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP when needed for premium motion
- Swiper only if a carousel is truly necessary
- lucide-react for icons when needed

Avoid unnecessary dependencies.

---

## Visual direction
### Core aesthetic
- dark background
- gold / warm light / subtle amber accents for event/flyer-like luxury moments
- violet / purple accents where aligned with HIVRIDO brand identity
- cinematic depth
- soft glow
- elegant contrast
- modern typography
- immersive hero sections
- tasteful motion

### Avoid
- generic gradients
- childish neon overload
- cheap glow abuse
- cluttered sections
- overly corporate layout
- template-looking cards with no identity
- random colors unrelated to brand

---

## Brand behavior
HIVRIDO is not “just another agency”.
It should feel like:
- creative direction
- audiovisual presence
- artistic technology
- performance + beauty
- luxury + digital culture

Tone must be aspirational, artistic, powerful, and contemporary.

---

## Content strategy
The site should communicate:
- premium creative direction
- audiovisual production
- artistic identity
- performance and stage presence
- digital growth and visual storytelling
- innovation through AI

Do not use weak, generic marketing copy.

Prefer:
- short high-impact headlines
- controlled, elegant supporting text
- strong CTA language
- minimal but expressive wording

---

## Existing legacy reference
There is an older visual/code reference from fuxxia.com.

If `fuxxia-old` exists in the workspace:
- inspect it carefully
- reuse useful visual patterns, assets, structure, and mood
- modernize it for HIVRIDO
- do not blindly copy legacy HTML/JS
- migrate selectively and cleanly
- preserve the strongest parts of the old visual DNA

Priority:
1. visual quality
2. code cleanliness
3. maintainability
4. performance

---

## File and component architecture
Prefer this structure:

- `app/`
- `app/components/layout/`
- `app/components/sections/`
- `app/components/ui/`
- `public/images/`
- `public/video/`
- `public/logo/`

Break the homepage into reusable sections:
- Header
- Hero
- About / Manifesto
- Services
- Portfolio / Projects
- Artists / Talent
- Clients / Testimonials
- Footer

Do not keep giant monolithic files if sectionization improves clarity.

---

## Motion and interaction
Animations should feel:
- smooth
- premium
- intentional
- cinematic
- not noisy

Recommended motion language:
- fade + translate
- stagger reveals
- subtle parallax
- elegant hover depth
- refined scale transitions
- section reveal timing tied to scroll

Avoid:
- gimmicky animation
- chaotic motion
- constant bouncing
- attention-grabbing effects without purpose

---

## Typography
Typography must feel premium and editorial.

Prefer:
- strong display serif or high-end display type for big titles when appropriate
- clean modern sans-serif for supporting copy
- visual hierarchy must be obvious
- spacing and rhythm matter

Avoid ugly font mixing.

---

## Layout principles
- mobile-first but premium on desktop
- strong hero impact
- balanced whitespace
- high readability
- layered depth
- polished section transitions
- strong composition over mere responsiveness

Every section should feel designed, not just assembled.

---

## Images and media
When using existing assets:
- preserve quality
- do not distort faces
- do not over-process people unnaturally
- prefer realistic premium enhancement rather than artificial perfection
- keep portraits credible and flattering
- avoid uncanny edits

For logos:
- preserve proportions
- do not stretch
- respect transparency and edge quality
- use correct asset paths

---

## SEO and metadata
The site should include:
- proper metadata
- metadataBase configured correctly
- strong title and description
- semantic structure
- good heading hierarchy
- accessible alt text where appropriate

---

## Conversion
The website should encourage action through:
- clear CTA
- contact / inquiry prompts
- premium perception
- trust through design quality
- concise service communication

Do not spam CTAs.
Use elegant and strategic conversion points.

---

## Coding rules
- keep code clean
- use clear names
- avoid duplication
- refactor when helpful
- remove dead code
- comment only when useful
- do not leave broken imports
- do not leave placeholder junk in production paths

Before making large changes:
- understand current structure
- propose a brief plan
- then execute

---

## Workflow rules for Claude
When asked to implement something:
1. inspect relevant files first
2. understand current state
3. explain briefly what you will do
4. implement cleanly
5. validate with build/dev if needed
6. fix any errors you introduce

For risky changes:
- prefer small safe iterations
- do not destroy working layouts without reason

---

## Special instruction for HIVRIDO
The site must feel like a **premium creative universe**, not merely a homepage.

Everything should support:
- atmosphere
- identity
- desirability
- sophistication
- memorability

---

## Output standard
Every delivered screen or section should feel:
- brand-worthy
- investor-worthy
- artist-worthy
- visually publishable

If a result feels generic, improve it before considering it done.
## Shortcuts del usuario

Estos son comandos cortos que el usuario escribe. Ejecutarlos sin pedir confirmación:

| Comando   | Acción                                                                 |
|-----------|------------------------------------------------------------------------|
| `out`     | `npm run build` — compila y verifica que el export estático salga limpio |
| `dev`     | `npm run dev` — inicia servidor de desarrollo                          |
| `lint`    | `npm run lint` — corre ESLint                                          |
| `git`     | `npm run build`, commitear lo pendiente y `git push origin main`       |
| `vercel`  | Deploy a producción en Vercel                                          |
| `deploy`  | `git` + `vercel`: buildear, pushear y publicar                         |
| `review`  | Analizar el código reciente y proponer mejoras quirúrgicas concretas   |
| `audit`   | Análisis completo del proyecto: performance, SEO, código, UX, deuda   |
| `status`  | Resumen del estado actual del proyecto: secciones, pendientes, issues  |

Después de cada `out` exitoso: dar 2-3 sugerencias proactivas de mejora sobre lo que se trabajó en la sesión.

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build static export to /out/
npm run start    # Serve production build
npm run lint     # Run ESLint
```

There are no tests configured in this project.

## Deploy

El sitio vive en **Git + Vercel**. No se sube nada a mano.

- **Repo**: `https://github.com/hivrido/web.git` (`origin`), rama de producción `main`.
- **Flujo normal**: `npm run build` para verificar → commit → `git push origin main`. Vercel toma el push y publica.
- **Deploy manual**: `npx vercel --prod` desde la raíz.

Antes de commitear, siempre correr el build: el export estático falla en cosas
que `dev` no muestra, y un push roto es un deploy roto.

Los commits van en español, en imperativo y con prefijo (`feat:`, `fix:`,
`chore:`), describiendo el efecto para el usuario y no el archivo tocado.

`/out/` es artefacto de build, no un método de deploy: no se commitea ni se
zipea para subir a un servidor.

## Architecture

**hivrido.com** is a single-page portfolio site for a creative agency. It uses the Next.js App Router with `output: "export"` (fully static, no server runtime). The built site lands in `/out/`.

### Key decisions

- **Static export**: No server-side rendering, no API routes, no dynamic segments. All pages are pre-rendered at build time. `images.unoptimized: true` is required because Next.js image optimization needs a server.
- **Single page**: `app/page.tsx` mounts all sections sequentially. Navigation uses hash anchors (`#sec1`–`#sec6`). There is no routing beyond the home page.
- **Client-heavy**: Animations (GSAP + ScrollTrigger), smooth scroll (Lenis), custom cursor, and the loader all live in client components. `ClientShell` (`app/components/layout/ClientShell.tsx`) is the root `"use client"` wrapper that owns this state.
- **Tailwind v4**: Uses `@tailwindcss/postcss` v4. There is no `tailwind.config.*` — theme customizations live as CSS variables in `app/globals.css` (colors, fonts, borders). Use CSS variables, not Tailwind config, when adding design tokens.

### Component layers

```
app/layout.tsx            — HTML shell, fonts (Orbitron + Rubik), metadata
  └─ ClientShell          — client wrapper: loader, cursor, Lenis smooth scroll
       ├─ layout/         — Header, Footer, ScrollNav, FixedColumn
       ├─ sections/       — Hero, About, Services, Portfolio, Artists, Clients
       └─ ui/             — Cursor, GlitchText, ScrollReveal, CountUp, MagneticBtn
```

### Design tokens (globals.css)

- Background: `--bg: #0a0a0a`
- Text: `--text: #f0f0f0`
- Accent: violet `#7C3AED` / `#A78BFA`
