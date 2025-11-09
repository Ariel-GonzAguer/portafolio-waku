# Configuración de Vercel para usar pnpm

## Problema
Vercel está intentando usar yarn en lugar de pnpm, causando el error:
```
"yarn" no se reconoce como un comando interno o externo
```

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
  "framework": null
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