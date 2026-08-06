import dynamic from "next/dynamic";
import ClientShell from "./components/layout/ClientShell";
import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";

// Below-fold sections — separate JS chunks, parsed only when needed
const Portfolio = dynamic(() => import("./components/sections/Portfolio"));
const About = dynamic(() => import("./components/sections/About"));
const Services = dynamic(() => import("./components/sections/Services"));
const AIHiveSection = dynamic(() => import("./components/sections/AIHiveSection"));
const Artists = dynamic(() => import("./components/sections/Artists"));
const Clients = dynamic(() => import("./components/sections/Clients"));
const OkupasFeature = dynamic(() => import("./components/sections/OkupasFeature"));

// Layout chrome — separate chunks
const FixedColumn = dynamic(() => import("./components/layout/FixedColumn"));
const ScrollNav = dynamic(() => import("./components/layout/ScrollNav"));
const Footer = dynamic(() => import("./components/layout/Footer"));

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
        <OkupasFeature />
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
