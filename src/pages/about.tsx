import { getConfig as staticRender } from '../utils/staticRender';
// componentes
import Header from '../components/header';  

export default async function AboutPage() {


  // Establecer el título y meta tags de la página


  return (
    <div>
      <Header />
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