'use client';
//hooks
import { useEffect, useState } from 'react';
//componentes
import { TransitionLink } from './TransitionLink';

/**
 * Componente Header que se muestra solo si no estamos en la página de inicio.
 *
 * @returns {JSX.Element | null} El header de navegación o null si estamos en home.
 */
export default function Header() {
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsHome(window.location.pathname === '/');
    };

    // Monkey patch pushState para detectar cambios de navegación
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('routechange'));
    };

    // Escuchar cambios de ruta
    window.addEventListener('routechange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Set initial
    handleRouteChange();

    return () => {
      window.removeEventListener('routechange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
    };
  }, []);

  if (isHome) return null;

  return (
    <header className="w-full">
      <nav>
        <ul className="flex justify-around items-center font-lexend-mega bg-gris-medio text-gray-50">
          <li>
            <TransitionLink to="/">INICIO</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/servicios">SERVICIOS</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/proyectos">PROYECTOS</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/contacto">CONTACTO</TransitionLink>
          </li>
          <li>
            <TransitionLink to="/about">ACERCA DE</TransitionLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
