# Guía práctica: Animaciones con AOS en el portafolio Waku

Esta guía explica cómo aprovechar **Animate On Scroll (AOS)** dentro del portafolio construido con **React + Waku + Tailwind CSS**. Incluye la instalación, configuración y patrones recomendados para mantener el SSR y el rendimiento.

---

## 1. Instalación

```bash
pnpm add aos

pnpm add -D @types/aos

```

> Ya se añadió en `package.json`, pero mantén el comando como referencia si alguien reconstruye el entorno desde cero.

---

## 2. Configuración básica

### 2.1. Crea un proveedor de AOS

Genera `src/components/AOSProvider.tsx` con la inicialización encapsulada. El componente debe ser de cliente porque manipula el DOM.

```tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Inicializa AOS una sola vez y refresca las animaciones cuando el DOM cambia.
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
```

### 2.2. Inyecta el proveedor en el layout raíz

Abre `src/pages/_layout.tsx` y coloca `<AOSProvider />` dentro del layout para que todas las páginas hereden la inicialización.

```tsx
import { AOSProvider } from '../components/AOSProvider';

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <section className="flex flex-col min-h-screen">
      <Analytics />
      <AOSProvider />
      <main className="flex-1 bg-gris-heavy text-indigo-50">{children}</main>
      <Footer />
    </section>
  );
}
```

> Asegúrate de mantener el orden: primero analíticas, luego AOS, después el contenido.

---

## 3. Usar animaciones en los componentes

Añade atributos `data-aos` en los elementos que deben animarse cuando entren en el viewport.

```tsx
<section className="flex flex-col items-center justify-center pt-10" data-aos="fade-up">
  <h1 data-aos="zoom-in" data-aos-delay="100">
    GATO ROJO LAB
  </h1>
  <img
    src="/iconos/gatoRojoLab-mini.png"
    alt="Gato Rojo Lab"
    width={300}
    height={300}
    className="mt-6"
    data-aos="fade-up"
    data-aos-delay="200"
  />
</section>
```

### Atributos útiles

| Atributo            | Descripción                                    | Ejemplo                         |
| ------------------- | ---------------------------------------------- | ------------------------------- |
| `data-aos`          | Tipo de animación (`fade-up`, `zoom-in`, etc.) | `data-aos="fade-up"`            |
| `data-aos-delay`    | Retraso en milisegundos                        | `data-aos-delay="150"`          |
| `data-aos-duration` | Duración personalizada                         | `data-aos-duration="800"`       |
| `data-aos-easing`   | Función de easing                              | `data-aos-easing="ease-in-out"` |
| `data-aos-anchor`   | Elemento que desencadena la animación          | `data-aos-anchor="#hero"`       |

Consulta la [lista completa de animaciones](https://github.com/michalsnik/aos#-animations) para elegir la más adecuada.

---

## 4. Buenas prácticas en este proyecto

- **Mantén el SSR estable:** todo el código que manipula `window` vive dentro de `AOSProvider` marcado como cliente. El resto de componentes puede seguir siendo server components.
- **Usa delays escalonados** (`data-aos-delay`) para crear secuencias fluidas en secciones con múltiples elementos.
- **Evita animar elementos ocultos** con `display: none`; utiliza utilidades de Tailwind como `opacity-0` y `pointer-events-none` si necesitas ocultarlos antes de animarlos.
- **Considera el rendimiento:** no exageres con animaciones simultáneas. Selecciona los elementos clave para mantener la experiencia ligera.
- **Actualiza estilos globales** (`src/styles.css`) si necesitas personalizar las clases `.aos-init` o `.aos-animate`. Hazlo con selectores específicos para no interferir con Tailwind.

---

## 5. Depuración rápida

1. Ejecuta `pnpm dev` y abre el inspector del navegador.
2. Verifica que el CSS de `aos/dist/aos.css` se haya cargado.
3. Usa la pestaña _Elements_ para confirmar que los nodos incluyen `aos-init` y luego `aos-animate` cuando entran en la vista.
4. Si una animación no se dispara, revisa que `AOSProvider` esté montado solo una vez y que el atributo `data-aos` esté correctamente escrito.

---

## 6. Reglas de 'use client' en Waku

### 6.1. Server Components vs Client Components

En Waku, los componentes son **Server Components por defecto**. Solo necesitan `'use client'` cuando requieren funcionalidades del navegador.

### 6.2. Cuándo usar 'use client'

✅ **Necesitan 'use client':**

- Componentes que usan **hooks de React** (`useState`, `useEffect`, `useCallback`, etc.)
- Componentes que **manejan eventos del DOM** (`onClick`, `onSubmit`, `onChange`, etc.)
- Componentes que **llaman APIs del navegador** (`fetch`, `localStorage`, `navigator`, etc.)
- Componentes que **manipulan el DOM directamente** (como AOSProvider)
- Componentes que usan **librerías que requieren el cliente** (AOS, animaciones, etc.)

❌ **NO necesitan 'use client':**

- Componentes puramente presentacionales que solo renderizan JSX
- Componentes que solo usan props y renderizado estático
- Animaciones CSS puras (sin JavaScript)
- Componentes que solo calculan datos

### 6.3. Ejemplos en este proyecto

```tsx
// ❌ NO necesita 'use client' - Solo renderiza JSX estático
export default function MarqueeTecnologias() {
  return <div className="marquee">{/* ... */}</div>;
}

// ✅ NECESITA 'use client' - Usa fetch y eventos
'use client';
export default function Contacto() {
  const handleSubmit = async (event) => {
    const response = await fetch('/api/enviarCorreo', { ... });
  };
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}

// ✅ NECESITA 'use client' - Usa useEffect y manipula DOM
'use client';
export function AOSProvider() {
  useEffect(() => AOS.init(), []);
  return null;
}
```

### 6.4. Mejores prácticas

- **Mantén Server Components cuando sea posible** para mejor rendimiento SSR
- **Agrupa lógica cliente** en componentes específicos marcados como cliente
- **Documenta por qué** usas `'use client'` con comentarios JSDoc
- **Evita 'use client' innecesario** - revisa si realmente necesitas funcionalidades del navegador

---

## 7. Recursos adicionales

- [Repositorio oficial de AOS](https://github.com/michalsnik/aos)
- [Listado de animaciones disponibles](https://michalsnik.github.io/aos/)
- [Documentación de Waku](https://waku.gg/docs) para profundizar en layouts y componentes cliente

Con esta guía puedes añadir efectos sutiles que refuercen la personalidad del portafolio sin comprometer el rendimiento ni la accesibilidad. ¡Anima con criterio! 🎨✨
