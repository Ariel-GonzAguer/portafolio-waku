// util para config para SSR
import { getConfig as staticRender } from '../utils/staticRender';
// imagenes
import gatoRojo from '/iconos/gatoRojoLab-mini.png';
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
      <p className="text-3xl pb-4 pt-2">Soluciones centradas en la Persona Usuaria</p>
      <p className="text-lg">Accesibilidad, minimalismo y creatividad</p>
      <div className="flex justify-around items-center gap-6 mt-10 mb-6">
        <TransitionLink
          to="/proyectos"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block"
        >
          Ver Proyectos
        </TransitionLink>
        <TransitionLink
          to="/contacto"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block"
        >
          Contactar
        </TransitionLink>
        <TransitionLink
          to="/servicios"
          className="mt-6 bg-doradoSK text-black rounded-md px-4 py-2 hover:bg-gris-claro inline-block"
        >
          Ver Servicios
        </TransitionLink>
      </div>
      <p>
        Desarrollo <span className="text-gatorojo">JAM Stack</span> tipado, testeado, limpio, con
        backend serverless
      </p>
    </section>
  );
}

export const getConfig = staticRender({
  title: 'Home Page',
  description: 'Welcome to our homepage',
  keywords: 'home, welcome',
  imageUrl: '/home.jpg',
});
