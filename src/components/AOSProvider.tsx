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
    // Pequeño delay para asegurar que el DOM esté completamente cargado
    const initAOS = () => {
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
        // Configuraciones para producción
        useClassNames: true,
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
      });
    };

    // Inicializar AOS después de un pequeño delay
    const timer = setTimeout(initAOS, 100);

    // Función para refrescar AOS cuando cambie el contenido
    function refreshAOS() {
      AOS.refresh();
    };

    // Escuchar cambios en el DOM
    window.addEventListener('resize', refreshAOS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', refreshAOS);
    };
  }, []);

  return null;
}
