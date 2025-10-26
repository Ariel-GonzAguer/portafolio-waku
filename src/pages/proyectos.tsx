import { getConfig as staticRender } from '../utils/staticRender';
export default function ProyectosPage() {
  // Establecer el título y meta tags específicos de la página de proyectos

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Nuestros Proyectos</h1>
      <p className="mt-4">Explora algunos de nuestros proyectos más recientes.</p>
    </div>
  );
}

export const getConfig = staticRender({
  title: "Proyectos",
  description: "Descubre nuestros proyectos",
  keywords: "proyectos, web, desarrollo",
  imageUrl: "/proyectos.jpg"
});