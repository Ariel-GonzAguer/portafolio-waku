/* eslint-disable react-refresh/only-export-components */
// componentes
import Proyectos from '../components/Proyectos';
import Servicios from '../components/Servicios';
import MarqueeTecnologias from '../components/MarqueeReact/MarqueeTecnologias';
import Contacto from '../components/Contacto';
import Hero from '../components/Hero';

export default async function HomePage() {
  return (
    <section title="main" className="flex flex-col items-center justify-center pt-10">
      <section title="hero" className="w-full max-w-6xl px-4">
        <Hero />
      </section>

      <section title="proyectos" className="w-full max-w-6xl mt-22 px-4">
        <Proyectos />
      </section>
      <section title="servicios" className="w-full max-w-6xl mt-20 ">
      <Servicios />
      </section>
      <section title="Marquee de tecnologías" className="w-full max-w-6xl mt-20 px-4 mb-4">
        <MarqueeTecnologias />
      </section>
      <section title="Contacto" className="w-full max-w-6xl mt-6 px-4 mb-20">
        <Contacto />
      </section>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
