/**
 * Hook personalizado para manejar View Transitions API en navegación.
 * Proporciona funciones para ejecutar transiciones suaves entre páginas con duración de 600-700ms.
 *
 * @example
 * const { navigateWithTransition } = useViewTransitions();
 * navigateWithTransition('/tienda');
 */
import { useCallback } from 'react';

export interface ViewTransitionsHook {
  navigateWithTransition: (path: string) => void;
  isTransitionSupported: boolean;
}

/**
 * Hook que encapsula la lógica de View Transitions API para navegación suave.
 *
 * @returns {ViewTransitionsHook} Objeto con métodos para manejar transiciones.
 * @example
 * const { navigateWithTransition, isTransitionSupported } = useViewTransitions();
 *
 * if (isTransitionSupported) {
 *   navigateWithTransition('/nueva-pagina');
 * } else {
 *   // Fallback para navegadores sin soporte
 *   window.location.href = '/nueva-pagina';
 * }
 */
export function useViewTransitions(): ViewTransitionsHook {
  const isTransitionSupported = 'startViewTransition' in document;

  const navigateWithTransition = useCallback(
    (path: string) => {
      if (!isTransitionSupported) {
        // Fallback para navegadores sin soporte
        window.history.pushState(null, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }

      // Usar View Transitions API
      const documentWithTransitions = document as Document & {
        startViewTransition?: (callback: () => void) => Promise<void>;
      };

      if (documentWithTransitions.startViewTransition) {
        documentWithTransitions.startViewTransition(() => {
          window.history.pushState(null, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
        });
      } else {
        // Fallback si el método no está disponible
        window.history.pushState(null, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
    [isTransitionSupported],
  );

  return {
    navigateWithTransition,
    isTransitionSupported,
  };
}
