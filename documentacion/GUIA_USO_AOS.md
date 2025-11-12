# Guía Completa: Animate On Scroll (AOS) en React

Documentación exhaustiva sobre cómo implementar y optimizar **Animate On Scroll (AOS)** en proyectos React modernos, con ejemplos prácticos del portafolio **Waku + React + TypeScript + Tailwind CSS**.

---

## 📋 Tabla de Contenidos

1. [¿Qué es AOS?](#1-qué-es-aos)
2. [Instalación](#2-instalación)
3. [Configuración en React](#3-configuración-en-react)
4. [Patrones de Uso](#4-patrones-de-uso)
5. [Atributos y Opciones](#5-atributos-y-opciones)
6. [Ejemplos Avanzados](#6-ejemplos-avanzados)
7. [Optimización y Performance](#7-optimización-y-performance)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. ¿Qué es AOS?

**Animate On Scroll (AOS)** es una librería JavaScript que permite agregar animaciones a elementos HTML cuando entran en el viewport (ventana visible del navegador).

### Ventajas

✅ **Liviano**: ~13KB minificado  
✅ **Fácil de usar**: Solo requiere atributos HTML  
✅ **Flexible**: 50+ animaciones predefinidas  
✅ **Compatible con SSR**: Funciona con React Server Components  
✅ **Sin dependencias**: No requiere jQuery ni otras librerías  
✅ **Accesible**: Respeta `prefers-reduced-motion`  

### Casos de Uso Ideales

- Portafolios y landing pages
- Secciones de testimonios o características
- Galerías de proyectos
- Animaciones de entrada suaves (fade, slide, zoom)
- Experiencias storytelling con scroll

---

## 2. Instalación

### Paso 1: Instalar dependencias

```bash
# Con pnpm (recomendado)
pnpm add aos
pnpm add -D @types/aos

# Con npm
npm install aos
npm install --save-dev @types/aos

# Con yarn
yarn add aos
yarn add -D @types/aos
```

### Paso 2: Verificar instalación

Comprueba que las dependencias estén en `package.json`:

```json
{
  "dependencies": {
    "aos": "^2.3.4"
  },
  "devDependencies": {
    "@types/aos": "^3.0.7"
  }
}
```

---

## 3. Configuración en React

### 3.1. Crear el Proveedor de AOS

**¿Por qué un proveedor?** En React con SSR (Server-Side Rendering), necesitamos inicializar AOS solo en el cliente para evitar errores de hidratación.

Crea `src/components/AOSProvider.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Componente proveedor que inicializa AOS (Animate On Scroll) en el cliente.
 * 
 * - Debe usarse en el layout raíz para que todas las páginas hereden la funcionalidad
 * - Marcado como 'use client' porque manipula el DOM y usa useEffect
 * - Ejecuta AOS.init() una sola vez al montar
 * - Limpia con AOS.refreshHard() al desmontar
 * 
 * @example
 * // En _layout.tsx
 * import { AOSProvider } from './AOSProvider';
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <AOSProvider />
 *       {children}
 *     </>
 *   );
 * }
 * 
 * @see https://github.com/michalsnik/aos
 */
export function AOSProvider() {
  useEffect(() => {
    // Inicializar AOS con configuración optimizada
    AOS.init({
      // Duración de la animación en ms
      duration: 600,
      
      // Función de easing para transiciones suaves
      easing: 'ease-out',
      
      // Animar solo una vez (true) o cada vez que entra al viewport (false)
      once: true,
      
      // Offset en píxeles desde el trigger point
      offset: 120,
      
      // Delay en ms antes de iniciar la animación
      delay: 0,
      
      // Deshabilitar animaciones en móviles si es necesario
      disable: false, // Cambiar a 'mobile' para deshabilitar en móviles
      
      // Iniciar animaciones cuando el elemento ocupe X% del viewport
      anchorPlacement: 'top-bottom',
      
      // Respetar la preferencia de movimiento reducido del usuario
      disableMutationObserver: false,
    });

    // Cleanup: limpiar instancia al desmontar
    return () => {
      AOS.refreshHard();
    };
  }, []);

  // No renderiza nada, solo inicializa AOS
  return null;
}
```

### 3.2. Integrar en el Layout Raíz

**Opción A: Layout Global** (recomendado si usas AOS en todo el sitio)

En `src/pages/_layout.tsx`:

```tsx
import { AOSProvider } from '../components/AOSProvider';
import { Analytics } from '@vercel/analytics/react';
import Footer from '../components/footer';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      {/* Analytics primero (no requiere DOM) */}
      <Analytics />
      
      {/* Inicializar AOS globalmente */}
      <AOSProvider />
      
      {/* Contenido principal */}
      <main id="main" className="flex-1 bg-gris-heavy text-indigo-50">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </section>
  );
}
```

**Opción B: Por Componente** (si solo necesitas AOS en secciones específicas)

En cada componente que use animaciones:

```tsx
'use client';

import { AOSProvider } from './AOSProvider';

export default function Proyectos() {
  return (
    <section>
      {/* Inicializar AOS localmente */}
      <AOSProvider />
      
      <h2 data-aos="fade-up">Mis Proyectos</h2>
      {/* ... resto del contenido ... */}
    </section>
  );
}
```

### 3.3. Importar Estilos CSS de AOS

El CSS de AOS se importa automáticamente en `AOSProvider.tsx` con:

```tsx
import 'aos/dist/aos.css';
```

Si usas un framework CSS-in-JS o configuración personalizada, puedes importarlo en tu archivo de estilos globales:

```css
/* src/styles.css */
@import 'aos/dist/aos.css';
```

---

## 4. Patrones de Uso

### 4.1. Animación Básica

Añade el atributo `data-aos` al elemento que quieres animar:

```tsx
<div data-aos="fade-up">
  <h1>Este título se animará al aparecer</h1>
</div>
```

### 4.2. Animación con Delay

Usa `data-aos-delay` para escalonar animaciones:

```tsx
<h1 data-aos="fade-up" data-aos-delay="0">Título 1</h1>
<h2 data-aos="fade-up" data-aos-delay="200">Título 2</h2>
<h3 data-aos="fade-up" data-aos-delay="400">Título 3</h3>
```

### 4.3. Animaciones Dinámicas en Listas

**Ejemplo del proyecto:** Animaciones alternadas basadas en índice

```tsx
'use client';

import { AOSProvider } from './AOSProvider';
import { proyectos } from '../data/proyectos';
import useIsMobile from '../hooks/useIsMobile';

export default function Proyectos() {
  const isMobile = useIsMobile();

  return (
    <section className="mb-20">
      <AOSProvider />
      
      <h2 className="text-center text-3xl" data-aos="zoom-in">
        Algunos de los proyectos realizados este año
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {proyectos.map((proyecto, index) => (
          <article
            key={proyecto.id}
            // Animar desde derecha o izquierda alternando
            data-aos={`fade-${Number(proyecto.id) % 2 === 0 ? 'right' : 'left'}`}
            // En móviles sin delay, en desktop escalonado
            data-aos-delay={`${isMobile ? 0 : Number(proyecto.id) * 200}`}
            className="p-4"
          >
            <img
              src={Array.isArray(proyecto.img) ? proyecto.img[0] : proyecto.img}
              alt={`Screenshot de ${proyecto.nombre}`}
              className="w-full h-90 object-contain"
            />
            <h3 className="text-2xl font-bold mb-2">{proyecto.nombre}</h3>
            <p className="text-gris-claro mb-4">{proyecto.descripcion}</p>
            <a
              href={proyecto.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-doradoSK text-black px-4 py-2 rounded hover:bg-gatorojo transition"
            >
              Ver Proyecto
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

**Explicación del código:**

1. **`useIsMobile` hook**: Detecta si el usuario está en móvil para ajustar animaciones
2. **Animación alternada**: `fade-right` para IDs pares, `fade-left` para impares
3. **Delay condicional**: Sin delay en móvil (mejor UX), con delay escalonado en desktop
4. **Key única**: Usa `proyecto.id` para evitar problemas de re-renderizado

### 4.4. Animaciones con Zoom Dinámico

**Ejemplo del proyecto:** Servicios con zoom alternado

```tsx
'use client';

import { servicios } from '../data/servicios';
import { AOSProvider } from './AOSProvider';
import useIsMobile from '../hooks/useIsMobile';

export default function Servicios() {
  const isMobile = useIsMobile();

  return (
    <section>
      <AOSProvider />
      
      <h2 className="text-center text-4xl font-bold mb-10">Servicios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {servicios.map(servicio => (
          <article
            key={servicio.id}
            // Zoom desde derecha o izquierda alternando
            data-aos={`zoom-in-${Number(servicio.id) % 2 === 0 ? 'right' : 'left'}`}
            data-aos-delay={`${isMobile ? 0 : Number(servicio.id) * 200}`}
            className="p-4 text-center text-balance"
          >
            <h3 className="text-2xl font-bold mb-2">{servicio.nombre}</h3>
            <p className="text-gris-claro mb-4">{servicio.descripcion}</p>
            <ul className="flex flex-wrap gap-2 justify-center items-center">
              {servicio.tags.map((tag, index) => (
                <li key={index} className="bg-doradoSK text-black px-2 py-1 rounded">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### 4.5. Hook Personalizado para Detección de Móvil

**Código del hook `useIsMobile`:**

```tsx
// src/hooks/useIsMobile.tsx
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si el usuario está en un dispositivo móvil.
 * 
 * Combina dos estrategias:
 * 1. User-Agent: Detecta navegadores móviles
 * 2. Tamaño de pantalla: Considera móvil si width < 768px
 * 
 * @returns {boolean} true si es móvil, false si es desktop
 * 
 * @example
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div data-aos-delay={isMobile ? 0 : 300}>
 *     Contenido
 *   </div>
 * );
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  function verificarDispositivoMovil() {
    if (typeof window === 'undefined') return;

    // Verificar por User-Agent
    const esMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    // Verificar por tamaño de pantalla (breakpoint de Tailwind 'md')
    const esMobilePorTamano = window.innerWidth < 768;

    // Combinar ambas verificaciones
    const esMovil = esMobileUserAgent || esMobilePorTamano;
    setIsMobile(esMovil);
  }

  useEffect(() => {
    // Marcar como cliente para evitar problemas de hidratación SSR
    setIsClient(true);

    // Verificar inmediatamente al montar
    verificarDispositivoMovil();

    // Agregar listener para cambios de tamaño de ventana
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      // Throttling para mejor performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(verificarDispositivoMovil, 150);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Retornar false durante SSR para evitar flash de contenido
  return isClient ? isMobile : false;
}
```

**¿Por qué usar este hook con AOS?**

- **UX Móvil Mejorada**: Animaciones excesivas en móviles pueden ser molestas
- **Performance**: Menos delays = carga percibida más rápida
- **Consistencia**: Aplicar misma lógica en todo el sitio

---

## 5. Atributos y Opciones

### 5.1. Tipos de Animaciones Disponibles

AOS incluye 50+ animaciones predefinidas. Aquí las más útiles:

#### **Fade (Fundido)**
```tsx
data-aos="fade"           // Fundido simple
data-aos="fade-up"        // Desde abajo
data-aos="fade-down"      // Desde arriba
data-aos="fade-left"      // Desde izquierda
data-aos="fade-right"     // Desde derecha
data-aos="fade-up-right"  // Diagonal
data-aos="fade-up-left"   // Diagonal
```

#### **Slide (Deslizamiento)**
```tsx
data-aos="slide-up"       // Deslizar desde abajo
data-aos="slide-down"     // Deslizar desde arriba
data-aos="slide-left"     // Deslizar desde izquierda
data-aos="slide-right"    // Deslizar desde derecha
```

#### **Zoom (Acercamiento)**
```tsx
data-aos="zoom-in"        // Acercamiento simple
data-aos="zoom-in-up"     // Acercamiento desde abajo
data-aos="zoom-in-down"   // Acercamiento desde arriba
data-aos="zoom-in-left"   // Acercamiento desde izquierda
data-aos="zoom-in-right"  // Acercamiento desde derecha
data-aos="zoom-out"       // Alejamiento
```

#### **Flip (Volteo)**
```tsx
data-aos="flip-up"        // Volteo vertical
data-aos="flip-down"      // Volteo vertical inverso
data-aos="flip-left"      // Volteo horizontal
data-aos="flip-right"     // Volteo horizontal inverso
```

### 5.2. Atributos de Configuración

Puedes sobrescribir la configuración global por elemento:

| Atributo | Descripción | Valores | Ejemplo |
|----------|-------------|---------|---------|
| `data-aos` | Tipo de animación | Ver lista arriba | `"fade-up"` |
| `data-aos-offset` | Distancia en px desde el trigger | Número (default: 120) | `"200"` |
| `data-aos-delay` | Delay en ms antes de animar | Número (0-3000) | `"300"` |
| `data-aos-duration` | Duración de la animación en ms | Número (50-3000) | `"1000"` |
| `data-aos-easing` | Función de easing | Ver [easings](#easings) | `"ease-in-sine"` |
| `data-aos-once` | Animar solo una vez | `true` / `false` | `"false"` |
| `data-aos-mirror` | Animar al hacer scroll hacia arriba también | `true` / `false` | `"true"` |
| `data-aos-anchor` | Elemento que dispara la animación | Selector CSS | `"#trigger"` |
| `data-aos-anchor-placement` | Punto de activación | Ver [placements](#placements) | `"top-center"` |

#### **Easings** {#easings}

Funciones de easing disponibles:

- **Linear**: `linear`
- **Ease**: `ease`, `ease-in`, `ease-out`, `ease-in-out`
- **Sine**: `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`
- **Quad**: `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`
- **Cubic**: `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`
- **Quart**: `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart`
- **Quint**: `ease-in-quint`, `ease-out-quint`, `ease-in-out-quint`
- **Expo**: `ease-in-expo`, `ease-out-expo`, `ease-in-out-expo`
- **Circ**: `ease-in-circ`, `ease-out-circ`, `ease-in-out-circ`
- **Back**: `ease-in-back`, `ease-out-back`, `ease-in-out-back`

#### **Anchor Placements** {#placements}

Controla cuándo se activa la animación:

- `top-bottom` (default)
- `top-center`
- `top-top`
- `center-bottom`
- `center-center`
- `center-top`
- `bottom-bottom`
- `bottom-center`
- `bottom-top`

**Visualización:**

```
viewport: ---------------------
          |                   |
          |  top-bottom ←     |  (elemento entra por abajo)
          |                   |
          |  center-center ←  |  (elemento al 50% de viewport)
          |                   |
          |  bottom-top ←     |  (elemento casi fuera por arriba)
          ---------------------
```

### 5.3. Ejemplos de Configuración Avanzada

#### **Animación Lenta con Easing Suave**
```tsx
<div
  data-aos="fade-up"
  data-aos-duration="1200"
  data-aos-easing="ease-out-cubic"
  data-aos-delay="300"
>
  Contenido con animación lenta y suave
</div>
```

#### **Animación que se Repite en Cada Scroll**
```tsx
<div
  data-aos="zoom-in"
  data-aos-once="false"
  data-aos-mirror="true"
>
  Esta animación se reproduce cada vez que haces scroll
</div>
```

#### **Animación Disparada por Otro Elemento**
```tsx
<div id="trigger-section">
  <h2>Sección Trigger</h2>
</div>

<div
  data-aos="fade-left"
  data-aos-anchor="#trigger-section"
  data-aos-anchor-placement="top-center"
>
  Esta animación se dispara cuando #trigger-section llega al centro
</div>
```

---

## 6. Ejemplos Avanzados

### 6.1. Hero Section con Secuencia de Animaciones

```tsx
export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center">
      {/* Logo aparece primero */}
      <img
        src="/logo.svg"
        alt="Logo"
        data-aos="zoom-in"
        data-aos-duration="800"
        data-aos-easing="ease-out-back"
        className="w-32 h-32 mb-6"
      />
      
      {/* Título después del logo */}
      <h1
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-duration="1000"
        className="text-6xl font-bold mb-4"
      >
        GATO ROJO LAB
      </h1>
      
      {/* Subtítulo después del título */}
      <p
        data-aos="fade-up"
        data-aos-delay="600"
        data-aos-duration="1000"
        className="text-2xl text-gray-400 mb-8"
      >
        Desarrollo Web & UX Research
      </p>
      
      {/* CTA al final */}
      <button
        data-aos="fade-up"
        data-aos-delay="900"
        data-aos-duration="800"
        className="bg-doradoSK text-black px-8 py-4 rounded-lg text-lg font-bold"
      >
        Ver Proyectos
      </button>
    </section>
  );
}
```

### 6.2. Grid de Cards con Animación Escalonada

```tsx
const cards = [
  { id: 1, title: 'Card 1', content: '...' },
  { id: 2, title: 'Card 2', content: '...' },
  { id: 3, title: 'Card 3', content: '...' },
  { id: 4, title: 'Card 4', content: '...' },
];

export default function CardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.id}
          data-aos="flip-left"
          data-aos-delay={index * 100} // 0, 100, 200, 300ms
          data-aos-duration="600"
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p>{card.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### 6.3. Testimonios con Animación Alternada

```tsx
const testimonios = [
  { id: 1, autor: 'Juan', texto: 'Excelente servicio...', avatar: '/juan.jpg' },
  { id: 2, autor: 'María', texto: 'Muy profesional...', avatar: '/maria.jpg' },
  { id: 3, autor: 'Pedro', texto: 'Lo recomiendo...', avatar: '/pedro.jpg' },
];

export default function Testimonios() {
  return (
    <section className="py-20">
      <h2
        data-aos="zoom-in"
        className="text-4xl font-bold text-center mb-16"
      >
        Lo que dicen nuestros clientes
      </h2>
      
      <div className="space-y-12">
        {testimonios.map((test, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={test.id}
              data-aos={isEven ? 'fade-right' : 'fade-left'}
              data-aos-duration="800"
              className={`flex items-center gap-6 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <img
                src={test.avatar}
                alt={test.autor}
                className="w-24 h-24 rounded-full"
              />
              <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                <p className="text-lg italic mb-2">"{test.texto}"</p>
                <p className="font-bold">— {test.autor}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

### 6.4. Estadísticas con Contador Animado

Combina AOS con un contador animado para un efecto impresionante:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { AOSProvider } from './AOSProvider';

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function Estadisticas() {
  return (
    <section className="py-20 bg-gray-900">
      <AOSProvider />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div data-aos="zoom-in" data-aos-delay="0">
          <p className="text-6xl font-bold text-doradoSK mb-2">
            <AnimatedCounter end={150} duration={2000} suffix="+" />
          </p>
          <p className="text-xl text-gray-400">Proyectos Completados</p>
        </div>
        
        <div data-aos="zoom-in" data-aos-delay="200">
          <p className="text-6xl font-bold text-doradoSK mb-2">
            <AnimatedCounter end={50} duration={2000} suffix="+" />
          </p>
          <p className="text-xl text-gray-400">Clientes Satisfechos</p>
        </div>
        
        <div data-aos="zoom-in" data-aos-delay="400">
          <p className="text-6xl font-bold text-doradoSK mb-2">
            <AnimatedCounter end={5} duration={2000} suffix=" años" />
          </p>
          <p className="text-xl text-gray-400">De Experiencia</p>
        </div>
      </div>
    </section>
  );
}
```

### 6.5. Parallax Simplificado con AOS

```tsx
export default function ParallaxSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Fondo se mueve más lento */}
      <div
        data-aos="fade-up"
        data-aos-duration="2000"
        data-aos-offset="0"
        className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-900"
      />
      
      {/* Contenido se mueve normal */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-offset="200"
        className="relative z-10 flex items-center justify-center h-full"
      >
        <h1 className="text-6xl font-bold text-white">
          Efecto Parallax Simple
        </h1>
      </div>
    </section>
  );
}
```

---

## 7. Optimización y Performance

### 7.1. Mejores Prácticas

#### ✅ **DO (Hacer)**

1. **Anima elementos clave**: Hero, títulos de sección, cards principales
2. **Usa `once: true`**: Evita re-animaciones innecesarias
3. **Limita delays**: Máximo 1 segundo para no frustrar al usuario
4. **Respeta `prefers-reduced-motion`**: AOS lo hace automáticamente
5. **Combina con `useIsMobile`**: Reduce animaciones en móviles
6. **Usa duraciones cortas**: 400-800ms es ideal, 1200ms máximo
7. **Agrupa animaciones**: Anima contenedores, no cada elemento individual

#### ❌ **DON'T (Evitar)**

1. **No animes todo**: Selecciona elementos estratégicamente
2. **Evita animaciones largas**: >1500ms se siente lento
3. **No uses delays largos**: >1000ms frustra al usuario
4. **No animes elementos hidden**: Usa `opacity-0` en lugar de `display: none`
5. **Evita `once: false` sin razón**: Causa re-renders innecesarios
6. **No combines muchas animaciones simultáneas**: Máximo 5-7 elementos a la vez

### 7.2. Configuración Optimizada de AOS

```tsx
// AOSProvider.tsx - Configuración de producción
AOS.init({
  // Animaciones cortas y fluidas
  duration: 600,
  easing: 'ease-out',
  
  // Solo una vez para mejor performance
  once: true,
  
  // Offset menor = animaciones más tempranas
  offset: 100,
  
  // Sin delay global (usar data-aos-delay por elemento)
  delay: 0,
  
  // Deshabilitar en móviles si hay problemas de performance
  disable: window.innerWidth < 768 ? true : false,
  
  // Mejor performance con mutation observer deshabilitado
  disableMutationObserver: false,
  
  // Throttle para scroll events (ms)
  throttleDelay: 99,
  
  // Debounce para resize events (ms)
  debounceDelay: 50,
});
```

### 7.3. Lazy Loading de Componentes con Animaciones

Para mejorar el tiempo de carga inicial:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load de componente pesado con animaciones
const ProyectosAnimados = lazy(() => import('./components/Proyectos'));

export default function HomePage() {
  return (
    <div>
      <h1>Mi Portafolio</h1>
      
      {/* Mostrar skeleton mientras carga */}
      <Suspense fallback={<div className="h-screen animate-pulse bg-gray-800" />}>
        <ProyectosAnimados />
      </Suspense>
    </div>
  );
}
```

### 7.4. Medir Performance de Animaciones

Usa Chrome DevTools para analizar el rendimiento:

```tsx
'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Observar todas las animaciones AOS
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('aos')) {
          console.log('AOS Animation:', entry.name, entry.duration + 'ms');
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);

  return null;
}
```

### 7.5. Reducir Bundle Size

Si solo usas algunas animaciones, puedes importar CSS personalizado:

```css
/* src/styles/aos-custom.css - Solo animaciones necesarias */

/* Fade Up */
[data-aos='fade-up'] {
  transform: translate3d(0, 40px, 0);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos='fade-up'].aos-animate {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

/* Zoom In */
[data-aos='zoom-in'] {
  transform: scale(0.6);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos='zoom-in'].aos-animate {
  transform: scale(1);
  opacity: 1;
}
```

Luego importa solo tu CSS personalizado en lugar de `aos/dist/aos.css`.

---

## 8. Troubleshooting

### 8.1. Problemas Comunes y Soluciones

#### **Problema: Animaciones no se activan**

**Posibles causas:**

1. **AOSProvider no está montado**
   ```tsx
   // ✅ Solución: Asegúrate de tener <AOSProvider /> en el layout
   import { AOSProvider } from './AOSProvider';
   
   export default function Layout({ children }) {
     return (
       <>
         <AOSProvider /> {/* Importante */}
         {children}
       </>
     );
   }
   ```

2. **CSS de AOS no cargado**
   ```tsx
   // ✅ Solución: Verifica que estés importando el CSS
   import 'aos/dist/aos.css';
   ```

3. **Elementos fuera del viewport inicial**
   ```tsx
   // ✅ Solución: Ajusta el offset
   data-aos-offset="50" // Activar antes
   ```

#### **Problema: Hidratación mismatch en SSR**

**Error típico:**
```
Warning: Expected server HTML to contain a matching <div> in <section>
```

**Solución:**

```tsx
// ❌ Incorrecto: Usar AOS en server component
export default function Proyectos() {
  return <div data-aos="fade-up">...</div>;
}

// ✅ Correcto: Marcar como cliente
'use client';

export default function Proyectos() {
  return (
    <>
      <AOSProvider />
      <div data-aos="fade-up">...</div>
    </>
  );
}
```

#### **Problema: Animaciones se ejecutan antes de tiempo**

**Solución:**

```tsx
// Aumenta el offset para que se disparen más tarde
AOS.init({
  offset: 200, // En lugar de 120 default
  anchorPlacement: 'top-bottom',
});
```

#### **Problema: Animaciones no funcionan en elementos dinámicos**

**Solución:**

```tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';

export default function DynamicList({ items }) {
  useEffect(() => {
    // Refrescar AOS cuando cambian los items
    AOS.refresh();
  }, [items]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} data-aos="fade-up">
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

#### **Problema: Performance degradada en móviles**

**Solución:**

```tsx
// Opción 1: Deshabilitar AOS en móviles
AOS.init({
  disable: 'mobile', // o window.innerWidth < 768
});

// Opción 2: Usar hook personalizado
import useIsMobile from '../hooks/useIsMobile';

export default function Component() {
  const isMobile = useIsMobile();
  
  return (
    <div data-aos={isMobile ? undefined : 'fade-up'}>
      Contenido
    </div>
  );
}
```

### 8.2. Debugging

### 8.2. Debugging en DevTools

#### **Verificar clases AOS**

```javascript
// En la consola del navegador
// Ver todos los elementos con AOS
document.querySelectorAll('[data-aos]');

// Ver elementos con animación activa
document.querySelectorAll('.aos-animate');

// Forzar refresh manual
AOS.refresh();
```

#### **Inspeccionar inicialización**

```tsx
// AOSProvider.tsx - Versión con logging
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AOSProvider() {
  useEffect(() => {
    console.log('[AOS] Inicializando...');
    
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
    });
    
    console.log('[AOS] Inicializado correctamente');

    return () => {
      console.log('[AOS] Limpiando...');
      AOS.refreshHard();
    };
  }, []);

  return null;
}
```

### 8.3. Testing de Animaciones

Para testear componentes con AOS en Vitest/Jest:

```tsx
// __tests__/Proyectos.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Proyectos from '../components/Proyectos';

// Mock de AOS
vi.mock('aos', () => ({
  default: {
    init: vi.fn(),
    refresh: vi.fn(),
    refreshHard: vi.fn(),
  },
}));

// Mock de useIsMobile
vi.mock('../hooks/useIsMobile', () => ({
  default: () => false, // Simular desktop
}));

describe('Proyectos Component', () => {
  it('should render projects with AOS attributes', () => {
    render(<Proyectos />);
    
    const articles = screen.getAllByRole('article');
    
    // Verificar que tienen atributos data-aos
    articles.forEach((article) => {
      expect(article).toHaveAttribute('data-aos');
      expect(article).toHaveAttribute('data-aos-delay');
    });
  });
});
```

---

## 9. Server Components vs Client Components en Waku

### 9.1. ¿Qué son Server Components?

En **Waku** (y React 19), los componentes son **Server Components por defecto**. Se ejecutan solo en el servidor, reduciendo el JavaScript enviado al cliente.

**Ventajas:**

✅ Mejor performance (menos JS en el navegador)  
✅ Acceso directo a bases de datos y APIs  
✅ SEO mejorado (contenido pre-renderizado)  
✅ Menor bundle size  

**Limitaciones:**

❌ No pueden usar hooks de React (`useState`, `useEffect`, etc.)  
❌ No pueden acceder al DOM (`window`, `document`, etc.)  
❌ No pueden manejar eventos (`onClick`, `onChange`, etc.)  

### 9.2. Cuándo usar `'use client'`

**Marca un componente como Client Component cuando necesites:**

#### ✅ **Hooks de React**
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### ✅ **Event Handlers**
```tsx
'use client';

export default function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // ...
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### ✅ **APIs del Navegador**
```tsx
'use client';

export default function ThemeToggle() {
  const toggleTheme = () => {
    localStorage.setItem('theme', 'dark');
  };
  
  return <button onClick={toggleTheme}>Toggle</button>;
}
```

#### ✅ **Librerías que requieren el cliente**
```tsx
'use client';

import AOS from 'aos';
import { useEffect } from 'react';

export function AOSProvider() {
  useEffect(() => AOS.init(), []);
  return null;
}
```

### 9.3. Cuándo NO usar `'use client'`

#### ❌ **Componentes solo de presentación**
```tsx
// ✅ Server Component (sin 'use client')
export default function Card({ title, content }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
```

#### ❌ **Componentes con data fetching del servidor**
```tsx
// ✅ Server Component (sin 'use client')
import { db } from './db';

export default async function Proyectos() {
  const proyectos = await db.proyectos.findMany();
  
  return (
    <div>
      {proyectos.map((p) => (
        <div key={p.id}>{p.nombre}</div>
      ))}
    </div>
  );
}
```

#### ❌ **Animaciones CSS puras**
```tsx
// ✅ Server Component (sin 'use client')
export default function AnimatedCard() {
  return (
    <div className="animate-fade-in"> {/* CSS animation */}
      Contenido
    </div>
  );
}
```

### 9.4. Patrón: Componente Híbrido

**Problema:** Necesitas animaciones AOS pero quieres mantener el componente como Server Component.

**Solución:** Separa la lógica cliente en un componente wrapper.

```tsx
// components/ProyectosWrapper.tsx
'use client';

import { AOSProvider } from './AOSProvider';

export function ProyectosWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AOSProvider />
      {children}
    </>
  );
}

// components/Proyectos.tsx (Server Component)
import { ProyectosWrapper } from './ProyectosWrapper';
import { db } from './db';

export default async function Proyectos() {
  // Fetch de datos en el servidor
  const proyectos = await db.proyectos.findMany();
  
  return (
    <ProyectosWrapper>
      <section>
        {proyectos.map((proyecto) => (
          <article key={proyecto.id} data-aos="fade-up">
            <h3>{proyecto.nombre}</h3>
            <p>{proyecto.descripcion}</p>
          </article>
        ))}
      </section>
    </ProyectosWrapper>
  );
}
```

### 9.5. Ejemplos del Proyecto

#### **Ejemplo 1: Client Component (usa hooks y eventos)**

```tsx
// src/components/Proyectos.tsx
'use client';

import { AOSProvider } from './AOSProvider';
import { proyectos } from '../data/proyectos';
import useIsMobile from '../hooks/useIsMobile';

export default function Proyectos() {
  // ⚠️ Necesita 'use client' por useIsMobile (hook)
  const isMobile = useIsMobile();

  return (
    <section>
      {/* ⚠️ Necesita 'use client' por AOSProvider */}
      <AOSProvider />
      
      <div>
        {proyectos.map((proyecto) => (
          <article
            key={proyecto.id}
            data-aos="fade-up"
            data-aos-delay={isMobile ? 0 : Number(proyecto.id) * 200}
          >
            {proyecto.nombre}
          </article>
        ))}
      </div>
    </section>
  );
}
```

#### **Ejemplo 2: Server Component (solo presentación)**

```tsx
// src/components/Card.tsx
// ✅ NO necesita 'use client'

interface CardProps {
  title: string;
  description: string;
  image: string;
}

export default function Card({ title, description, image }: CardProps) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

#### **Ejemplo 3: Client Component (manipula DOM)**

```tsx
// src/components/AOSProvider.tsx
'use client'; // ⚠️ Obligatorio por useEffect y AOS

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function AOSProvider() {
  useEffect(() => {
    // Manipulación del DOM
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

### 9.6. Mejores Prácticas

#### ✅ **DO (Hacer)**

1. **Usa Server Components por defecto** - Solo añade `'use client'` cuando sea necesario
2. **Documenta el por qué** - Añade comentario JSDoc explicando por qué es cliente
3. **Minimiza la frontera cliente** - Marca el componente más pequeño posible como cliente
4. **Separa lógica cliente** - Crea wrappers pequeños en lugar de marcar todo como cliente

#### ❌ **DON'T (Evitar)**

1. **No añadas `'use client'` "por si acaso"** - Evalúa si realmente lo necesitas
2. **No marques layouts completos como cliente** - Solo componentes específicos
3. **Evita marcar componentes padres** - Marca el hijo que realmente necesita ser cliente
4. **No uses `'use client'` para animaciones CSS** - Solo para animaciones JS

---

## 10. Checklist de Implementación

### ✅ Instalación
- [ ] Ejecutar `pnpm add aos @types/aos`
- [ ] Verificar que aparezcan en `package.json`

### ✅ Configuración
- [ ] Crear `src/components/AOSProvider.tsx`
- [ ] Importar CSS: `import 'aos/dist/aos.css'`
- [ ] Marcar componente como `'use client'`
- [ ] Configurar `AOS.init()` en `useEffect`

### ✅ Integración
- [ ] Añadir `<AOSProvider />` en layout raíz O en cada componente
- [ ] Decidir: ¿global o local?

### ✅ Uso
- [ ] Añadir atributos `data-aos` a elementos clave
- [ ] Configurar delays escalonados con `data-aos-delay`
- [ ] Ajustar duraciones con `data-aos-duration`
- [ ] Probar animaciones en navegador

### ✅ Optimización
- [ ] Usar `once: true` para animaciones de una sola vez
- [ ] Implementar `useIsMobile` para UX móvil
- [ ] Reducir cantidad de animaciones simultáneas
- [ ] Verificar performance con DevTools

### ✅ Testing
- [ ] Probar en Chrome, Firefox, Safari
- [ ] Verificar en móvil y tablet
- [ ] Testear con `prefers-reduced-motion` activado
- [ ] Verificar que no haya errores de hidratación SSR

### ✅ Accesibilidad
- [ ] Respetar `prefers-reduced-motion` (AOS lo hace automáticamente)
- [ ] No depender de animaciones para comunicar información crítica
- [ ] Asegurar que el contenido sea accesible sin JavaScript

---

## 11. Recursos Adicionales

### 📚 Documentación Oficial
- [AOS GitHub](https://github.com/michalsnik/aos) - Repositorio oficial
- [AOS Demos](https://michalsnik.github.io/aos/) - Ejemplos interactivos
- [Waku Docs](https://waku.gg/docs) - Framework React RSC
- [React 19 Docs](https://react.dev/) - React Server Components

### 🎨 Inspiración
- [Awwwards](https://www.awwwards.com/) - Sitios web con animaciones impresionantes
- [CodePen AOS](https://codepen.io/tag/aos) - Ejemplos de comunidad
- [Dribbble Animations](https://dribbble.com/tags/scroll-animation) - Diseños animados

### 🛠️ Herramientas
- [Cubic Bezier Generator](https://cubic-bezier.com/) - Crear easings personalizados
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/) - Analizar performance
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug de componentes

### 📖 Artículos Recomendados
- [Understanding React Server Components](https://www.joshwcomeau.com/react/server-components/)
- [Web Animation Best Practices](https://web.dev/animations/)
- [Accessibility and Motion](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/)

---

## 12. Conclusión

**AOS** es una herramienta poderosa para añadir animaciones scroll-triggered a tu proyecto React de forma sencilla. Siguiendo esta guía:

✅ Instalaste y configuraste AOS correctamente en un proyecto React con SSR  
✅ Aprendiste a usar atributos `data-aos` y sus opciones  
✅ Implementaste patrones avanzados (animaciones alternadas, delays dinámicos)  
✅ Optimizaste performance con `useIsMobile` y configuración apropiada  
✅ Entendiste cuándo usar `'use client'` en Waku  
✅ Debugging y troubleshooting de problemas comunes  

**Recuerda:**  
🎯 Menos es más - Anima estratégicamente  
⚡ Performance primero - Usa `once: true`  
♿ Accesibilidad siempre - Respeta `prefers-reduced-motion`  
📱 Adapta a móvil - Usa `useIsMobile` para mejor UX  

---

**¿Preguntas o problemas?** Revisa la sección de [Troubleshooting](#8-troubleshooting) o abre un issue en el repositorio del proyecto.

**¡Feliz animación!** 🎨✨

---

*Última actualización: Noviembre 2025*  
*Autor: Ariel | GatoRojoLab*
