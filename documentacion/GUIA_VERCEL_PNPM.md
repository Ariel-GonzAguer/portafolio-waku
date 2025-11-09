# Configuración de Vercel para usar pnpm

## Problema
Vercel está intentando usar yarn en lugar de pnpm, causando el error:
```
"yarn" no se reconoce como un comando interno o externo
```

## Error: build_utils_1.getSpawnOptions is not a function

### Síntomas
Este error ocurre durante el deployment en Vercel y está relacionado con incompatibilidades en las utilidades de build.

### Soluciones aplicadas

1. **Actualizar @vercel/node**: Ejecutar `pnpm update @vercel/node` para usar la versión más reciente.

2. **Configurar framework en vercel.json**:
   ```json
   {
     "framework": "waku",
     "buildCommand": "pnpm build",
     "installCommand": "pnpm install --frozen-lockfile"
   }
   ```

3. **Verificar versiones de Node.js**: Asegurarse de usar Node.js 18.x o superior en Vercel.

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

## Notas importantes

- Asegúrate de que `pnpm-lock.yaml` esté committeado en tu repositorio
- Si usas corepack, el archivo `package.json` debe tener `"packageManager"` especificado
- Vercel detecta automáticamente el package manager basado en los archivos lock presentes
- Para proyectos Waku, especificar `"framework": "waku"` en `vercel.json` puede resolver problemas de build