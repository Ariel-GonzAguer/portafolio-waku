/**
 * Página principal enfocada en presentar el mensaje clave del estudio.
 *
 * @example
 * ```tsx
 * export default function App() {
 *   return <HomePage />;
 * }
 * ```
 */
export default async function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center pt-10">
      <h1 className="text-8xl font-bold font-lexend-mega pt-6">
        G<span className="text-gris-claro">A</span>T<span className="text-gris-claro">O</span>
        R<span className="text-gris-claro">O</span>J<span className="text-gris-claro">O</span>
        L<span className="text-gris-claro">A</span>B
      </h1>

      <img src="/iconos/gatoRojoLab-mini.png" alt="Gato Rojo Lab" width={300} height={300} className="mt-6" />
      <p className="text-4xl py-8">Soluciones centradas en la Persona Usuaria</p>
      <p className="text-2xl">Accesibilidad, minimalismo y creatividad</p>

      <p className='text-center mt-10 text-xl'>
        Desarrollo <span className="text-gatorojo">JAM Stack</span> tipado, testeado, limpio, con
        backend serverless
      </p>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
