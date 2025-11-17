# Guía Completa de AOS (Animate On Scroll) para Proyectos React/TypeScript

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Configuración Optimizada](#configuración-optimizada)
4. [Tipos de Animaciones](#tipos-de-animaciones)
5. [Atributos y Propiedades](#atributos-y-propiedades)
6. [Hooks y Utilidades Personalizadas](#hooks-y-utilidades-personalizadas)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
9. [Mejores Prácticas](#mejores-prácticas)
10. [Optimización de Rendimiento](#optimización-de-rendimiento)
11. [Testing y Debugging](#testing-y-debugging)
12. [Recursos y Referencias](#recursos-y-referencias)

---

## Introducción

**AOS (Animate On Scroll)** es una biblioteca ligera y potente para crear animaciones de scroll en aplicaciones web. Perfecta para mejorar la experiencia de usuario con animaciones suaves y atractivas.

### Características Principales

- **Ligero**: Solo ~3KB gzipped
- **Alto rendimiento**: Optimizado con GPU
- **Responsive**: Funciona en todos los dispositivos
- **Personalizable**: Más de 20 animaciones predefinidas
- **Configurable**: Control total sobre timing y comportamiento
- **Accesible**: Respeta las preferencias de reducción de movimiento

### Casos de Uso Ideales

- Animaciones de entrada en secciones
- Cards que aparecen al hacer scroll
- Elementos que se revelan progresivamente
- Transiciones suaves en galerías
- Feedback visual en formularios

---

## Instalación y Configuración

### Instalación

```bash
# Con pnpm (recomendado)
pnpm add aos
pnpm add -D @types/aos

# Con npm
npm install aos
npm install -D @types/aos

# Con yarn
yarn add aos
yarn add -D @types/aos
```

### Configuración Básica

```tsx
// src/components/AOSProvider.tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Proveedor de AOS optimizado para proyectos React
 * Configuración recomendada para máxima compatibilidad y rendimiento
 */
export function AOSProvider() {
  useEffect(() => {
    // Verificar si el usuario prefiere reducir movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
      // Configuración básica
      duration: 600,
      easing: 'ease-out',
      once: true,

      // Optimizaciones de rendimiento
      offset: 50,
      throttleDelay: 99,
      disableMutationObserver: false,

      // Configuraciones adicionales (evitan overflows horizontales)
      anchorPlacement: 'top-bottom',
      mirror: false,

      // Accesibilidad: deshabilitar si el usuario lo prefiere
      disable: prefersReducedMotion,

      // Eventos de inicialización
      startEvent: 'DOMContentLoaded',
    });

    // Función para refrescar AOS cuando cambie el contenido
    function refreshAOS() {
      AOS.refresh();
    }

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', refreshAOS);

    // Cleanup
    return () => {
      window.removeEventListener('resize', refreshAOS);
    };
  }, []);

  return null;
}
```

### Integración en la App

```tsx
// src/App.tsx o src/_app.tsx
import { AOSProvider } from './components/AOSProvider';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AOSProvider />
      {children}
    </>
  );
}
```

---

## Configuración Optimizada

### Configuración para Diferentes Entornos

```tsx
// src/config/aos.config.ts
export const AOS_CONFIG = {
  // Configuración de desarrollo (más rápida para testing)
  development: {
    duration: 300,
    offset: 10,
    once: false, // Permitir reanimaciones en desarrollo
  },

  // Configuración de producción (optimizada)
  production: {
    duration: 600,
    offset: 50,
    once: true,
    throttleDelay: 99,
  },

  // Configuración para móvil
  mobile: {
    duration: 400,
    offset: 30,
    throttleDelay: 50,
  },
} as const;

export type AOSConfig = typeof AOS_CONFIG.development;
```

### Provider Inteligente

```tsx
// src/components/AOSProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AOS_CONFIG } from '../config/aos.config';

export function AOSProvider() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Detectar entorno
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isMobile = window.innerWidth < 768;

    // Seleccionar configuración apropiada
    const baseConfig = isDevelopment ? AOS_CONFIG.development : AOS_CONFIG.production;
    const config = isMobile ? { ...baseConfig, ...AOS_CONFIG.mobile } : baseConfig;

    // Verificar preferencias de accesibilidad
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    AOS.init({
      ...config,
      disable: prefersReducedMotion,
    });

    setIsInitialized(true);

    // Refresco inteligente
    const refreshAOS = () => AOS.refresh();
    window.addEventListener('resize', refreshAOS);

    return () => {
      window.removeEventListener('resize', refreshAOS);
    };
  }, []);

  // Re-inicializar cuando cambie el contenido dinámico
  useEffect(() => {
    if (isInitialized) {
      // Pequeño delay para asegurar que el DOM esté actualizado
      const timeoutId = setTimeout(() => AOS.refresh(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isInitialized]);

  return null;
}
```

---

## Tipos de Animaciones

### Fade (Desvanecimiento)

```tsx
<div data-aos="fade">Fade simple</div>
<div data-aos="fade-up">Fade hacia arriba</div>
<div data-aos="fade-down">Fade hacia abajo</div>
<div data-aos="fade-left">Fade desde izquierda (puede causar overflow)</div>
<div data-aos="fade-right">Fade desde derecha (puede causar overflow)</div>
```

### Zoom (Acercamiento)

```tsx
<div data-aos="zoom-in">Zoom in</div>
<div data-aos="zoom-in-up">Zoom in desde arriba</div>
<div data-aos="zoom-in-down">Zoom in desde abajo</div>
<div data-aos="zoom-in-left">Zoom in desde izquierda</div>
<div data-aos="zoom-in-right">Zoom in desde derecha</div>
<div data-aos="zoom-out">Zoom out</div>
```

### Slide (Deslizamiento)

```tsx
<div data-aos="slide-up">Slide hacia arriba</div>
<div data-aos="slide-down">Slide hacia abajo</div>
<div data-aos="slide-left">Slide desde izquierda (puede causar overflow)</div>
<div data-aos="slide-right">Slide desde derecha (puede causar overflow)</div>
```

### Flip (Volteo)

```tsx
<div data-aos="flip-up">Flip hacia arriba</div>
<div data-aos="flip-down">Flip hacia abajo</div>
<div data-aos="flip-left">Flip hacia izquierda</div>
<div data-aos="flip-right">Flip hacia derecha</div>
```

---

## Atributos y Propiedades

### Atributos Principales

| Atributo                    | Tipo    | Descripción         | Valores Ejemplo                   |
| --------------------------- | ------- | ------------------- | --------------------------------- |
| `data-aos`                  | string  | Tipo de animación   | `"fade-up"`, `"zoom-in"`          |
| `data-aos-duration`         | number  | Duración en ms      | `600`, `1000`, `1500`             |
| `data-aos-delay`            | number  | Retraso en ms       | `0`, `200`, `500`                 |
| `data-aos-easing`           | string  | Función de easing   | `"ease"`, `"ease-in-out"`         |
| `data-aos-offset`           | number  | Offset del trigger  | `50`, `120`, `200`                |
| `data-aos-once`             | boolean | Animar solo una vez | `"true"`, `"false"`               |
| `data-aos-anchor`           | string  | Selector de ancla   | `"#elemento"`, `".clase"`         |
| `data-aos-anchor-placement` | string  | Posición del ancla  | `"top-center"`, `"bottom-bottom"` |

### Funciones de Easing

```tsx
// Lineal
'ease-linear';

// Suave
'ease-in' | 'ease-out' | 'ease-in-out';

// Seno
'ease-in-sine' | 'ease-out-sine' | 'ease-in-out-sine';

// Cuadrática
'ease-in-quad' | 'ease-out-quad' | 'ease-in-out-quad';

// Cúbica
'ease-in-cubic' | 'ease-out-cubic' | 'ease-in-out-cubic';
```

---

## Hooks y Utilidades Personalizadas

### Hook para Animaciones Condicionales

```tsx
// src/hooks/useAOS.ts
import { useEffect, useRef } from 'react';

interface UseAOSOptions {
  animation?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  once?: boolean;
  disabled?: boolean;
}

export function useAOS(options: UseAOSOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || options.disabled) return;

    // Aplicar atributos data-aos
    if (options.animation) {
      element.setAttribute('data-aos', options.animation);
    }
    if (options.duration) {
      element.setAttribute('data-aos-duration', options.duration.toString());
    }
    if (options.delay !== undefined) {
      element.setAttribute('data-aos-delay', options.delay.toString());
    }
    if (options.offset) {
      element.setAttribute('data-aos-offset', options.offset.toString());
    }
    if (options.once !== undefined) {
      element.setAttribute('data-aos-once', options.once.toString());
    }

    // Cleanup
    return () => {
      element.removeAttribute('data-aos');
      element.removeAttribute('data-aos-duration');
      element.removeAttribute('data-aos-delay');
      element.removeAttribute('data-aos-offset');
      element.removeAttribute('data-aos-once');
    };
  }, [options]);

  return elementRef;
}
```

### Hook para Animaciones Secuenciales

```tsx
// src/hooks/useSequentialAOS.ts
import { useEffect, useRef } from 'react';

interface SequentialAOSOptions {
  baseAnimation?: string;
  staggerDelay?: number;
  duration?: number;
  disabled?: boolean;
}

export function useSequentialAOS(options: SequentialAOSOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || options.disabled) return;

    const elements = container.querySelectorAll('[data-aos]');
    const baseDelay = options.staggerDelay || 100;

    elements.forEach((element, index) => {
      const delay = index * baseDelay;
      element.setAttribute('data-aos-delay', delay.toString());

      if (options.duration) {
        element.setAttribute('data-aos-duration', options.duration.toString());
      }
    });
  }, [options]);

  return containerRef;
}
```

### Utilidad para Animaciones Responsive

```tsx
// src/utils/aos.utils.ts
import { useIsMobile } from './hooks/useIsMobile';

export function getResponsiveAnimation(
  desktopAnimation: string,
  mobileAnimation: string = 'fade-up',
): string {
  const isMobile = useIsMobile();
  return isMobile ? mobileAnimation : desktopAnimation;
}

export function getResponsiveDelay(desktopDelay: number, mobileDelay: number = 0): number {
  const isMobile = useIsMobile();
  return isMobile ? mobileDelay : desktopDelay;
}

export function getResponsiveDuration(
  desktopDuration: number = 1000,
  mobileDuration: number = 600,
): number {
  const isMobile = useIsMobile();
  return isMobile ? mobileDuration : desktopDuration;
}
```

---

## Ejemplos Prácticos

### Ejemplo 1: Cards de Servicios con Animación Alternada

```tsx
// src/components/Servicios.tsx
'use client';

import { useSequentialAOS } from '../hooks/useSequentialAOS';
import { getResponsiveAnimation } from '../utils/aos.utils';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

interface ServiciosProps {
  servicios: Servicio[];
}

export function Servicios({ servicios }: ServiciosProps) {
  const containerRef = useSequentialAOS({
    baseAnimation: 'zoom-in',
    staggerDelay: 150,
    duration: 800,
  });

  return (
    <section ref={containerRef} className="aos-container">
      <h2 className="text-center text-4xl font-bold mb-10" data-aos="fade-up">
        Nuestros Servicios
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map((servicio, index) => (
          <article
            key={servicio.id}
            data-aos={getResponsiveAnimation(
              index % 2 === 0 ? 'fade-right' : 'fade-left',
              'zoom-in',
            )}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">{servicio.icono}</div>
            <h3 className="text-xl font-bold mb-3">{servicio.nombre}</h3>
            <p className="text-gray-600">{servicio.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo 2: Galería de Proyectos con Lazy Loading

```tsx
// src/components/Proyectos.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  tecnologias: string[];
}

interface ProyectosProps {
  proyectos: Proyecto[];
}

export function Proyectos({ proyectos }: ProyectosProps) {
  const [visibleProjects, setVisibleProjects] = useState<Proyecto[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Lazy loading de proyectos
  useEffect(() => {
    const loadProjects = async () => {
      for (const project of proyectos) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setVisibleProjects(prev => [...prev, project]);
      }
    };

    loadProjects();
  }, [proyectos]);

  const handleImageLoad = (projectId: number) => {
    setLoadedImages(prev => new Set(prev).add(projectId));
  };

  return (
    <section className="aos-container">
      <h2 className="text-center text-3xl font-bold mb-12" data-aos="zoom-in">
        Proyectos Destacados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleProjects.map((proyecto, index) => (
          <article
            key={proyecto.id}
            data-aos="fade-up"
            data-aos-delay={index * 200}
            data-aos-duration="800"
            className="group relative overflow-hidden rounded-lg shadow-lg"
          >
            <div className="aspect-video relative">
              <Image
                src={proyecto.imagen}
                alt={proyecto.titulo}
                fill
                className={`object-cover transition-all duration-500 ${
                  loadedImages.has(proyecto.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                onLoad={() => handleImageLoad(proyecto.id)}
              />

              {/* Overlay con información */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-bold mb-2">{proyecto.titulo}</h3>
                  <p className="text-sm mb-4">{proyecto.descripcion}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {proyecto.tecnologias.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo 3: Timeline Interactiva

```tsx
// src/components/Timeline.tsx
'use client';

import { useState } from 'react';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  return (
    <section className="aos-container py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-4xl font-bold mb-16" data-aos="fade-up">
          Nuestra Historia
        </h2>

        <div className="relative">
          {/* Línea central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

          {events.map((event, index) => (
            <div
              key={event.id}
              data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-delay={index * 150}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Punto en la línea */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full z-10"></div>

              {/* Contenido */}
              <div
                className={`w-5/12 p-6 bg-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
                  activeEvent === event.id ? 'scale-105 shadow-xl' : ''
                }`}
                onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{event.icon}</span>
                  <div>
                    <div className="text-sm text-gray-500 font-semibold">{event.year}</div>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                  </div>
                </div>

                <p
                  className={`text-gray-600 transition-all duration-300 ${
                    activeEvent === event.id
                      ? 'opacity-100 max-h-40'
                      : 'opacity-70 max-h-16 overflow-hidden'
                  }`}
                >
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Ejemplo 4: Formulario con Animaciones de Validación

```tsx
// src/components/ContactForm.tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section className="aos-container py-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-center text-3xl font-bold mb-8" data-aos="fade-up">
          Contáctanos
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div data-aos="fade-up" data-aos-delay="100">
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-medium mb-2">Mensaje</label>
              <textarea
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-aos="zoom-in"
              data-aos-delay="400"
              className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Mensaje'
              )}
            </button>
          </form>
        ) : (
          <div data-aos="zoom-in" className="text-center py-12">
            <div className="text-6xl mb-4">Hecho</div>
            <h3 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h3>
            <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Problemas Comunes y Soluciones

### 1. Espacio en Blanco Horizontal (Overflow)

**Problema:** Animaciones `fade-left/right` y `slide-left/right` causan scroll horizontal.

**Soluciones:**

```css
/* styles.css - Solución CSS */
.aos-container {
  overflow-x: hidden;
  width: 100%;
}

[data-aos] {
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
```

```tsx
// Solución React - Usar animaciones seguras
const safeAnimations = {
  mobile: 'fade-up',
  desktop: 'zoom-in',
};

<div data-aos={isMobile ? safeAnimations.mobile : safeAnimations.desktop}>Contenido</div>;
```

### 2. Animaciones No Funcionan

**Causas y Soluciones:**

```tsx
// ❌ Problema: AOSProvider no incluido
function App() {
  return <div data-aos="fade-up">No funciona</div>;
}

// ✅ Solución: Incluir AOSProvider
function App() {
  return (
    <>
      <AOSProvider />
      <div data-aos="fade-up">Funciona</div>
    </>
  );
}
```

```tsx
// ❌ Problema: Contenido dinámico no refresca AOS
useEffect(() => {
  setData(newData); // AOS no sabe del cambio
}, []);

// ✅ Solución: Refrescar AOS después de cambios
useEffect(() => {
  setData(newData);
  // Pequeño delay para asegurar DOM update
  setTimeout(() => AOS.refresh(), 100);
}, [newData]);
```

### 3. Rendimiento Lento

**Optimizaciones:**

```tsx
// Configuración optimizada
AOS.init({
  throttleDelay: 99, // Menor throttling
  offset: 50, // Trigger más temprano
  once: true, // No reanimar
});

// Usar will-change solo cuando sea necesario
[data-aos] {
  will-change: transform;
}

[data-aos].aos-animate {
  will-change: auto;
}
```

### 4. Problemas de Accesibilidad

```tsx
// Respetar preferencias del usuario
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

AOS.init({
  disable: prefersReducedMotion,
});

// CSS para usuarios con preferencias reducidas
@media (prefers-reduced-motion: reduce) {
  [data-aos] {
    animation: none !important;
    transition: none !important;
  }
}
```

### 5. Animaciones en Dispositivos Móviles

```tsx
// Hook personalizado para detectar móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Uso
function AnimatedComponent() {
  const isMobile = useIsMobile();

  return (
    <div data-aos={isMobile ? 'fade-up' : 'fade-right'} data-aos-delay={isMobile ? 0 : 200}>
      Contenido
    </div>
  );
}
```

---

## Mejores Prácticas

### 1. Estructura del Proyecto

```
src/
├── components/
│   ├── AOSProvider.tsx
│   └── ui/
│       ├── AnimatedCard.tsx
│       └── AnimatedSection.tsx
├── hooks/
│   ├── useAOS.ts
│   └── useSequentialAOS.ts
├── utils/
│   └── aos.utils.ts
└── config/
    └── aos.config.ts
```

### 2. Componentes Reutilizables

```tsx
// src/components/ui/AnimatedSection.tsx
interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: string;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = 'fade-up',
  className = '',
}: AnimatedSectionProps) {
  return <section className={`aos-container ${className}`}>{children}</section>;
}
```

### 3. Sistema de Diseño de Animaciones

```tsx
// src/config/animation.theme.ts
export const ANIMATION_THEME = {
  // Animaciones por tipo de contenido
  hero: {
    title: 'fade-down',
    subtitle: 'fade-up',
    cta: 'zoom-in',
  },

  card: {
    container: 'fade-up',
    hover: 'scale-in',
  },

  list: {
    item: 'slide-up',
    stagger: 100,
  },

  // Duraciones por importancia
  fast: 300,
  normal: 600,
  slow: 1000,

  // Delays por jerarquía
  primary: 0,
  secondary: 200,
  tertiary: 400,
} as const;
```

### 4. Testing de Animaciones

```tsx
// src/components/__tests__/AnimatedCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AnimatedCard } from '../AnimatedCard';

describe('AnimatedCard', () => {
  it('should render with correct AOS attributes', () => {
    render(<AnimatedCard animation="fade-up" />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-aos', 'fade-up');
  });

  it('should apply custom duration', () => {
    render(<AnimatedCard animation="fade-up" duration={800} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-aos-duration', '800');
  });

  it('should handle mobile animations', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 500 });

    render(<AnimatedCard animation="fade-right" mobileAnimation="fade-up" />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-aos', 'fade-up');
  });
});
```

---

## Optimización de Rendimiento

### 1. Lazy Loading de Animaciones

```tsx
// Solo animar elementos visibles
function useLazyAOS() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

// Uso
function LazyAnimatedComponent() {
  const [ref, isVisible] = useLazyAOS();

  return (
    <div ref={ref} data-aos={isVisible ? 'fade-up' : undefined}>
      Contenido
    </div>
  );
}
```

### 2. Debouncing de Eventos

```tsx
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Uso en AOSProvider
const debouncedResize = useDebounce(() => AOS.refresh(), 100);
```

### 3. Virtualización para Listas Largas

```tsx
// Para listas muy largas, usar react-window
import { FixedSizeList as List } from 'react-window';

function VirtualizedAnimatedList({ items }: { items: any[] }) {
  return (
    <List height={400} itemCount={items.length} itemSize={100}>
      {({ index, style }) => (
        <div style={style} data-aos="fade-up" data-aos-delay={index * 50}>
          {items[index].name}
        </div>
      )}
    </List>
  );
}
```

---

## Testing y Debugging

### 1. Debugging de AOS

```tsx
// src/utils/aos.debug.ts
export function debugAOS() {
  // Verificar si AOS está cargado
  if (typeof window !== 'undefined' && window.AOS) {
    console.log('AOS Version:', window.AOS.version);
    console.log('AOS Initialized:', window.AOS._initialized);
  }

  // Verificar elementos con AOS
  const aosElements = document.querySelectorAll('[data-aos]');
  console.log('Elementos con AOS:', aosElements.length);

  // Verificar elementos animados
  const animatedElements = document.querySelectorAll('.aos-animate');
  console.log('Elementos animados:', animatedElements.length);
}

// Hook para debugging
export function useAOSDebug() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      debugAOS();

      // Debug en cada animación
      const observer = new MutationObserver(() => {
        debugAOS();
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);
}
```

### 2. Tests Unitarios

```tsx
// src/components/__tests__/AOSProvider.test.tsx
import { render, screen } from '@testing-library/react';
import { AOSProvider } from '../components/AOSProvider';

describe('AOSProvider', () => {
  it('should initialize AOS on mount', () => {
    render(<AOSProvider />);
    // Verificar que AOS.init fue llamado
  });

  it('should respect reduced motion preferences', () => {
    // Mock de matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => ({ matches: true })),
    });

    render(<AOSProvider />);
    // Verificar que AOS se deshabilita
  });
});
```

### 3. Tests de Integración

```tsx
// src/__tests__/integration/AOS.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';

describe('AOS Integration', () => {
  it('should animate elements on scroll', async () => {
    render(<App />);

    const animatedElement = screen.getByTestId('animated-element');

    // Elemento debería estar inicialmente sin animar
    expect(animatedElement).not.toHaveClass('aos-animate');

    // Simular scroll
    window.scrollTo(0, 500);
    window.dispatchEvent(new Event('scroll'));

    // Esperar a que se aplique la animación
    await waitFor(() => {
      expect(animatedElement).toHaveClass('aos-animate');
    });
  });
});
```

---

## Recursos y Referencias

### Documentación Oficial

- [AOS GitHub](https://github.com/michalsnik/aos)
- [AOS Demo](https://michalsnik.github.io/aos/)

### Herramientas Relacionadas

- [Framer Motion](https://www.framer.com/motion/) - Alternativa más avanzada
- [React Spring](https://www.react-spring.io/) - Animaciones basadas en física
- [GSAP](https://greensock.com/gsap/) - Librería profesional de animaciones

### Artículos y Tutoriales

- [CSS Triggers](https://csstriggers.com/) - Propiedades que activan repaints
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Comunidad

- [Stack Overflow - AOS](https://stackoverflow.com/questions/tagged/aos)
- [Reddit r/webdev](https://www.reddit.com/r/webdev/)
- [Dev.to](https://dev.to/search?q=aos)

---

## Checklist de Implementación

### Antes de Implementar

- [ ] ¿El proyecto necesita animaciones de scroll?
- [ ] ¿Los usuarios pueden tener preferencias de reducción de movimiento?
- [ ] ¿El rendimiento es crítico para la aplicación?

### Durante la Implementación

- [ ] AOSProvider incluido en la raíz de la app
- [ ] CSS de AOS importado correctamente
- [ ] Configuración optimizada para el proyecto
- [ ] Animaciones responsive implementadas
- [ ] Contenedores con `overflow-x: hidden` donde sea necesario

### Testing

- [ ] Animaciones funcionan en desktop y móvil
- [ ] Respetan preferencias de accesibilidad
- [ ] No causan problemas de rendimiento
- [ ] Funcionan correctamente con contenido dinámico

### Optimización

- [ ] Duraciones y delays optimizados
- [ ] Animaciones desactivadas en dispositivos lentos
- [ ] Lazy loading implementado para listas largas
- [ ] Bundle size verificado

---

**Última actualización:** Noviembre 2025
**Versión de AOS recomendada:** ^2.3.4
**Compatibilidad:** React 16.8+, TypeScript 4.0+
