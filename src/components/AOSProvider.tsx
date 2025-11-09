// src/components/AOSProvider.tsx
'use client';

import { useEffect } from 'react';
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
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  return null;
}