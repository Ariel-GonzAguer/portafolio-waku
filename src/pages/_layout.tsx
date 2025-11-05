// estilos
import '../styles.css';
// tipos
import type { ReactNode } from 'react';
// componentes
import { Footer } from '../components/footer';
import Header from '../components/header';

// analytics
import { Analytics } from '@vercel/analytics/react';

// layout específico para la página de inicio (sin header)
type HomeLayoutProps = { children: ReactNode };

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <Analytics />
      <main className="flex-1 bg-gris-heavy text-indigo-50">{children}</main>
      <Footer />
    </section>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
