# INSTRUCCIONES INMEDIATAS: Instalación y Configuración

## ⚠️ ACCIÓN REQUERIDA

Los componentes de chatbot están creados pero **requieren instalación de dependencias**.

### Paso 1: Instalar Dependencias de IA

Ejecuta este comando en la raíz del proyecto:

```bash
pnpm add openai @google/generative-ai
```

### Paso 2: Crear Archivo de Variables de Entorno

Crea el archivo `.env.local` en la raíz del proyecto con este contenido:

```bash
# OpenAI API Key (obtener en: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Gemini API Key (obtener en: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx

# Variables existentes de EmailJS
EMAILJS_PUBLIC_KEY=tu_public_key
EMAILJS_PRIVATE_KEY=tu_private_key
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_TEMPLATE_ID=tu_template_id
```

### Paso 3: Obtener API Keys

#### OpenAI:
1. Ve a https://platform.openai.com/api-keys
2. Crea una cuenta o inicia sesión
3. Clic en "Create new secret key"
4. Copia la key (empieza con `sk-proj-`)
5. **IMPORTANTE**: Configura límites de uso en el dashboard para evitar costos inesperados

#### Gemini:
1. Ve a https://aistudio.google.com/app/apikey
2. Inicia sesión con Google
3. Clic en "Get API key" o "Create API key"
4. Copia la key (empieza con `AIza`)
5. Es gratis: 15 requests/minuto, 1500 requests/día

### Paso 4: Configurar en Vercel (para producción)

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Añade cada variable:
   - Variable name: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxx`
   - Environments: ✅ Production, ✅ Preview
   - Clic "Save"
4. Repite para `GEMINI_API_KEY`
5. **Redeploy** el proyecto (Deployments > ... > Redeploy)

### Paso 5: Probar Localmente

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir en navegador
# http://localhost:3000
```

### Paso 6: Usar los Chatbots

Para añadir el chatbot a una página:

```tsx
// src/pages/index.tsx
import ChatbotOpenAI from '../components/ChatbotOpenAI';

export default function HomePage() {
  return (
    <div>
      {/* Tu contenido existente */}
      
      {/* Chatbot flotante (aparecerá en esquina inferior derecha) */}
      <ChatbotOpenAI />
    </div>
  );
}
```

O usa el de Gemini:

```tsx
import ChatbotGemini from '../components/ChatbotGemini';

<ChatbotGemini />
```

---

## 📋 Checklist

- [ ] `pnpm add openai @google/generative-ai` ejecutado
- [ ] Archivo `.env.local` creado con las 6 variables
- [ ] API keys de OpenAI y Gemini obtenidas
- [ ] `pnpm dev` funciona sin errores
- [ ] Chatbot probado en navegador local
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy realizado y chatbot funcional en producción

---

## 🆘 Si Algo Falla

### Error: "Cannot find module 'openai'"
→ Ejecuta `pnpm install` después de añadir las dependencias

### Error: "API key is required"
→ Verifica que `.env.local` esté en la raíz del proyecto (no en `src/`)

### Error: "Rate limit exceeded"
→ OpenAI tier gratuito tiene límites muy bajos. Espera 1 minuto o upgradea tu cuenta.

### El chatbot no envía mensajes
→ Abre DevTools (F12) > Console > busca errores
→ Verifica que las env vars estén cargadas: `console.log(process.env.OPENAI_API_KEY?.slice(0,10))`

---

## 📖 Documentación Completa

Para información detallada sobre personalización, seguridad, y optimización:
- Ver: `documentacion/README_CHATBOTS.md`
- Ver: `documentacion/GUIA_SERVICIO_IA.md`

---

**¿Todo listo?** Ejecuta `pnpm add openai @google/generative-ai` y continúa con el siguiente paso! 🚀
