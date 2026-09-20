import type { MetadataRoute } from "next";
import { ARTISTAS } from "./lib/artistas";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hivrido.com";

  return [
    {
      /* La raíz es el anillo institucional. */
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      /* Hivrido PLAY: cambia con cada estreno. */
      url: `${baseUrl}/play`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      /* Convocatoria con fecha: mientras esté abierta es de lo más buscado
         del sitio, y después de la jornada baja sola de prioridad. */
      url: `${baseUrl}/casting`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/estudio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diseno-web`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/colmena-agentes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/branding`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cine-video`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publicidad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/equipo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    /* Roster y una entrada por artista. Las fichas van altas a propósito: son
       la URL que el artista pega en su bio y la que tiene que ganar cuando
       alguien busca su nombre, que hoy no devuelve nada propio. */
    {
      url: `${baseUrl}/artistas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...ARTISTAS.map((a) => ({
      url: `${baseUrl}/artistas/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/orbital`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/okupas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
