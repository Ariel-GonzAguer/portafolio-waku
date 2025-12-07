'use client';

// hooks
import useIsMobile from '../hooks/useIsMobile';
export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <section aria-labelledby='Sección-de-Encabezado' className="flex flex-col items-center">
      <h1 id="Sección-de-Encabezado" className={`text-8xl font-bold font-lexend-mega pt-6`}>
        G<span className="text-gris-claro">A</span>T<span className="text-gris-claro">O</span>{' '}
        {isMobile ? <br /> : null}R<span className="text-gris-claro">O</span>J
        <span className="text-gris-claro">O</span> {isMobile ? <br /> : null}L
        <span className="text-gris-claro">A</span>B
      </h1>

      <img
        src="/imagenes/soloGato.webp"
        alt='Logo de Gato Rojo Lab. Muestra un gato de color rojo parado en sus cuatro patas.'
        width={300}
        height={300}
        className="my-10"
      />
      <p className="text-4xl py-8 text-center">Soluciones centradas en la Persona Usuaria</p>
      <p className="text-2xl text-center">Accesibilidad, minimalismo y creatividad</p>

      <p className="text-center mt-10 text-xl">
        Desarrollo <span className="text-gatorojo">JAM Stack</span> tipado, testeado, limpio, con
        backend serverless
      </p>
    </section>
  );
}
