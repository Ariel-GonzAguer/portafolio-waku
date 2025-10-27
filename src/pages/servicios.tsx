import { getConfig as staticRender } from '../utils/staticRender';
// componentes
import Header from '../components/header';
export default function ServiciosPage() {
  // Establecer el título y meta tags específicos de la página de servicios

  return (
    <div>
      <Header />
      <h1 className="text-4xl font-bold tracking-tight">Nuestros Servicios</h1>
      <p className="mt-4">Ofrecemos una variedad de servicios para ayudarte a construir tu presencia en línea.</p>
    </div>
  );
}

export const getConfig = staticRender({
  title: "Servicios",
  description: "Descubre nuestros servicios",
  keywords: "servicios, web, desarrollo",
  imageUrl: "/servicios.jpg"
});