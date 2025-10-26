// estilos
import '../styles.css';
// tipos
import type { ReactNode } from 'react';
import React from 'react';
// componentes
import { Header } from '../components/header';
import { Footer } from '../components/footer';
// analytics
import { Analytics } from '@vercel/analytics/react';
// hooks 
import { useEffect } from 'react';

// componente para manejar el head inicial (solo para configuración base)
function BaseHead() {
  // Este componente se ejecuta solo en el cliente
  if (typeof window === 'undefined') return null;

  useEffect(() => {
    // Configuración inicial del head (solo si no está ya configurado)
    if (!document.title) {
      document.title = 'Gato Rojo Lab · Desarrollo web minimalista y práctico';
    }

    // Modificar el lang del html
    document.documentElement.lang = 'es';
    document.documentElement.setAttribute('translate', 'yes');

    // Función helper para agregar meta tags si no existen
    const addMetaIfNotExists = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      const existing = document.querySelector(selector);

      if (!existing) {
        const meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        else meta.setAttribute('name', name);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Meta tags básicos
    addMetaIfNotExists('viewport', 'width=device-width, initial-scale=1.0');
    addMetaIfNotExists('view-transition', 'same-origin');
    addMetaIfNotExists('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    addMetaIfNotExists('keywords', 'desarrollo web, minimalista, frontend, JAMStack, costa rica, gato, rojo, desarrollo, web, accesible, práctico, landing page, tienda en línea, blog, proyectos web, veganismo, minimalismo, diseño web, desarrollo web accesible, desarrollo web rápido, desarrollo web moderno, desarrollo web react, desarrollo web astro');
    addMetaIfNotExists('language', 'es');
    addMetaIfNotExists('description', 'Gato Rojo Lab: Desarrollo web minimalista y práctico.');

    // Open Graph
    addMetaIfNotExists('', 'Gato Rojo Lab · Desarrollo web minimalista y práctico', 'og:title');
    addMetaIfNotExists('', 'Gato Rojo Lab: Desarrollo web minimalista y práctico.', 'og:description');
    addMetaIfNotExists('', '/iconos/gatoRojoLab-mini.jpg', 'og:image');
    addMetaIfNotExists('', 'https://gatorojolab.com', 'og:url');
    addMetaIfNotExists('', 'website', 'og:type');
    addMetaIfNotExists('', 'es_ES', 'og:locale');
    addMetaIfNotExists('', 'Gato Rojo Lab', 'og:site_name');

    // Favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (!existingFavicon) {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = '/iconos/gatoRojoLab-mini.png';
      document.head.appendChild(favicon);
    }

    // Canonical y hreflang
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (!existingCanonical) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = 'https://gatorojolab.com';
      document.head.appendChild(canonical);
    }

    const existingHreflang = document.querySelector('link[hreflang="es"]');
    if (!existingHreflang) {
      const hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = 'es';
      hreflang.href = 'https://gatorojolab.com';
      document.head.appendChild(hreflang);

      const hreflangDefault = document.createElement('link');
      hreflangDefault.rel = 'alternate';
      hreflangDefault.hreflang = 'x-default';
      hreflangDefault.href = 'https://gatorojolab.com';
      document.head.appendChild(hreflangDefault);
    }
  }, []);

  return null;
}

// props del layout raíz
type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <BaseHead />
      <Analytics />
      <Header />
      <main className="flex-1 text-center">{children}</main>
      <Footer />
    </>
  );
}


export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
