# Implementación de Chatbots con IA

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
# Para OpenAI
pnpm add openai

# Para Gemini
pnpm add @google/generative-ai

# Utilidades adicionales
pnpm add zod nanoid
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# OpenAI (obtener en: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Gemini (obtener en: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE**: Nunca commitear el `.env.local` al repositorio. Añádelo a `.gitignore`.

### 3. Configurar en Vercel (Producción)

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Añade las variables:
   - `OPENAI_API_KEY` (value: tu key)
   - `GEMINI_API_KEY` (value: tu key)
4. Scope: Production (y Preview si quieres testing)
5. Redeploy el proyecto

---

## 📁 Archivos del Proyecto

```
src/
├── components/
│   ├── ChatbotOpenAI.tsx     # Componente cliente OpenAI
│   └── ChatbotGemini.tsx     # Componente cliente Gemini
└── pages/
    └── api/
        ├── chat-openai.ts    # API handler OpenAI
        └── chat-gemini.ts    # API handler Gemini
```

---

## 💬 Uso de los Componentes

### Chatbot OpenAI

```tsx
// src/pages/index.tsx o cualquier página
import ChatbotOpenAI from '../components/ChatbotOpenAI';

export default function HomePage() {
  return (
    <div>
      {/* Tu contenido */}
      <ChatbotOpenAI />
    </div>
  );
}
```

### Chatbot Gemini

```tsx
// src/pages/index.tsx o cualquier página
import ChatbotGemini from '../components/ChatbotGemini';

export default function HomePage() {
  return (
    <div>
      {/* Tu contenido */}
      <ChatbotGemini />
    </div>
  );
}
```

---

## ⚙️ Personalización

### 1. Cambiar el System Prompt

Edita el `SYSTEM_PROMPT` o `SYSTEM_INSTRUCTION` en los archivos de API:

```typescript
// src/pages/api/chat-openai.ts o chat-gemini.ts
const SYSTEM_PROMPT = `Eres un asistente virtual de [TU EMPRESA].

Tu tono debe ser:
- [Describe el tono]

Puedes ayudar con:
- [Lista de capacidades]

...
`;
```

### 2. Ajustar Parámetros del Modelo

**OpenAI** (`src/pages/api/chat-openai.ts`):

```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',           // 'gpt-3.5-turbo' para menor costo
  temperature: 0.7,          // 0-2, mayor = más creativo
  max_tokens: 500,           // Límite de respuesta
  top_p: 0.9,
  frequency_penalty: 0.3,    // Evita repetición
  presence_penalty: 0.2,
  stream: true,
});
```

**Gemini** (`src/pages/api/chat-gemini.ts`):

```typescript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',  // o 'gemini-1.5-pro'
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 500,
  },
});
```

### 3. Modificar UI

Los componentes usan Tailwind CSS. Puedes ajustar:

- **Colores**: Cambia `bg-doradoSK` (OpenAI) o `bg-blue-600` (Gemini)
- **Posición**: Ajusta `bottom-6 right-6` del botón flotante
- **Tamaño**: Cambia `w-96` de la ventana de chat
- **Mensajes de bienvenida**: Edita el texto cuando `messages.length === 0`

---

## 🔐 Seguridad y Rate Limiting

### Rate Limiting Actual

Ambos handlers implementan rate limiting básico (10 req/min por IP). Para producción, considera:

**Opción 1: Vercel Edge Config + KV**
```bash
pnpm add @vercel/edge-config @vercel/kv
```

**Opción 2: Upstash Redis**
```bash
pnpm add @upstash/redis
```

Ejemplo con Upstash:

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60); // 60 segundos
  }
  
  return count <= 10;
}
```

### Sanitización de Input

Los handlers ya incluyen:
- Límite de longitud de mensaje (500 caracteres)
- Límite de historial (últimos 10 mensajes)
- Escape básico de caracteres

Para mayor seguridad, añade validación con Zod:

```typescript
import { z } from 'zod';

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'model']),
      content: z.string().min(1).max(500),
    })
  ).max(20),
});

