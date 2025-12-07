/* eslint-disable react-refresh/only-export-components */
// componentes
import Proyectos from '../components/Proyectos';
import Servicios from '../components/Servicios';
import MarqueeTecnologias from '../components/MarqueeReact/MarqueeTecnologias';
import Contacto from '../components/Contacto';
import Hero from '../components/Hero';
import ChatbotOpenAI from '../components/ChatbotOpenAI';

export default async function HomePage() {
  return (
    <section title="main" className="flex flex-col items-center justify-center pt-10">
      <Hero />
      <a href="#formulario-contacto" title='Ir al formulario de contacto' className='mt-10 text-2xl px-2 py-1 border border-white rounded text-amber-300 font-bold hover:bg-white hover:border-amber-300 hover:text-black transition-all duration-300 ease-in-out focus:ring-6 focus:ring-doradoSK'>Contacto</a>
      <Proyectos />
      <Servicios />
      <MarqueeTecnologias />
      <Contacto />
      <ChatbotOpenAI />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
