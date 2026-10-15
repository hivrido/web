import Movimiento from "./_components/Movimiento";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Expediente from "./_components/expediente/Expediente";
import { Franja, Gestion, Pie, Propuestas, QuienEs, Sumate } from "./_components/Secciones";

export default function AlejandraDelfinoPage() {
  return (
    <Movimiento>
      <Header />
      <main id="inicio">
        <Hero />
        <Expediente />
        <Franja />
        <QuienEs />
        <Gestion />
        <Franja />
        <Propuestas />
        <Sumate />
      </main>
      <Pie />
    </Movimiento>
  );
}
