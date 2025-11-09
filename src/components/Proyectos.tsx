'use client';

// componentes
import { AOSProvider } from "./AOSProvider"
// data
import { proyectos } from '../data/proyectos';

export default function Proyectos() {

  return (
    <section className="mb-20">
      <AOSProvider />
      <h2 className="text-center text-xl">Algunos de los proyectos realizados este año</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {proyectos.map((proyecto) => (
          <article
            data-aos={`fade-${Number(proyecto.id) % 2 === 0 ? 'right' : 'left'}`}
            data-aos-delay={Number(proyecto.id) * 200}
            key={proyecto.id}
            className="p-4"
            >
            <img
              src={Array.isArray(proyecto.img) ? proyecto.img[0] : proyecto.img}
              alt={`screenshot de que muestra una pantalla de ${proyecto.nombre}`}
              className="w-full h-90 object-contain"
            />
            <div className="p-6"></div>
            <h3 className="text-2xl font-bold mb-2">{proyecto.nombre}</h3>
            <p className="text-gris-claro mb-4">{proyecto.descripcion}</p>
            <a
              href={proyecto.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-4 bg-doradoSK text-black px-4 py-2 rounded hover:bg-gatorojo transition"
            >
              Ver Proyecto
            </a>
          </article>
        ))}
      </div>

    </section>
  )
}
