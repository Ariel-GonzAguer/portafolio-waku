# MarqueeTecnologias - Componente React

Un componente React reutilizable que muestra una marquesina animada de tecnologías con sus iconos.

## Características

- ✨ Animación continua de tecnologías
- 🎨 Estilos personalizables por tecnología
- 📱 Diseño responsive
- 🎯 Hover effects
- ⚡ Optimizado para rendimiento
- 🔧 Altamente configurable

## Instalación

1. Copia los archivos `MarqueeTecnologias.tsx` y `MarqueeTecnologias.css` a tu proyecto
2. Importa el componente y los estilos:

```tsx
import MarqueeTecnologias from './components/MarqueeTecnologias';
import './components/MarqueeTecnologias.css';
```

## Uso Básico

```tsx
import React from 'react';
import MarqueeTecnologias from './components/MarqueeTecnologias';

function App() {
  return (
    <div className="App">
      <MarqueeTecnologias />
    </div>
  );
}

export default App;
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `technologies` | `Technology[]` | Lista por defecto | Array de tecnologías a mostrar |
| `title` | `string` | "Tecnologías disponibles" | Título de la sección |
| `animationDuration` | `number` | 45 | Duración de la animación en segundos |
| `className` | `string` | "" | Clase CSS adicional para el contenedor |

## Interface Technology

```tsx
interface Technology {
  name: string;  // Nombre de la tecnología
  icon: string;  // Ruta al icono (SVG, PNG, etc.)
}
```

## Personalización

### Tecnologías Personalizadas

```tsx
const customTechnologies = [
  { name: "Next.js", icon: "/icons/nextjs.svg" },
  { name: "Node.js", icon: "/icons/nodejs.svg" },
  { name: "MongoDB", icon: "/icons/mongodb.svg" }
];

<MarqueeTecnologias technologies={customTechnologies} />
```

### Título Personalizado

```tsx
<MarqueeTecnologias title="Stack Tecnológico" />
```

### Velocidad de Animación

```tsx
<MarqueeTecnologias animationDuration={30} /> // Más rápido
<MarqueeTecnologias animationDuration={60} /> // Más lento
```

### Clase CSS Personalizada

```tsx
<MarqueeTecnologias className="my-custom-marquee" />
```

## Estilos Especiales por Tecnología

El componente incluye estilos especiales para ciertas tecnologías:

- **GitHub**: Fondo blanco, borde circular, sombra inset negra
- **Vercel**: Fondo blanco, padding de 2px
- **JavaScript**: Borde negro de 1px

## Responsive

- **Desktop**: Ancho máximo 600px, íconos de 40px
- **Mobile**: Ancho 90%, íconos de 35px, gaps reducidos

## Dependencias

- React 16.8+ (hooks)
- CSS moderno (mask-image, backdrop-filter)

## Notas

- Los iconos deben estar disponibles en las rutas especificadas
- La animación se pausa al hacer hover sobre el contenedor
- Compatible con CSP (sin estilos inline problemáticos)