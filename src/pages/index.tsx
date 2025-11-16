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
