'use client';

// hooks
import { useEffect } from 'react';
// librería AOS → animation on scroll
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Inicializa AOS y refresca las animaciones cuando cambia el DOM.
 *
 * @example
 * <AOSProvider />
 */
export function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 50,
      disable: false,
      startEvent: 'DOMContentLoaded',
      disableMutationObserver: false,
      throttleDelay: 99,
      // Configuraciones adicionales para prevenir overflow
      anchorPlacement: 'top-bottom',
      mirror: false, // Deshabilitar animaciones espejo
    });

    // Función para refrescar AOS cuando cambie el contenido
    function refreshAOS() {
      AOS.refresh();
    };

    // Escuchar cambios en el DOM
    window.addEventListener('resize', refreshAOS);

    return () => {
      window.removeEventListener('resize', refreshAOS);
    };
  }, []);

  return null;
}
