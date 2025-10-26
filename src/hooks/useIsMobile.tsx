import { useState, useEffect } from 'react';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  function verificarDispositivoMovil() {
    if (typeof window === 'undefined') return;

    // Verificar por User-Agent
    const esMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    // Verificar por tamaño de pantalla
    const esMobilePorTamano = window.innerWidth < 768;

    // Combinar todas las verificaciones
    const esMovil = esMobileUserAgent || esMobilePorTamano;
    setIsMobile(esMovil);
  }

  useEffect(() => {
    // Marcar como cliente para evitar problemas de hidratación
    setIsClient(true);

    // Verificar inmediatamente
    verificarDispositivoMovil();

    // Agregar listener con throttling para mejor performance
    let timeoutId: ReturnType<typeof setTimeout>;
    // Usar un timeout para evitar múltiples llamadas rápidas
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(verificarDispositivoMovil, 150);
    }

    window.addEventListener('resize', handleResize);

    // Limpiar el listener al desmontar
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Durante SSR o antes de la hidratación, devolver false
  return isClient ? isMobile : false;
}
