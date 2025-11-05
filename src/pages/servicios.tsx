// componentes
import Header from '../components/header';
export default function ServiciosPage() {
  // Establecer el título y meta tags específicos de la página de servicios

  return (
    <div>
      <Header />
      <h1 className="text-4xl font-bold tracking-tight">Nuestros Servicios</h1>
      <p className="mt-4">
        Ofrecemos una variedad de servicios para ayudarte a construir tu presencia en línea.
      </p>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = () => {
  return {
    render: 'static',
  } as const;
};