// En el handler
const validated = messageSchema.safeParse(body);
if (!validated.success) {
  return Response.json({ error: 'Input inválido' }, { status: 400 });
}
```

---

## 📊 Analytics y Monitoreo

### Añadir Logging

Añade al final de cada respuesta exitosa:

```typescript
// src/pages/api/chat-openai.ts (después del streaming)
await logChatInteraction({
  userId: clientIp,
  messageCount: messages.length,
  responseTime: Date.now() - startTime,
  model: 'gpt-4o',
  tokensUsed: 0, // Obtener de response si está disponible
});
```

### Tracking con Google Analytics

```typescript
// En el componente cliente (ChatbotOpenAI.tsx)
const handleSubmit = async (e) => {
  // ... código existente ...
  
  // Después de recibir respuesta
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_message', {
      event_category: 'Chatbot',
      event_label: 'OpenAI',
      value: messages.length,
    });
  }
};
```

---

## 💰 Gestión de Costos

### Monitoreo de Uso

**OpenAI**: https://platform.openai.com/usage
**Gemini**: https://aistudio.google.com/apikey (ver usage)

### Estrategias de Optimización

1. **Usar modelos más económicos**:
   - OpenAI: `gpt-3.5-turbo` en lugar de `gpt-4o`
   - Gemini: `gemini-1.5-flash` en lugar de `1.5-pro`

2. **Reducir tokens**:
   ```typescript
   max_tokens: 300, // En lugar de 500
   ```

3. **Limitar historial**:
   ```typescript
   const sanitizedMessages = messages.slice(-5); // Solo 5 mensajes
   ```

4. **Implementar caché** (para preguntas frecuentes):
   ```typescript
   const cachedResponses = new Map<string, string>();
   
   const cacheKey = `${lastMessage.content.toLowerCase().trim()}`;
   if (cachedResponses.has(cacheKey)) {
     return Response.json({ 
       content: cachedResponses.get(cacheKey) 
     });
   }
   ```

### Alertas de Presupuesto

Crea un script de monitoreo:

```typescript
// scripts/check-ai-costs.ts
import OpenAI from 'openai';

const openai = new OpenAI();

async function checkCosts() {
  // Implementar lógica de consulta de costos
  // Enviar alerta si excede umbral
}

checkCosts();
```

Ejecutar diariamente con GitHub Actions o cron job.

---

## 🧪 Testing Local

### 1. Iniciar servidor de desarrollo

```bash
pnpm dev
```

### 2. Probar el chatbot

Abre http://localhost:3000 y haz clic en el botón flotante del chatbot.

### 3. Verificar logs

Los handlers imprimen logs en la consola:
```
[OpenAI] Nueva solicitud de 127.0.0.1, 3 mensajes
```

### 4. Testing con curl

```bash
# OpenAI
curl -X POST http://localhost:3000/api/chat-openai \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "¿Qué servicios ofrecen?"}
    ]
  }'

# Gemini
curl -X POST http://localhost:3000/api/chat-gemini \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "parts": [{"text": "¿Qué servicios ofrecen?"}]}
    ]
  }'
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'openai'"

```bash
pnpm add openai
```

### Error: "API key inválido"

Verifica que:
1. La variable de entorno esté en `.env.local`
2. El formato sea correcto (sin espacios ni comillas extra)
3. La key sea válida (prueba en OpenAI Playground)

### Error: "Rate limit excedido"

OpenAI tier gratuito: 3 RPM (requests per minute)
Solución: Esperar 1 minuto o upgradear a tier pago.

### El chatbot no aparece en producción

1. Verifica que las env vars estén en Vercel
2. Chequea los logs de la función en Vercel Dashboard
3. Revisa la consola del navegador

### CSP bloquea el chatbot

Si tu Content-Security-Policy es estricta:
```typescript
// Añadir a headers permitidos
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com;
```

---

## 🚀 Deploy a Producción

### 1. Commit cambios

```bash
git add .
git commit -m "feat: añade chatbots con OpenAI y Gemini"
git push origin main
```

### 2. Vercel desplegará automáticamente

Espera el deploy y verifica en:
https://tu-dominio.vercel.app

### 3. Monitorear primeras horas

- Revisar logs en Vercel Dashboard
- Probar casos de uso principales
- Verificar costos en OpenAI/Gemini

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [OpenAI Cookbook](https://cookbook.openai.com/)

### Tutoriales Recomendados
- [Building a Chatbot with OpenAI](https://platform.openai.com/docs/guides/chat)
- [Gemini Quickstart](https://ai.google.dev/gemini-api/docs/get-started/tutorial)

### Comunidad
- [OpenAI Community Forum](https://community.openai.com/)
- [r/OpenAI](https://reddit.com/r/OpenAI)
- [Google AI Discord](https://discord.gg/google-ai)

---

## ✅ Checklist Pre-Entrega Cliente

- [ ] Variables de entorno configuradas en producción
- [ ] System prompt personalizado según negocio del cliente
- [ ] UI ajustada a la marca del cliente
- [ ] Rate limiting configurado adecuadamente
- [ ] Analytics implementado
- [ ] Testing en staging completado
- [ ] Documentación de uso entregada al cliente
- [ ] Presupuesto de costos mensual comunicado
- [ ] Plan de monitoreo definido

---

**Última actualización**: Noviembre 2025
**Soporte**: Ariel | GatoRojoLab
