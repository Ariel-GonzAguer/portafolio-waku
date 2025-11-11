# Guía de Servicio: Integración de Componentes con IA

## 📋 Descripción del Servicio

Incorporación de funcionalidades impulsadas por inteligencia artificial en aplicaciones web. Implementación de chatbots, generación de contenido y análisis predictivo para mejorar la experiencia de la persona usuaria.

---

## 🎯 Propuesta Comercial para Clientes

### Valor Agregado
- **Automatización inteligente**: Reducción de carga operativa mediante respuestas automatizadas 24/7
- **Mejora de conversión**: Asistencia personalizada que incrementa engagement y conversiones
- **Insights de usuario**: Análisis de interacciones para entender mejor a tus clientes
- **Escalabilidad**: Atención simultánea a múltiples usuarios sin límite (solo límite económico)
- **ROI medible**: Métricas claras de satisfacción, tiempo de respuesta y conversión

### Casos de Uso Principales

#### 1. **Chatbot de Atención al Cliente**
- Respuestas instantáneas a preguntas frecuentes
- Escalado a agente humano cuando sea necesario
- Disponible 24/7 sin aumentar costos operativos
- Integración con sistemas CRM existentes

#### 2. **Generación de Contenido**
- Creación automática de descripciones de productos
- Generación de resúmenes y artículos
- Optimización de contenido para SEO
- Personalización de mensajes por segmento de usuario

### Paquetes de Servicio

#### 🥉 **Básico** ($800 - $1,200)
- 1 chatbot conversacional simple
- Base de conocimiento de hasta 50 preguntas/respuestas
- Integración en 1 sitio web
- Personalización básica de marca
- Soporte técnico 1 mes

#### 🥈 **Profesional** ($1,500 - $2,500)
- Chatbot avanzado con contexto e historial
- Base de conocimiento ilimitada
- Generación de contenido (descripciones, resúmenes)
- Integración en múltiples páginas
- Analytics y reportes mensuales
- Soporte técnico 3 meses

#### 🥇 **Enterprise** ($3,000 - $5,000+)
- Chatbot multimodal (texto, imágenes, archivos)
- Sistema de análisis predictivo personalizado
- Integración con CRM/ERP existente
- Entrenamiento con datos específicos del cliente
- Dashboard de métricas en tiempo real
- API personalizada
- Soporte técnico 6 meses + mantenimiento

---

## 📝 Requisitos para Implementación

### Requisitos del Cliente

#### Información de Negocio
- [ ] Descripción clara del caso de uso (chatbot, generación de contenido)
- [ ] Objetivos medibles (ej: reducir tiempo de respuesta en 60%)
- [ ] Público objetivo y segmentos de usuario
- [ ] Tono de voz y guías de marca
- [ ] FAQs existentes o base de conocimiento

#### Accesos Técnicos
- [ ] Acceso al repositorio del proyecto (GitHub, GitLab, etc.)
- [ ] Credenciales de despliegue (Vercel, Netlify, etc.)
- [ ] Variables de entorno seguras para API keys
- [ ] Acceso a Google Analytics / herramientas de tracking (opcional)

#### Recursos de IA
- [ ] Cuenta de OpenAI o Google Cloud (según elección)
- [ ] Presupuesto mensual para uso de APIs (~$20-200/mes según volumen)
- [ ] Aprobación para procesamiento de datos de usuario (GDPR/compliance)

### Requisitos Técnicos del Proyecto

#### Stack Recomendado
```json
{
  "frontend": ["React 19+", "TypeScript", "Tailwind CSS"],
  "framework": ["Waku", "Next.js", "Astro"],
  "ia": ["OpenAI API", "Google Gemini API", "Anthropic Claude"],
  "state": ["Zustand", "React Context"],
  "streaming": ["Server-Sent Events", "WebSockets (opcional)"],
  "analytics": ["Vercel Analytics", "Google Analytics 4"]
}
```

#### Dependencias Necesarias
```bash
# Para OpenAI
pnpm add openai

# Para Gemini
pnpm add @google/generative-ai

# Utilidades
pnpm add zod          # validación de esquemas
pnpm add nanoid       # IDs únicos para mensajes
```

---

## 🛠️ Tecnologías y Cómo Usarlas

### 1. OpenAI (GPT-4 / GPT-3.5-turbo)

#### **Ventajas**
- Modelo más probado y estable del mercado
- Excelente comprensión de contexto en español
- Amplia documentación y comunidad
- Funciones avanzadas (function calling, vision, embeddings)

#### **Desventajas**
- Costo más alto que alternativas
- Límites de rate más estrictos en tier gratuito
- Requiere moderación de contenido adicional

#### **Pricing** (noviembre 2024)
- GPT-3.5-turbo: $0.0015/1K tokens input, $0.002/1K tokens output
- GPT-4-turbo: $0.01/1K tokens input, $0.03/1K tokens output
- GPT-4o (recomendado): $0.005/1K tokens input, $0.015/1K tokens output

