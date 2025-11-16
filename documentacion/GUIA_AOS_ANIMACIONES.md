# Guía de Uso de AOS (Animate On Scroll)

## Índice

1. [¿Qué es AOS?](#qué-es-aos)
2. [Instalación](#instalación)
3. [Configuración Básica](#configuración-básica)
4. [Tipos de Animaciones](#tipos-de-animaciones)
5. [Atributos y Opciones](#atributos-y-opciones)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
8. [Mejores Prácticas](#mejores-prácticas)

---

## ¿Qué es AOS?

AOS (Animate On Scroll) es una biblioteca de JavaScript que permite animar elementos cuando aparecen en el viewport mientras el usuario hace scroll. Es ligera, fácil de usar y altamente personalizable.

**Características principales:**
- Animaciones suaves y optimizadas
- Amplia variedad de efectos predefinidos
- Fácil integración con React
- Control total sobre duración, retraso y comportamiento
- Responsive y compatible con dispositivos móviles

---

## Instalación

```bash
pnpm add aos
pnpm add -D @types/aos
```

También necesitarás importar los estilos CSS de AOS:

```tsx
import 'aos/dist/aos.css';
```

---

## Configuración Básica

### Crear el componente AOSProvider

```tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Proveedor de AOS (Animate On Scroll)
 * Inicializa la biblioteca AOS para animaciones al hacer scroll
 * 
 * @example
 * ```tsx
 * export default function MiComponente() {
 *   return (
 *     <>
 *       <AOSProvider />
 *       <div data-aos="fade-up">Contenido animado</div>
 *     </>
 *   );
 * }
 * ```
 */
export function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 1000,        // Duración de la animación en ms
      once: true,            // Si la animación ocurre solo una vez
      offset: 120,           // Offset desde el trigger point (en px)
      easing: 'ease-in-out', // Tipo de easing
      delay: 0,              // Retraso antes de iniciar la animación
      disable: false,        // Deshabilitar AOS bajo ciertas condiciones
    });

    // Refrescar AOS cuando cambia el DOM
    AOS.refresh();
  }, []);

  return null;
}
```

### Usar AOSProvider en tu componente

```tsx
export default function MiComponente() {
  return (
    <section>
      <AOSProvider />
      <div data-aos="fade-up">
        Este contenido se animará al hacer scroll
      </div>
    </section>
  );
}
```

---

## Tipos de Animaciones

### Animaciones Fade (Desvanecimiento)

```tsx
<div data-aos="fade">Fade</div>
<div data-aos="fade-up">Fade hacia arriba</div>
<div data-aos="fade-down">Fade hacia abajo</div>
<div data-aos="fade-left">Fade desde la izquierda</div>
<div data-aos="fade-right">Fade desde la derecha</div>
<div data-aos="fade-up-right">Fade diagonal arriba-derecha</div>
<div data-aos="fade-up-left">Fade diagonal arriba-izquierda</div>
<div data-aos="fade-down-right">Fade diagonal abajo-derecha</div>
<div data-aos="fade-down-left">Fade diagonal abajo-izquierda</div>
```

### Animaciones Flip (Voltear)

```tsx
<div data-aos="flip-up">Flip hacia arriba</div>
<div data-aos="flip-down">Flip hacia abajo</div>
<div data-aos="flip-left">Flip hacia la izquierda</div>
<div data-aos="flip-right">Flip hacia la derecha</div>
```

### Animaciones Slide (Deslizar)

```tsx
<div data-aos="slide-up">Slide hacia arriba</div>
<div data-aos="slide-down">Slide hacia abajo</div>
<div data-aos="slide-left">Slide hacia la izquierda</div>
<div data-aos="slide-right">Slide hacia la derecha</div>
```

### Animaciones Zoom (Acercar/Alejar)

```tsx
<div data-aos="zoom-in">Zoom in</div>
<div data-aos="zoom-in-up">Zoom in hacia arriba</div>
<div data-aos="zoom-in-down">Zoom in hacia abajo</div>
<div data-aos="zoom-in-left">Zoom in desde la izquierda</div>
<div data-aos="zoom-in-right">Zoom in desde la derecha</div>
<div data-aos="zoom-out">Zoom out</div>
<div data-aos="zoom-out-up">Zoom out hacia arriba</div>
<div data-aos="zoom-out-down">Zoom out hacia abajo</div>
<div data-aos="zoom-out-left">Zoom out hacia la izquierda</div>
<div data-aos="zoom-out-right">Zoom out hacia la derecha</div>
```

---

## Atributos y Opciones

### Atributos data-aos-*

| Atributo | Descripción | Valores | Ejemplo |
|----------|-------------|---------|---------|
| `data-aos` | Tipo de animación | Ver tipos arriba | `data-aos="fade-up"` |
| `data-aos-duration` | Duración en ms | 50-3000 | `data-aos-duration="1500"` |
| `data-aos-delay` | Retraso en ms | 0-3000 | `data-aos-delay="200"` |
| `data-aos-easing` | Función de easing | linear, ease, ease-in, ease-out, ease-in-out, etc. | `data-aos-easing="ease-in-sine"` |
| `data-aos-offset` | Offset del trigger | 0-500 | `data-aos-offset="200"` |
| `data-aos-once` | Animar solo una vez | true/false | `data-aos-once="true"` |
| `data-aos-anchor` | Elemento ancla | selector CSS | `data-aos-anchor="#element"` |
| `data-aos-anchor-placement` | Posición del ancla | top-bottom, center-center, etc. | `data-aos-anchor-placement="top-center"` |

### Funciones de Easing Disponibles

**Linear:**
- `linear`

**Ease:**
- `ease`
- `ease-in`
- `ease-out`
- `ease-in-out`

**Sine:**
- `ease-in-sine`
- `ease-out-sine`
- `ease-in-out-sine`

**Quad:**
- `ease-in-quad`
- `ease-out-quad`
- `ease-in-out-quad`

**Cubic:**
- `ease-in-cubic`
- `ease-out-cubic`
- `ease-in-out-cubic`

**Quart:**
- `ease-in-quart`
- `ease-out-quart`
- `ease-in-out-quart`

**Quint:**
- `ease-in-quint`
- `ease-out-quint`
- `ease-in-out-quint`

**Expo:**
- `ease-in-expo`
- `ease-out-expo`
- `ease-in-out-expo`

**Circ:**
- `ease-in-circ`
- `ease-out-circ`
- `ease-in-out-circ`

**Back:**
- `ease-in-back`
- `ease-out-back`
- `ease-in-out-back`

---

## Ejemplos Prácticos

### Ejemplo 1: Lista de Servicios

```tsx
'use client';

import { AOSProvider } from './AOSProvider';
import { servicios } from '../data/servicios';
import useIsMobile from '../hooks/useIsMobile';

export default function Servicios() {
  const isMobile = useIsMobile();

  return (
    <section>
      <AOSProvider />
      <h2 className="text-center text-4xl font-bold mb-10" data-aos="fade-up">
        Servicios
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {servicios.map((servicio, index) => (
          <article
            key={servicio.id}
            data-aos={`zoom-in-${index % 2 === 0 ? 'right' : 'left'}`}
            data-aos-delay={isMobile ? 0 : index * 200}
            className="p-4 text-center"
          >
            <h3 className="text-2xl font-bold mb-2">{servicio.nombre}</h3>
            <p className="text-gris-claro mb-4">{servicio.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo 2: Galería de Proyectos

```tsx
'use client';

import { AOSProvider } from './AOSProvider';
import { proyectos } from '../data/proyectos';
import useIsMobile from '../hooks/useIsMobile';

export default function Proyectos() {
  const isMobile = useIsMobile();

  return (
    <section className="mb-20 overflow-x-hidden">
      <AOSProvider />
      <h2 className="text-center text-3xl" data-aos="zoom-in">
        Proyectos Destacados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {proyectos.map((proyecto, index) => (
          <article
            key={proyecto.id}
            data-aos={`fade-${index % 2 === 0 ? 'right' : 'left'}`}
            data-aos-delay={isMobile ? 0 : index * 200}
            data-aos-duration="1000"
            className="p-4"
          >
            <img
              src={proyecto.img}
              alt={proyecto.nombre}
              className="w-full h-90 object-contain"
            />
            <h3 className="text-2xl font-bold mb-2">{proyecto.nombre}</h3>
            <p className="text-gris-claro mb-4">{proyecto.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo 3: Sección Hero con Animación Secuencial

```tsx
'use client';

import { AOSProvider } from './AOSProvider';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <AOSProvider />
      <div className="text-center">
        <h1 
          className="text-6xl font-bold mb-4" 
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          Bienvenido
        </h1>
        <p 
          className="text-2xl mb-8" 
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
        >
          Desarrollador Full Stack
        </p>
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded"
          data-aos="zoom-in"
          data-aos-delay="400"
          data-aos-duration="800"
        >
          Ver Proyectos
        </button>
      </div>
    </section>
  );
}
```

### Ejemplo 4: Cards con Animación Alternada

```tsx
'use client';

import { AOSProvider } from './AOSProvider';

export default function Features() {
  const features = [
    { id: 1, title: 'Diseño Responsive', icon: '📱' },
    { id: 2, title: 'Performance Optimizado', icon: '⚡' },
    { id: 3, title: 'SEO Friendly', icon: '🔍' },
    { id: 4, title: 'Accesible', icon: '♿' },
  ];

  return (
    <section className="overflow-x-hidden">
      <AOSProvider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
            data-aos-duration="1000"
            data-aos-offset="200"
            className="p-6 bg-gray-100 rounded-lg"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo 5: Animación con Ancla Personalizada

```tsx
<div id="anchor-element">
  <h2 data-aos="fade-up" data-aos-anchor="#anchor-element">
    Este título se anima cuando el ancla es visible
  </h2>
  
  <p 
    data-aos="fade-up" 
    data-aos-anchor="#anchor-element"
    data-aos-anchor-placement="top-center"
    data-aos-delay="100"
  >
    Este párrafo también usa el mismo ancla
  </p>
</div>
```

---

## Problemas Comunes y Soluciones

### 1. Desbordamiento Horizontal (Espacio en Blanco a la Derecha)

**Problema:** Las animaciones `fade-left`, `fade-right`, `slide-left`, `slide-right` causan que los elementos se animen desde fuera del viewport, generando scroll horizontal.

**Solución:**

```tsx
// Agregar overflow-x-hidden al contenedor padre
<section className="overflow-x-hidden">
  <AOSProvider />
  <div data-aos="fade-left">Contenido</div>
</section>
```

O aplicarlo globalmente en tu CSS:

```css
/* styles.css */
body {
  overflow-x: hidden;
}
```

### 2. Las Animaciones No Funcionan

**Problema:** Los elementos no se animan al hacer scroll.

**Soluciones:**

1. **Verificar que AOSProvider esté incluido:**
```tsx
<section>
  <AOSProvider /> {/* Debe estar aquí */}
  <div data-aos="fade-up">Contenido</div>
</section>
```

2. **Verificar importación de CSS:**
```tsx
import 'aos/dist/aos.css'; // En AOSProvider.tsx
```

3. **Refrescar AOS después de cambios en el DOM:**
```tsx
import AOS from 'aos';

useEffect(() => {
  AOS.refresh();
}, [data]); // Refrescar cuando cambian los datos
```

### 3. Retraso No Funciona en Móvil

**Problema:** Los retrasos escalonados (`data-aos-delay`) hacen que la experiencia en móvil sea lenta.

**Solución:** Deshabilitar retrasos en dispositivos móviles:

```tsx
import useIsMobile from '../hooks/useIsMobile';

export default function MiComponente() {
  const isMobile = useIsMobile();

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={isMobile ? 0 : 200}
    >
      Contenido
    </div>
  );
}
```

### 4. Animaciones Cortadas o Incompletas

**Problema:** Las animaciones se cortan o no se completan correctamente.

**Solución:** Ajustar el `offset` para que la animación comience antes:

```tsx
<div
  data-aos="fade-up"
  data-aos-offset="50" // Menor offset = comienza antes
>
  Contenido
</div>
```

O en la configuración global:

```tsx
AOS.init({
  offset: 50, // Ajustar globalmente
});
```

### 5. Rendimiento Lento con Muchas Animaciones

**Problema:** Demasiadas animaciones simultáneas causan lag.

**Soluciones:**

1. **Usar animaciones más simples:**
```tsx
// En lugar de flip-up (pesada)
<div data-aos="fade-up">Contenido</div>
```

2. **Limitar el número de animaciones simultáneas:**
```tsx
// Usar retrasos escalonados
{items.map((item, index) => (
  <div
    key={item.id}
    data-aos="fade-up"
    data-aos-delay={index * 100} // Retraso progresivo
  >
    {item.content}
  </div>
))}
```

3. **Deshabilitar AOS en dispositivos de bajo rendimiento:**
```tsx
AOS.init({
  disable: window.innerWidth < 768, // Deshabilitar en móvil
});
```

### 6. Elementos Visibles Antes de la Animación

**Problema:** Los elementos aparecen brevemente antes de que la animación inicie.

**Solución:** Agregar CSS para ocultar elementos hasta que AOS esté listo:

```css
/* styles.css */
[data-aos] {
  pointer-events: none;
}

[data-aos].aos-animate {
  pointer-events: auto;
}
```

### 7. Animaciones No Se Repiten

**Problema:** Las animaciones solo ocurren una vez y no se repiten al hacer scroll.

**Solución:** Configurar `once: false`:

```tsx
// En AOSProvider.tsx
AOS.init({
  once: false, // Las animaciones se repiten
});
```

O por elemento:

```tsx
<div data-aos="fade-up" data-aos-once="false">
  Contenido que se anima cada vez
</div>
```

---

## Mejores Prácticas

### 1. Consistencia en las Animaciones

Usa un conjunto limitado de animaciones para mantener consistencia:

```tsx
// ✅ Buena práctica
const ANIMATION_TYPES = {
  fadeUp: 'fade-up',
  fadeLeft: 'fade-left',
  zoomIn: 'zoom-in',
};

<div data-aos={ANIMATION_TYPES.fadeUp}>Contenido</div>
```

### 2. Duraciones Razonables

No hagas las animaciones demasiado lentas o rápidas:

```tsx
// ✅ Duraciones recomendadas
<div data-aos="fade-up" data-aos-duration="800">Rápida</div>
<div data-aos="fade-up" data-aos-duration="1000">Normal</div>
<div data-aos="fade-up" data-aos-duration="1500">Lenta</div>

// ❌ Evitar
<div data-aos="fade-up" data-aos-duration="3000">Muy lenta</div>
```

### 3. Usar `once: true` para Mejor Rendimiento

A menos que necesites que las animaciones se repitan, usa `once: true`:

```tsx
AOS.init({
  once: true, // Mejor rendimiento
});
```

### 4. Responsive: Ajustar Según Dispositivo

```tsx
const isMobile = useIsMobile();

// Configuración condicional
<div
  data-aos={isMobile ? 'fade-up' : 'fade-right'}
  data-aos-duration={isMobile ? 600 : 1000}
  data-aos-delay={isMobile ? 0 : 200}
>
  Contenido responsive
</div>
```

### 5. Accesibilidad: Respetar Preferencias del Usuario

```tsx
// En AOSProvider.tsx
AOS.init({
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
});
```

### 6. Evitar Animaciones en Elementos Críticos

No animes elementos importantes como botones CTA o formularios que puedan causar confusión:

```tsx
// ❌ Evitar
<button data-aos="fade-up">Comprar Ahora</button>

// ✅ Mejor
<button>Comprar Ahora</button>
```

### 7. Agrupar Elementos Relacionados

Anima contenedores en lugar de cada elemento individual:

```tsx
// ✅ Buena práctica
<article data-aos="fade-up">
  <h3>Título</h3>
  <p>Descripción</p>
  <button>Acción</button>
</article>

// ❌ Evitar (demasiadas animaciones)
<article>
  <h3 data-aos="fade-up">Título</h3>
  <p data-aos="fade-up" data-aos-delay="100">Descripción</p>
  <button data-aos="fade-up" data-aos-delay="200">Acción</button>
</article>
```

### 8. Testing: Verificar en Diferentes Dispositivos

Siempre prueba tus animaciones en:
- Desktop (Chrome, Firefox, Safari)
- Tablet (iPad, Android tablets)
- Móvil (iOS, Android)
- Diferentes velocidades de conexión

### 9. Documentar Animaciones Personalizadas

Si creas animaciones personalizadas, documéntalas:

```tsx
/**
 * Animación personalizada para cards de proyecto
 * - Desktop: fade desde la derecha/izquierda alternado
 * - Móvil: fade-up simple sin retraso
 * 
 * @param index - Índice del elemento para alternar animación
 * @param isMobile - Si es dispositivo móvil
 */
const getProjectAnimation = (index: number, isMobile: boolean) => {
  if (isMobile) return 'fade-up';
  return index % 2 === 0 ? 'fade-right' : 'fade-left';
};
```

### 10. Configuración Global vs Local

Usa configuración global para valores por defecto y sobreescribe localmente cuando sea necesario:

```tsx
// Global (AOSProvider.tsx)
AOS.init({
  duration: 1000,
  once: true,
  offset: 120,
});

// Local (sobrescribe solo lo necesario)
<div 
  data-aos="fade-up"
  data-aos-duration="1500" // Sobrescribe la duración global
>
  Contenido
</div>
```

---

## Recursos Adicionales

- [Documentación Oficial de AOS](https://michalsnik.github.io/aos/)
- [GitHub Repository](https://github.com/michalsnik/aos)
- [Easing Functions Cheatsheet](https://easings.net/)

---

## Resumen de Comandos Rápidos

```tsx
// Instalación
pnpm add aos

// Importación básica
import AOS from 'aos';
import 'aos/dist/aos.css';

// Inicialización
AOS.init({
  duration: 1000,
  once: true,
});

// Uso básico
<div data-aos="fade-up">Contenido</div>

// Con opciones
<div 
  data-aos="fade-up"
  data-aos-duration="1500"
  data-aos-delay="200"
  data-aos-easing="ease-in-out"
>
  Contenido
</div>

// Refrescar AOS
AOS.refresh();
```

---

**Última actualización:** Noviembre 2025
