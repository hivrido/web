import Movimiento from "./_components/Movimiento";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Expediente from "./_components/expediente/Expediente";
import Manifiesto from "./_components/Manifiesto";
import { Contacto, Franja, Gestion, Pie, Propuestas, QuienEs } from "./_components/Secciones";

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
        <Manifiesto />
        <Franja />
        <Propuestas />
        <Contacto />
      </main>
      <Pie />
    </Movimiento>
  );
}
