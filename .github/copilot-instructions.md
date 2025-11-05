## Project overview

- Siempre responda en español
- Este es un proyecto desarrollado con React, TypeScript, Tailwind CSS, Zustand y Waku como meta-framework.
- Se trata de una portafolio de un desarrollador web y UX Designer enfocado en investigación.

## Build and test commands

- Este proyecto usa pnpm como gestor de paquetes. NO usar npm.
- Use pnpm add <package_name> para instalar nuevas dependencias.
- Use pnpm install para instalar las dependencias del proyecto.
- Use pnpm dev para iniciar el servidor de desarrollo.
- Use pnpm build para construir el proyecto para producción.

## Code style guidelines

- Cada vez que genere un nuevo componente, asegúrese de que el nombre del archivo comience con una letra mayúscula y que el nombre del componente coincida con el nombre del archivo.
- Cada vez que genere una función agregue un comentario JSDoc encima de la función, incluyendo un ejemplo de uso.

## Testing instructions

- Este proyecto utiliza Vitest para las pruebas.
- Use pnpm test para ejecutar las pruebas.
- Use react-testing-library para las pruebas de componentes React.
- Use vitest para las pruebas unitarias.

## Security considerations

- Asegúrese de validar y sanitizar todas las entradas del usuario.
- Evite almacenar información sensible en el frontend.
- Use HTTPS para todas las comunicaciones de red.

## Commit message guidelines

- Use el formato de mensaje de commit convencional.
- Comience el mensaje de commit con un verbo en tiempo presente (por ejemplo, "agrega", "corrige", "elimina").
- Use minúsculas para el mensaje de commit.
- Sea breve y conciso, idealmente menos de 50 caracteres.
- Use el cuerpo del mensaje de commit para explicar el "qué" y el "por qué" del cambio, si es necesario.
- Use viñetas para listar cambios múltiples en el cuerpo del mensaje de commit.
- Use el prefijo "feat:" para nuevas características, "fix:" para correcciones de errores, "docs:" para cambios en la documentación, "style:" para cambios de formato, "refactor:" para cambios de código que no agregan ni corrigen funcionalidades, "test:" para agregar o corregir pruebas, y "chore:" para tareas de mantenimiento.
- Hágalo en español siempre.
- Ejemplo de mensaje de commit:

  feat: agrega configuración de Prettier e integra Tailwind CSS
  - Agrega archivo de configuración de Prettier para formato de código consistente.
  - Elimina activos SVG no utilizados de Vite y React.
  - Limpia el componente App, reemplazando el contenido predeterminado con un encabezado simple.
  - Elimina estilos de App.css y reemplaza los estilos globales con Tailwind CSS.
  - Actualiza main.tsx para asegurar importaciones y formato adecuados.
  - Ajusta la configuración de Vite para incluir el plugin de Tailwind CSS.
  - Simplifica las referencias en tsconfig.json para mayor claridad.
