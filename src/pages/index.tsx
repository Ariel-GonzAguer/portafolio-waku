// componentes
import Proyectos from "../components/Proyectos";
import Servicios from "../components/Servicios";

export default async function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center pt-10">
      <section title="Hero Section" className="flex flex-col items-center">

        <h1 className="text-8xl font-bold font-lexend-mega pt-6">
          G<span className="text-gris-claro">A</span>T<span className="text-gris-claro">O</span>
          R<span className="text-gris-claro">O</span>J<span className="text-gris-claro">O</span>
          L<span className="text-gris-claro">A</span>B
        </h1>

        <img src="/imagenes/gatoRojoLab-mini.png" alt="Gato Rojo Lab" width={300} height={300} className="mt-6" />
        <p className="text-4xl py-8">Soluciones centradas en la Persona Usuaria</p>
        <p className="text-2xl">Accesibilidad, minimalismo y creatividad</p>

        <p className='text-center mt-10 text-xl'>
          Desarrollo <span className="text-gatorojo">JAM Stack</span> tipado, testeado, limpio, con
          backend serverless
        </p>
      </section>
      <section id="proyectos" className="w-full max-w-6xl mt-20 px-4">
        <Proyectos />
      </section>
      <section id="servicios" className="w-full max-w-6xl mt-20 px-4"></section>
      <Servicios />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
