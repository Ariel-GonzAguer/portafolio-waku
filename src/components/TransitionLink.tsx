'use client';

/**
 * TransitionLink - Componente que envuelve el Link de Waku con View Transitions API
 * Proporciona transiciones suaves de 600ms tipo fade entre páginas
 */

import { Link } from 'waku';
import type { ComponentProps } from 'react';
import { startTransition, type TransitionFunction } from 'react';

/**
 * Wrapper del Link de Waku que integra View Transitions API
 * para transiciones suaves entre páginas con efecto fade de 600ms
 */
export function TransitionLink(props: ComponentProps<typeof Link>) {
  // Función que envuelve la transición con View Transitions API
  const handleStartTransition = (callback: TransitionFunction) => {
    // Verificar si el navegador soporta View Transitions
    const documentWithViewTransition = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

    if (documentWithViewTransition.startViewTransition) {
      // Usar View Transitions API nativa
      documentWithViewTransition.startViewTransition(() => {
        startTransition(callback);
      });
    } else {
      // Fallback para navegadores sin soporte
      startTransition(callback);
    }
  };

  return <Link {...props} unstable_startTransition={handleStartTransition} />;
}
