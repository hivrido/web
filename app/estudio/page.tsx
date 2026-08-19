import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ClientShell from "../components/layout/ClientShell";
import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";

/**
 * El recorrido largo del estudio: hero, proyectos, manifiesto, servicios,
 * equipo y clientes en una sola página.
 *
 * Era la home hasta que el cosmos ocupó la raíz. Sigue publicada porque
 * concentra todo el relato en un scroll —sirve para quien quiere ver el
 * conjunto sin recorrer el anillo—, pero no está en el menú: la navegación
 * ahora la ordenan las fichas del cosmos, cada una a su landing.
 */

export const metadata: Metadata = {
  title: "El estudio | Hivrido",
  description:
    "Producción audiovisual, branding, desarrollo y agentes IA. El recorrido completo del estudio: proyectos, servicios, equipo y clientes.",
  alternates: { canonical: "/estudio" },
};

// Below-fold sections — separate JS chunks, parsed only when needed
const Portfolio = dynamic(() => import("../components/sections/Portfolio"));
const About = dynamic(() => import("../components/sections/About"));
const Services = dynamic(() => import("../components/sections/Services"));
const AIHiveSection = dynamic(() => import("../components/sections/AIHiveSection"));
const Artists = dynamic(() => import("../components/sections/Artists"));
const Clients = dynamic(() => import("../components/sections/Clients"));

// Layout chrome — separate chunks
const FixedColumn = dynamic(() => import("../components/layout/FixedColumn"));
const ScrollNav = dynamic(() => import("../components/layout/ScrollNav"));
const Footer = dynamic(() => import("../components/layout/Footer"));

export default function Home() {
  return (
    <ClientShell>
      <Header />
      <FixedColumn />
      <ScrollNav />

      {/* Main content */}
      <main className="page-wrapper">
        <Hero />
        <Portfolio />
        {/* La ficha de Okupas duerme: el componente sigue en
            components/sections/OkupasFeature.tsx y vuelve importándolo acá y
            reponiendo su entrada `sec-okupas` en ScrollNav. */}
        <About />
        <Services />
        <AIHiveSection />
        <Artists />
        <Clients />
        <Footer />
      </main>
    </ClientShell>
  );
}
