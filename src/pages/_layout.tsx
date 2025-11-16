/* eslint-disable react-refresh/only-export-components */
// estilos
import '../styles.css';
// tipos
import type { ReactNode } from 'react';
// analytics
import { Analytics } from '@vercel/analytics/react';
// componentes
import { AOSProvider } from '../components/AOSProvider';

// layout específico para la página de inicio (sin header)
type HomeLayoutProps = { children: ReactNode };

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      {/* Metadata global para SEO y social sharing */}
      <html lang="es" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/imagenes/soloGato.png" title="favicon Gato Rojo Lab" />
      <meta
        name="description"
        content="GatoRojoLab — Diseño UX, Desarrollo JAMstack, Accesibilidad e Investigación."
      />
      <meta
        name="keywords"
        content="Desarrollo web, JAMstack, React, TypeScript, UX Research, Diseño UX, Accesibilidad web, WCAG, Frontend, Waku, Astro, Vite, Costa Rica, Desarrollo accesible, Investigación de usuarios, gatos, cats"
      />
      <meta name="author" content="Gato Rojo Lab" />
      <meta name="publisher" content="Gato Rojo Lab" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://gatorojolab.com/" />
      <title> GatoRojoLab </title>

      {/* Open Graph / Twitter */}
      <meta property="og:site_name" content="GatoRojoLab" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="GatoRojoLab — Desarrollo web y UX centrado en la persona"
      />
      <meta
        property="og:description"
        content="GatoRojoLab — Diseño UX, desarrollo JAMstack, accesibilidad y investigación."
      />
      <meta property="og:image" content="/imagenes/soloGato.png" title="favicon Gato Rojo Lab" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="publisher" content="GatoRojoLab" />
      <meta name="theme-color" content="#0f172a" />

      {/* JSON-LD básico de persona/organización (archivo estático para evitar inline scripts) */}
      <script type="application/ld+json" src="/structured-data.json"></script>

      <section className="flex flex-col min-h-screen">
        {/* Enlace para accesibilidad: saltar al contenido */}
        <a href="#main" className="sr-only focus:not-sr-only px-4 py-2" title="Saltar al contenido">
          Saltar al contenido
        </a>
        <Analytics />
        <AOSProvider />
        <main id="main" className="flex-1 bg-gris-heavy text-indigo-50">
          {children}
        </main>
      </section>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
