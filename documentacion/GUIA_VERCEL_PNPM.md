# Configuración de Vercel para usar pnpm

## Problema

Vercel está intentando usar yarn en lugar de pnpm, causando el error:

```
"yarn" no se reconoce como un comando interno o externo
```

## Error: build_utils_1.getSpawnOptions is not a function

### Síntomas

Este error ocurre durante el deployment en Vercel y está relacionado con incompatibilidades entre el sistema de API routes de Waku y Vercel Functions.

### Causa raíz

Waku tiene su **propio sistema de API routes** que usa el estándar Web API (`Request`/`Response`), diferente al de Vercel (`VercelRequest`/`VercelResponse`). Las API routes de Waku deben:

- Estar en `src/pages/api/` (no en `/api/` directamente)
- Exportar handlers como `POST`, `GET`, etc. que retornan `Response`
- Usar `Response.json()` en lugar de `res.json()`

### Soluciones aplicadas

1. **Mover API routes a la estructura de Waku**: Las rutas API deben estar en `src/pages/api/` y usar Web Standards.

2. **Eliminar configuración de Vercel Functions**: Remover la sección `functions` de `vercel.json` ya que Waku maneja las rutas automáticamente.

3. **Actualizar utilidades de seguridad**: Adaptar funciones como `getClientIp` para trabajar con `Headers` estándar.

4. **Actualizar @vercel/node** (si se usa): Ejecutar `pnpm update @vercel/node` para la versión más reciente.

5. **Verificar versiones de Node.js**: Asegurarse de usar Node.js 18.x o superior en Vercel.

## Solución

### Opción 1: Configurar en Vercel Dashboard (Recomendado)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Build & Development Settings**
3. En **Build Command**, cambia de `yarn build` a:
   ```bash
   pnpm build
   ```
4. En **Install Command**, cambia de `yarn install` a:
   ```bash
   pnpm install --frozen-lockfile
   ```
5. En **Node.js Version**, asegúrate de usar una versión compatible (18.x o superior)

### Opción 2: Usar corepack para pnpm@10.x

Si quieres usar pnpm@10.x, ejecuta:

```bash
# Instalar corepack si no está instalado
npm install -g corepack

# Habilitar corepack
corepack enable

# Preparar pnpm@10.x
corepack prepare pnpm@10.x --activate
```

### Opción 3: Archivo vercel.json

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "waku",
  "functions": {
    "api/*.ts": {
      "runtime": "@vercel/node@2.0.0"
    }
  }
}
```

## Verificación

Después de aplicar cualquiera de estas opciones:

1. Haz push a tu rama principal
2. Ve a la pestaña **Deployments** en Vercel
3. El próximo deployment debería usar pnpm correctamente

## Comandos útiles

```bash
# Ver versión de pnpm
pnpm --version

# Ver configuración de corepack
corepack --version

# Listar versiones disponibles de pnpm
corepack prepare --help
```

## API Routes en Waku

### Estructura correcta

```
src/
  pages/
    api/
      enviarCorreo.ts  ← API route de Waku
```

### Ejemplo de API route de Waku

```typescript
// src/pages/api/contact.ts
export const POST = async (request: Request): Promise<Response> => {
  const body = await request.json();

  // Tu lógica aquí

  return Response.json({ message: 'Success' }, { status: 200 });
};
```

### Diferencias clave entre Waku y Vercel Functions

| Aspecto        | Waku                                 | Vercel Functions                     |
| -------------- | ------------------------------------ | ------------------------------------ |
| Ubicación      | `src/pages/api/`                     | `/api/`                              |
| Request        | `Request` (Web API)                  | `VercelRequest`                      |
| Response       | `Response` (Web API)                 | `VercelResponse`                     |
| Handler export | `export const POST = ...`            | `export default function handler...` |
| Headers        | `request.headers.get('header-name')` | `req.headers['header-name']`         |

## Notas importantes

- Asegúrate de que `pnpm-lock.yaml` esté committeado en tu repositorio
- Si usas corepack, el archivo `package.json` debe tener `"packageManager"` especificado
- Vercel detecta automáticamente el package manager basado en los archivos lock presentes
- **Para proyectos Waku**: NO especificar `"framework"` en `vercel.json` (no está soportado oficialmente)
- **Para proyectos Waku**: NO usar la sección `functions` en `vercel.json` - Waku maneja las API routes automáticamente
- Las API routes de Waku se despliegan automáticamente como Vercel Functions durante el build
