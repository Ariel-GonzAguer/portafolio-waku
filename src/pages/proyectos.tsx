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
    <div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto) => (
          <div key={proyecto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={proyecto.img} alt={proyecto.nombre} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{proyecto.nombre}</h3>
              <p className="text-gray-600 mb-4">{proyecto.descripcion}</p>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Tecnologías:</h4>
                <div className="flex flex-wrap gap-2">
                  {proyecto.tecnologias.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={proyecto.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Ver Proyecto
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = () => {
  return {
    render: 'static',
  } as const;
};
