import { getConfig as staticRender } from '../utils/staticRender';
// componentes

export default async function AboutPage() {


  // Establecer el título y meta tags de la página


  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
    </div>
  );
}

export const getConfig = staticRender({
  title: "About Us",
  description: "Learn more about us",
  keywords: "about, us",
  imageUrl: "/about.jpg"
});