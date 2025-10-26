// util para config para SSR
import { getConfig as staticRender } from '../utils/staticRender';
// imagenes
import gatoRojo from '/iconos/gatoRojoLab-mini.png';

export default async function HomePage() {
  return (
    <section className='flex flex-col items-center justify-center min-h-screen bg-blanco'>
      <h1 className="text-6xl font-bold font-lexend-mega pt-6">
        G<span className='text-gris-claro'>A</span>T<span className='text-gris-claro'>O</span> R<span className='text-gris-claro'>O</span>J<span className='text-gris-claro'>O</span> L<span className='text-gris-claro'>A</span>B
      </h1>
      <img
        src={gatoRojo}
        alt="Gato Rojo Lab"
        width={300}
        height={300}
        className="mt-6"
      />
      <p className='text-2xl pb-4 pt-2'>
        Soluciones centradas en la Persona Usuaria.
      </p>
      <p>
         Accesibilidad, minimalismo y creatividad.
      </p>
    </section>
  );
}

export const getConfig = staticRender({
  title: "Home Page",
  description: "Welcome to our homepage",
  keywords: "home, welcome",
  imageUrl: "/home.jpg"
});