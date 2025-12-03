// data
import { proyectos } from '../data/proyectos';

/**
 * Página que muestra una lista de proyectos con cards interactivas.
 *
 * @returns {JSX.Element} El componente de la página de proyectos.
 *
 * @example
 * // Uso en el enrutador de Waku
 * <ProyectosPage />
 */
export default function ProyectosPage() {
  // Establecer el título y meta tags específicos de la página de proyectos

  return (
    <section className="p-6">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(proyecto => (
          <div key={proyecto.id} className="bg-gris-medio rounded-lg shadow-md py-4">
            <img 
              src={Array.isArray(proyecto.img) ? proyecto.img[0] : proyecto.img} 
              alt={proyecto.nombre} 
              className="w-full h-90 object-contain" 
            />
            <div className="p-2">
              <h3 className="text-xl text-gris-heavy font-semibold mb-2">{proyecto.nombre}</h3>
              <p className="text-gris-claro-600 mb-4 text-lg">{proyecto.descripcion}</p>
              <div className="mb-4">
                <h4 className="text-md font-medium text-white mb-2">Tecnologías:</h4>
                <div className="flex flex-wrap gap-6">
                  {proyecto.tecnologias.map((tech, index) => (
                    <span key={index} className="bg-doradoSK text-black px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end-safe">
                <a
                  href={proyecto.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" bg-gris-heavy text-white px-4 py-2 rounded focus:ring-6 focus:ring-doradoSK"
                >
                  Ver Proyecto
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = () => {
  return {
    render: 'static',
  } as const;
};
