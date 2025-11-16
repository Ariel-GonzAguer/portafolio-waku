'use client';

// componentes
import { AOSProvider } from './AOSProvider';
// data
import { proyectos } from '../data/proyectos';
// hooks
import useIsMobile from '../hooks/useIsMobile';

export default function Proyectos() {
  const isMobile = useIsMobile();

  return (
    <section className="mb-20 overflow-x-hidden" title='proyectos'>
      <AOSProvider />
      <h2 className="text-center text-3xl" data-aos="zoom-in">
        Algunos de los proyectos realizados este año
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {proyectos.map(proyecto => (
          <article
            data-aos={`
              ${isMobile
                ? `zoom-in-${Number(proyecto.id) % 2 === 0 ? 'right' : 'left'}`
                : `fade-${Number(proyecto.id) % 2 === 0 ? 'right' : 'left'}`}
              `}
            data-aos-delay={`${isMobile ? 0 : Number(proyecto.id) * 200}`}
            key={proyecto.id}
            className="p-4 relative"
          >
            <img
              src={Array.isArray(proyecto.img) ? proyecto.img[0] : proyecto.img}
              alt={`screenshot que muestra una pantalla de ${proyecto.nombre}`}
              title={proyecto.nombre}
              className="w-full h-90 object-contain"
            />
            <div className="p-6"></div>
            <h3 className="text-2xl font-bold mb-2">{proyecto.nombre}</h3>
            <p className="text-gris-claro mb-4">{proyecto.descripcion}</p>
            <a
              href={proyecto.enlace}
              target="_blank"
              rel="noopener noreferrer"
              title={proyecto.nombre}
              className="bg-doradoSK text-black px-4 py-2 rounded hover:bg-gatorojo transition inline-block"
            >
              Ver Proyecto
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
