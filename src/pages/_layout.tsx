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
      <Analytics />
      <main className=" bg-gris-heavy text-indigo-50">{children}</main>
      <Footer />
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};