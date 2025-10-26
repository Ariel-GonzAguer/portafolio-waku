import { getConfig as staticRender } from '../utils/staticRender';

export default function ContactoPage() {
  // Establecer el título y meta tags específicos de la página de contacto

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Contacto</h1>
      <p className="mt-4">Ponte en contacto con nosotros para tus proyectos web.</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Información de contacto</h2>
        <p className="mt-2">Email: info@gatorojolab.com</p>
        <p>Ubicación: Costa Rica</p>
      </div>
    </div>
  );
}

export const getConfig = staticRender({
  title: "Contacto",
  description: "Ponte en contacto con nosotros",
  keywords: "contacto, info",
  imageUrl: "/contacto.jpg"
});