#### **Setup Inicial**
```typescript
// lib/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Configuración recomendada
export const chatConfig = {
  model: 'gpt-4o',
  temperature: 0.7,        // Creatividad (0-2, recomendado 0.7)
  max_tokens: 500,         // Límite de respuesta
  top_p: 0.9,              // Nucleus sampling
  frequency_penalty: 0.3,  // Evita repetición
  presence_penalty: 0.2,   // Fomenta nuevos temas
};
```

#### **Casos de Uso por Modelo**
- **GPT-3.5-turbo**: Chatbots simples, FAQs, resúmenes cortos (costo-efectivo)
- **GPT-4o**: Chatbots complejos, análisis, generación creativa (mejor relación calidad/precio)
- **GPT-4-turbo**: Análisis profundo, tareas críticas, generación de código

---

### 2. Google Gemini (1.5 Flash / Pro)

#### **Ventajas**
- Tier gratuito muy generoso (15 req/min, 1M tokens/min)
- Excelente para multimodalidad (texto + imágenes)
- Contexto extendido (hasta 2M tokens en Pro)
- Precio competitivo en tiers pagos

#### **Desventajas**
- Menos adopción/ejemplos que OpenAI
- Respuestas ocasionalmente más verbosas
- Documentación menos madura

#### **Pricing** (noviembre 2024)
- **Gemini 1.5 Flash**: Gratis hasta 15 RPM, luego $0.075/1M tokens input
- **Gemini 1.5 Pro**: Gratis hasta 2 RPM, luego $1.25/1M tokens input
- **Gemini 2.0 Flash (experimental)**: Gratis en preview

#### **Setup Inicial**
```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Configuración recomendada
export const chatConfig = {
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 500,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
};
```

#### **Casos de Uso por Modelo**
- **1.5 Flash**: Chatbots rápidos, volumen alto, prototipado (tier gratuito generoso)
- **1.5 Pro**: Análisis de documentos largos, contexto extenso, tareas complejas
- **2.0 Flash**: Experimentación con últimas features (multimodal avanzado)

---

### 3. Alternativas Emergentes

#### **Anthropic Claude 3.5 Sonnet**
- Excelente para análisis largo y detallado
- Muy seguro y alineado
- Precio: $3/1M tokens input, $15/1M tokens output
- Ideal para: Análisis legal, médico, documentación técnica

#### **Mistral AI (open weights)**
- Modelos open source de alta calidad
- Puede ser self-hosted (reduce costos a largo plazo)
- Mistral Large comparable a GPT-4
- Ideal para: Empresas con requisitos de privacidad estrictos

---

## 💬 Implementación: Chatbot con OpenAI

### Arquitectura del Sistema

```
┌─────────────────┐
│  Cliente (UI)   │  ← React Component
└────────┬────────┘
         │ POST /api/chat
         ↓
┌─────────────────┐
│  API Handler    │  ← Waku/Next API Route
└────────┬────────┘
         │ Validación + Rate Limit
         ↓
┌─────────────────┐
│  OpenAI SDK     │  ← streaming response
└────────┬────────┘
         │ SSE stream
         ↓
┌─────────────────┐
│  Cliente (UI)   │  ← Actualiza mensaje en tiempo real
└─────────────────┘
```

### Componente Completo (Ver archivo separado)

> 📄 **Archivo**: `src/components/ChatbotOpenAI.tsx`

---

## 🤖 Implementación: Chatbot con Gemini

### Arquitectura Similar con Particularidades

- Gemini usa `generateContentStream` para streaming
- Safety settings configurables por categoría
- Soporte nativo para imágenes en el mismo endpoint

### Componente Completo (Ver archivo separado)

> 📄 **Archivo**: `src/components/ChatbotGemini.tsx`

---

## 🔐 Seguridad y Mejores Prácticas

### Variables de Entorno

```bash
# .env.local (NUNCA commitear al repo)
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...

# .env.production (en Vercel/Netlify)
# Configurar en dashboard del provider
```

### Rate Limiting

```typescript
// lib/rateLimit.ts
const REQUESTS_PER_MINUTE = 10;
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRecord = userRequestCounts.get(userId);

  if (!userRecord || now > userRecord.resetTime) {
    userRequestCounts.set(userId, {
      count: 1,
      resetTime: now + 60000,
    });
    return true;
  }

  if (userRecord.count >= REQUESTS_PER_MINUTE) {
    return false;
  }

  userRecord.count++;
  return true;
}
```

### Sanitización de Input

```typescript
// lib/sanitize.ts
import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().optional(),
});

export function sanitizeUserMessage(message: string): string {
  return message
    .trim()
    .replace(/[<>]/g, '') // Evitar HTML injection
    .slice(0, 500);       // Limitar longitud
}
```

### Moderación de Contenido

```typescript
// lib/moderation.ts (OpenAI)
export async function moderateContent(text: string): Promise<boolean> {
  const moderation = await openai.moderations.create({ input: text });
  return !moderation.results[0].flagged;
}
```

---

## 📊 Analytics y Monitoreo

### Métricas Clave a Trackear

