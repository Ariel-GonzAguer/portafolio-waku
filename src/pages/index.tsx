// util para config para SSR
// imagenes
import gatoRojo from '/imagenes/soloGato.png';
// enrutado
import { TransitionLink } from '../components/TransitionLink';

export default async function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center pt-10">
      <h1 className="text-8xl font-bold font-lexend-mega pt-6">
        G<span className="text-gris-claro">A</span>T<span className="text-gris-claro">O</span> R
        <span className="text-gris-claro">O</span>J<span className="text-gris-claro">O</span> L
        <span className="text-gris-claro">A</span>B
      </h1>
      <img src={gatoRojo} alt="Gato Rojo Lab" width={300} height={300} className="mt-6" />
      <p className="text-3xl mb-8 mt-4">Soluciones centradas en la Persona Usuaria</p>
      <p className="text-lg">Accesibilidad, minimalismo y creatividad</p>
      <div className="flex justify-around items-center gap-6 mt-10 mb-20">
        <TransitionLink
          to="/proyectos"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block focus:ring-6 focus:ring-doradoSK"
        >
          Ver Proyectos
        </TransitionLink>
        <TransitionLink
          to="/contacto"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block focus:ring-6 focus:ring-doradoSK"
        >
          Contactar
        </TransitionLink>
        <TransitionLink
          to="/servicios"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block focus:ring-6 focus:ring-doradoSK"
        >
          Ver Servicios
        </TransitionLink>
      </div>
      <p className="text-center text-xl">
        Desarrollo <span className="text-gatorojo">JAM Stack</span> tipado, testeado, limpio, con
        backend serverless
      </p>
    </section>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = () => {
  return {
    render: 'static',
  } as const;
};
