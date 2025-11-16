'use client';

// data
import { servicios } from '../data/servicios';
// componentes
import { AOSProvider } from './AOSProvider';
// hooks
import useIsMobile from '../hooks/useIsMobile';

export default function Servicios() {
  const isMobile = useIsMobile();

  return (
    <section className="mb-20" title='servicios'>
      <AOSProvider />
      <h2 className="text-center text-4xl font-bold mb-10">Servicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {servicios.map(servicio => (
          <article
            data-aos={`zoom-in-${Number(servicio.id) % 2 === 0 ? 'right' : 'left'}`}
            data-aos-delay={`${isMobile ? 0 : Number(servicio.id) * 200}`}
            key={servicio.id}
            className={`p-4 text-center text-balance`}
          >
            <h3 className="text-2xl font-bold mb-2">{servicio.nombre}</h3>
            <p className="text-gris-claro mb-4">{servicio.descripcion}</p>
            <ul className={`flex flex-wrap gap-2 justify-center items-center`}>
              {servicio.tags.map((tag, index) => (
                <li key={index} className="bg-doradoSK text-black px-2 py-1 rounded">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