```typescript
// types/analytics.ts
export interface ChatAnalytics {
  messageId: string;
  userId: string;
  timestamp: number;
  messageLength: number;
  responseTime: number;      // ms
  tokensUsed: number;
  cost: number;              // USD
  userSatisfaction?: 1 | -1; // thumbs up/down
  escalatedToHuman: boolean;
}
```

### Implementación de Logger

```typescript
// lib/analytics.ts
export async function logChatInteraction(data: ChatAnalytics) {
  // Opción 1: Enviar a Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_interaction', {
      response_time: data.responseTime,
      tokens_used: data.tokensUsed,
    });
  }

  // Opción 2: Enviar a endpoint propio
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
```

---

## 🚀 Proceso de Implementación Paso a Paso

### Fase 1: Discovery (1-2 días)
1. Reunión inicial con cliente
2. Definir caso de uso específico
3. Mapear flujos de conversación
4. Determinar base de conocimiento
5. Elegir tecnología (OpenAI vs Gemini vs otro)

### Fase 2: Setup Técnico (1 día)
1. Crear cuentas en proveedores de IA
2. Configurar variables de entorno
3. Instalar dependencias
4. Setup de API routes
5. Configurar rate limiting

### Fase 3: Desarrollo (3-5 días)
1. Implementar componente de chat UI
2. Crear API handler con streaming
3. Desarrollar system prompt personalizado
4. Implementar sanitización y validación
5. Añadir analytics y logging

### Fase 4: Testing (2-3 días)
1. Testing funcional (casos de uso principales)
2. Testing de estrés (rate limits)
3. Testing de seguridad (injection, moderación)
4. Testing de UX (tiempos de respuesta, claridad)
5. Testing cross-browser

### Fase 5: Deploy y Monitoreo (1-2 días)
1. Deploy a staging
2. Revisión con cliente
3. Ajustes finales
4. Deploy a producción
5. Monitoreo de primeras 48 horas

### Fase 6: Optimización (continuo)
1. Análisis de métricas semanales
2. Ajuste de prompts según feedback
3. Optimización de costos (modelo/parámetros)
4. Expansión de base de conocimiento

---

## 💰 Estimación de Costos de Operación

### Escenario: Chatbot E-commerce (1000 interacciones/mes)

#### OpenAI GPT-4o
- Promedio: 200 tokens input + 150 tokens output por interacción
- Input: 200K tokens × $0.005 = **$1.00**
- Output: 150K tokens × $0.015 = **$2.25**
- **Total: ~$3.25/mes**

#### Gemini 1.5 Flash
- Mismo volumen en tier gratuito: **$0/mes**
- Si excede tier gratuito:
  - 350K tokens × $0.075 = **$0.026/mes**

#### Recomendación por Volumen
- **<500 msg/mes**: Gemini Flash (gratis)
- **500-5K msg/mes**: Gemini Flash o GPT-3.5-turbo
- **5K-20K msg/mes**: GPT-4o
- **>20K msg/mes**: Considerar fine-tuning o self-hosted

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com)

### Herramientas Útiles
- [OpenAI Playground](https://platform.openai.com/playground) - Testing de prompts
- [AI Studio](https://aistudio.google.com/) - Testing de Gemini
- [Vercel AI SDK](https://sdk.vercel.ai/) - Abstracción multi-provider

### Cursos Recomendados
- [DeepLearning.AI - ChatGPT Prompt Engineering](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)
- [Google - Introduction to Generative AI](https://www.cloudskillsboost.google/paths/118)

---

## ✅ Checklist Pre-Entrega

### Antes de Entregar al Cliente

- [ ] Chatbot responde correctamente a 20+ casos de uso definidos
- [ ] Rate limiting funciona (probar 15+ requests rápidos)
- [ ] Analytics registra todas las interacciones
- [ ] Costos proyectados comunicados claramente al cliente
- [ ] Documentación de uso para equipo del cliente
- [ ] Variables de entorno configuradas en producción
- [ ] Backup de system prompt y configuración
- [ ] Plan de escalado definido (qué hacer si volumen crece 10x)

### Post-Entrega

- [ ] Monitoreo de métricas primeras 2 semanas
- [ ] Reporte de analytics enviado al cliente (semanal primeros mes)
- [ ] Ajustes de prompt según feedback real
- [ ] Revisión de costos vs presupuesto
- [ ] Plan de mejora continua documentado

---

## 🎓 Próximos Pasos

1. **Revisar componentes implementados** en:
   - `src/components/ChatbotOpenAI.tsx`
   - `src/components/ChatbotGemini.tsx`
   - `src/pages/api/chat-openai.ts`
   - `src/pages/api/chat-gemini.ts`

2. **Personalizar system prompt** según negocio del cliente

3. **Configurar variables de entorno** en `.env.local`

4. **Testing local** con `pnpm dev`

5. **Deploy a staging** y compartir con cliente para feedback

---

**Última actualización**: Noviembre 2025
**Mantenedor**: Ariel | GatoRojoLab
