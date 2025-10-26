import { getConfig as staticRender } from '../utils/staticRender';

export default async function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Gato Rojo Lab</h1>
    </div>
  );
}

export const getConfig = staticRender({
  title: "Home Page",
  description: "Welcome to our homepage",
  keywords: "home, welcome",
  imageUrl: "/home.jpg"
});