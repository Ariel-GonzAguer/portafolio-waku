// estilos
import '../styles.css';
// tipos
import type { ReactNode } from 'react';
// componentes
import { Footer } from '../components/footer';

// analytics
import { Analytics } from '@vercel/analytics/react';

// layout específico para la página de inicio (sin header)
type HomeLayoutProps = { children: ReactNode };

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      {/* Metadata global para SEO y social sharing */}
      <html lang="es" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/imagenes/soloGato.png" />
      <meta name="description" content="GatoRojoLab — Diseño UX, Desarrollo JAMstack, Accesibilidad e Investigación." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://portafolio-waku.vercel.app/" />
      <title> GatoRojoLab </title>

      {/* Open Graph / Twitter */}
      <meta property="og:site_name" content="GatoRojoLab" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="GatoRojoLab — Desarrollo web y UX centrado en la persona" />
      <meta property="og:description" content="GatoRojoLab — Diseño UX, desarrollo JAMstack, accesibilidad y investigación." />
      <meta property="og:image" content="/imagenes/soloGato.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#0f172a" />

      {/* JSON-LD básico de persona/organización (archivo estático para evitar inline scripts) */}
      <script type="application/ld+json" src="/structured-data.json"></script>

      <section className="flex flex-col min-h-screen">
        {/* Enlace para accesibilidad: saltar al contenido */}
        <a href="#main" className="sr-only focus:not-sr-only px-4 py-2">
          Saltar al contenido
        </a>
        <Analytics />
        <main id="main" className="flex-1 bg-gris-heavy text-indigo-50">{children}</main>
        <Footer />
      </section>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
