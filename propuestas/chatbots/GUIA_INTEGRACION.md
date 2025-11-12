# Guía de Integración: Chatbots con IA

Documentación completa para integrar chatbots con OpenAI o Google Gemini en proyectos React/Next.js/Waku.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#1-requisitos-previos)
2. [Instalación de Dependencias](#2-instalación-de-dependencias)
3. [Configuración de Variables de Entorno](#3-configuración-de-variables-de-entorno)
4. [Estructura de Archivos](#4-estructura-de-archivos)
5. [Integración de APIs Backend](#5-integración-de-apis-backend)
6. [Integración de Componentes Frontend](#6-integración-de-componentes-frontend)
7. [Conexión con Firestore (Opcional)](#7-conexión-con-firestore-opcional)
8. [Seguridad y Mejores Prácticas](#8-seguridad-y-mejores-prácticas)
9. [Deploy en Producción](#9-deploy-en-producción)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Requisitos Previos

### ✅ Conocimientos Necesarios

- JavaScript/TypeScript básico
- React/Next.js
- API REST y fetch
- Variables de entorno

### ✅ Cuentas Requeridas

#### **Para OpenAI**
1. Crea cuenta en [platform.openai.com](https://platform.openai.com/signup)
2. Añade método de pago (tarjeta de crédito)
3. Genera API key en [API Keys](https://platform.openai.com/api-keys)
4. **Configura límites de gasto** en Settings > Billing

#### **Para Gemini**
1. Crea cuenta Google
2. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Genera API key (gratis hasta 15 req/min)

#### **Para Firestore (Opcional)**
1. Crea proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Descarga credenciales de servicio (JSON)

---

## 2. Instalación de Dependencias

### Opción A: Solo OpenAI

```bash
# Instalar OpenAI SDK
pnpm add openai

# Instalar tipos TypeScript
pnpm add -D @types/node
```

### Opción B: Solo Gemini

```bash
# Instalar Google Generative AI SDK
pnpm add @google/generative-ai

# Instalar tipos TypeScript
pnpm add -D @types/node
```

### Opción C: Ambos (OpenAI + Gemini)

```bash
# Instalar ambos SDKs
pnpm add openai @google/generative-ai

# Instalar tipos TypeScript
pnpm add -D @types/node
```

### Opcional: Firebase Admin (para Firestore)

```bash
# Solo si vas a usar Firestore para datos dinámicos
pnpm add firebase-admin
```

### Verificar instalación

```bash
# Ver package.json
cat package.json | grep -E "openai|generative-ai"
```

---

## 3. Configuración de Variables de Entorno

### Crear archivo `.env.local`

En la raíz del proyecto, crea `.env.local`:

```bash
# =====================================
# OPENAI (solo si usas OpenAI)
# =====================================
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx

# =====================================
# GEMINI (solo si usas Gemini)
# =====================================
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxx

# =====================================
# FIREBASE (solo si usas Firestore)
# =====================================
# Opción 1: Usar credenciales del archivo JSON
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json

# Opción 2: Variables individuales
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Añadir `.env.local` a `.gitignore`

```bash
# .gitignore
.env*
!.env.example
firebase-credentials.json
```

### Crear `.env.example` (para documentación)

```bash
# .env.example
OPENAI_API_KEY=sk-proj-tu_api_key_aqui
GEMINI_API_KEY=AIza_tu_api_key_aqui
GOOGLE_APPLICATION_CREDENTIALS=./firebase-credentials.json
```

---

## 4. Estructura de Archivos

### Estructura Recomendada

```
tu-proyecto/
├── src/
│   ├── pages/
│   │   └── api/
│   │       ├── chat-openai.ts      # API handler OpenAI
│   │       └── chat-gemini.ts      # API handler Gemini
│   ├── components/
│   │   ├── ChatbotOpenAI.tsx       # Componente UI OpenAI
│   │   └── ChatbotGemini.tsx       # Componente UI Gemini
│   ├── lib/
│   │   ├── openai.ts               # Configuración OpenAI
│   │   ├── gemini.ts               # Configuración Gemini
│   │   └── firestore.ts            # Configuración Firestore
│   └── types/
│       └── chat.ts                 # Tipos TypeScript
├── .env.local                      # Variables de entorno (NO COMMITEAR)
├── .env.example                    # Ejemplo de variables
└── firebase-credentials.json       # Credenciales Firebase (NO COMMITEAR)
```

---

## 5. Integración de APIs Backend

### 5.1. Copiar APIs Serverless

#### **OpenAI**

Copia el archivo `apis-Back Serverless/api-openai.ts` a `src/pages/api/chat-openai.ts`

```bash
cp propuestas/chatbots/apis-Back\ Serverless/api-openai.ts src/pages/api/chat-openai.ts
```

#### **Gemini**

Copia el archivo `apis-Back Serverless/api-gemini.ts` a `src/pages/api/chat-gemini.ts`

```bash
cp propuestas/chatbots/apis-Back\ Serverless/api-gemini.ts src/pages/api/chat-gemini.ts
```

### 5.2. Personalizar System Prompt

Edita el system prompt en cada archivo para adaptarlo al negocio del cliente:

**En `chat-openai.ts` o `chat-gemini.ts`:**

```typescript
function createSystemPrompt(businessData: any): string {
  return `
    Eres el asistente virtual de "${businessData.name}".
    
    Información del negocio:
    - Descripción: ${businessData.description}
    - Horarios: ${businessData.hours}
    - Dirección: ${businessData.address}
    - Contacto: ${businessData.contact}
    - Productos: ${JSON.stringify(businessData.products)}
    
    Instrucciones específicas:
    - Sé amable y profesional
    - Responde SOLO con información del negocio
    - Si no sabes algo, redirige al cliente al contacto
    - Usa tono conversacional
    - NO inventes precios ni información
    
    Preguntas frecuentes:
    Q: ¿Cuáles son sus horarios?
    A: ${businessData.hours}
    
    Q: ¿Dónde están ubicados?
    A: ${businessData.address}
    
    Q: ¿Cómo puedo contactarlos?
    A: ${businessData.contact}
  `.trim();
}
```

### 5.3. Configurar Datos Estáticos

Si NO usas Firestore, edita la función `getBusinessData()`:

```typescript
async function getBusinessData(): Promise<any> {
  return {
    name: 'Nombre del Negocio',
    description: 'Descripción breve del negocio',
    hours: 'Lunes a Viernes 9am - 6pm',
    address: 'Dirección completa',
    contact: 'WhatsApp: +506 1234 5678',
    products: [
      { name: 'Producto 1', price: '₡1000' },
      { name: 'Producto 2', price: '₡2000' },
    ],
    website: 'https://negocio.com',
  };
}
```

---

## 6. Integración de Componentes Frontend

### 6.1. Copiar Componentes

#### **OpenAI**

Copia el componente a tu carpeta de componentes:

```bash
cp propuestas/chatbots/componentes-Front/ChatbotOpenAI.tsx src/components/ChatbotOpenAI.tsx
```

#### **Gemini**

```bash
cp propuestas/chatbots/componentes-Front/ChatbotGemini.tsx src/components/ChatbotGemini.tsx
```

### 6.2. Usar en tus Páginas

#### **Ejemplo con OpenAI**

```tsx
// src/pages/index.tsx
'use client';

import ChatbotOpenAI from '../components/ChatbotOpenAI';

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenido</h1>
      {/* Tu contenido */}
      
      {/* Chatbot flotante */}
      <ChatbotOpenAI />
    </div>
  );
}
```

#### **Ejemplo con Gemini**

```tsx
// src/pages/index.tsx
'use client';

import ChatbotGemini from '../components/ChatbotGemini';

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenido</h1>
      {/* Tu contenido */}
      
      {/* Chatbot flotante */}
      <ChatbotGemini />
    </div>
  );
}
```

#### **Usar ambos (con selector)**

```tsx
// src/pages/index.tsx
'use client';

import { useState } from 'react';
import ChatbotOpenAI from '../components/ChatbotOpenAI';
import ChatbotGemini from '../components/ChatbotGemini';

export default function HomePage() {
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');

  return (
    <div>
      <h1>Bienvenido</h1>
      
      {/* Selector */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as 'openai' | 'gemini')}
          className="px-4 py-2 rounded border"
        >
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="gemini">Gemini 1.5</option>
        </select>
      </div>
      
      {/* Chatbot */}
      {provider === 'openai' ? <ChatbotOpenAI /> : <ChatbotGemini />}
    </div>
  );
}
```

### 6.3. Personalizar UI

Edita los estilos en los componentes para adaptarlos a tu branding:

```tsx
// Cambiar colores del botón flotante
<button
  className="fixed bottom-6 right-6 bg-[#TU_COLOR] hover:bg-[#TU_COLOR_HOVER]"
>
  {/* ... */}
</button>

// Cambiar header
<div className="bg-[#TU_COLOR] text-white p-4">
  <h3 className="font-semibold">Asistente de {TU_NEGOCIO}</h3>
</div>
```

---

## 7. Conexión con Firestore (Opcional)

### 7.1. Configurar Firebase Admin

Crea `src/lib/firestore.ts`:

```typescript
import admin from 'firebase-admin';

// Inicializar solo una vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const db = admin.firestore();
```

### 7.2. Estructura de Datos en Firestore

Crea una colección `businessInfo` con un documento `general`:

```javascript
// Estructura en Firestore
businessInfo (collection)
  └── general (document)
      ├── name: "Café Verde"
      ├── description: "Cafetería vegana..."
      ├── hours: "Lunes a sábado, 8am a 6pm"
      ├── address: "Avenida Central, San José"
      ├── contact: "WhatsApp: +506 8888 8888"
      ├── products: [
      │    { name: "Capuchino vegano", price: "₡2500" },
      │    { name: "Brownie sin gluten", price: "₡1800" }
      │  ]
      └── website: "https://cafeverde.com"
```

### 7.3. Usar Firestore en la API

Descomenta el código de Firestore en `chat-openai.ts` o `chat-gemini.ts`:

```typescript
import admin from 'firebase-admin';
import { db } from '../../lib/firestore';

async function getBusinessData(): Promise<any> {
  try {
    const doc = await db.collection('businessInfo').doc('general').get();
    
    if (!doc.exists) {
      console.warn('[Chatbot] No se encontró información del negocio');
      return null;
    }
    
    return doc.data();
  } catch (error) {
    console.error('[Chatbot] Error obteniendo datos:', error);
    return null;
  }
}
```

---

## 8. Seguridad y Mejores Prácticas

### 8.1. Rate Limiting

**Lado del servidor** (ya implementado en las APIs):

```typescript
const RATE_LIMIT = 10; // requests por minuto
const RATE_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(clientIp: string): boolean {
  // Implementación en las APIs
}
```

**Lado del cliente** (añadir a los componentes):

```typescript
const [requestCount, setRequestCount] = useState(0);
const MAX_REQUESTS = 10;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (requestCount >= MAX_REQUESTS) {
    setError('Has excedido el límite de consultas. Espera un momento.');
    return;
  }
  
  setRequestCount((prev) => prev + 1);
  // ... resto del código
};
```

### 8.2. Sanitización de Inputs

Ya implementado en las APIs, pero puedes añadir en el frontend:

```typescript
function sanitizeInput(text: string): string {
  return text
    .trim()
    .slice(0, 500) // Límite de caracteres
    .replace(/[<>]/g, '') // Remover HTML
    .replace(/javascript:/gi, ''); // Remover JS
}

const handleSubmit = async (e: React.FormEvent) => {
  const sanitized = sanitizeInput(input);
  // Usar sanitized en lugar de input
};
```

### 8.3. Validación de API Keys

Añade validación al inicio de las APIs:

```typescript
export async function POST(request: Request): Promise<Response> {
  // Validar API key
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'sk-proj-xxxxxx') {
    return new Response(
      JSON.stringify({
        error: 'API key no configurada. Contacta al administrador.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // ... resto del código
}
```

### 8.4. Logging y Monitoreo

Añade logging estructurado:

```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  ip?: string;
  duration?: number;
  error?: string;
}

function log(entry: LogEntry) {
  console.log(JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString(),
  }));
}

// Uso
log({
  level: 'info',
  message: 'Nueva solicitud de chatbot',
  ip: clientIp,
});
```

### 8.5. Límites de Tokens

Configura límites apropiados:

```typescript
// OpenAI
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  max_tokens: 500, // Ajusta según necesidad
  temperature: 0.7, // 0-2, mayor = más creativo
});

// Gemini
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 500,
    temperature: 0.7,
  },
});
```

---

## 9. Deploy en Producción

### 9.1. Vercel

#### **Configurar Variables de Entorno**

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Añade las variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - Variables de Firebase (si aplica)
4. Scope: Production + Preview
5. Guardar

#### **Deploy**

```bash
# Commit cambios
git add .
git commit -m "feat: agrega chatbot con OpenAI/Gemini"
git push origin main

# Vercel desplegará automáticamente
```

#### **Verificar**

1. Ve a Deployments en Vercel
2. Espera que termine el build
3. Visita tu sitio en producción
4. Prueba el chatbot

### 9.2. Netlify

#### **Configurar Variables de Entorno**

1. Site settings > Build & deploy > Environment
2. Add variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxx`
3. Guardar

#### **Deploy**

```bash
# Usando Netlify CLI
netlify deploy --prod

# O conectar con Git
netlify link
git push origin main
```

### 9.3. Firebase Hosting + Functions

Si usas Firebase Hosting con Functions:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar
firebase init

# Deploy
firebase deploy
```

---

## 10. Troubleshooting

### ❌ Error: "API key inválida"

**Síntomas:**
```
Error 401: Incorrect API key provided
```

**Soluciones:**
1. Verifica que la API key en `.env.local` sea correcta
2. No debe tener espacios ni comillas extra
3. En producción, verifica las env vars en Vercel/Netlify
4. Regenera la API key si es necesario

### ❌ Error: "Rate limit exceeded"

**Síntomas:**
```
Error 429: Rate limit reached
```

**Soluciones:**
1. **OpenAI**: Espera 1 minuto o upgradea tu tier
2. **Gemini**: Límite gratuito es 15 req/min
3. Implementa caché para preguntas frecuentes
4. Considera usar tier pago

### ❌ Error: "Cannot find module 'openai'"

**Síntomas:**
```
Error: Cannot find module 'openai'
```

**Soluciones:**
```bash
# Reinstalar dependencias
pnpm install

# O instalar específicamente
pnpm add openai
```

### ❌ Chatbot no aparece

**Posibles causas:**
1. Componente no marcado como `'use client'`
2. Conflicto de z-index con otros elementos
3. Error en la consola del navegador

**Soluciones:**
1. Verifica que el componente tenga `'use client'` al inicio
2. Aumenta el z-index: `z-50` → `z-[9999]`
3. Abre DevTools (F12) y revisa la consola

### ❌ Streaming no funciona

**Síntomas:**
- Respuesta completa aparece de golpe
- No hay efecto de "escribiendo"

**Soluciones:**
1. Verifica que el endpoint retorne `Content-Type: text/event-stream`
2. Asegúrate de usar `stream: true` en OpenAI
3. Verifica que `sendMessageStream()` se use en Gemini

### ❌ Firestore connection failed

**Síntomas:**
```
Error: Could not load the default credentials
```

**Soluciones:**
1. Verifica que `GOOGLE_APPLICATION_CREDENTIALS` apunte al JSON correcto
2. El archivo JSON debe estar en la raíz del proyecto
3. En producción, usa variables individuales (PROJECT_ID, PRIVATE_KEY, etc.)

### ❌ CSP bloquea el chatbot

**Síntomas:**
```
Refused to execute inline script
```

**Soluciones:**
Añade a tu CSP (en `vercel.json` o headers):
```json
{
  "headers": {
    "Content-Security-Policy": "script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com"
  }
}
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

### Tutoriales
- [Streaming con OpenAI](https://platform.openai.com/docs/guides/chat/streaming)
- [Gemini Quickstart](https://ai.google.dev/gemini-api/docs/get-started/tutorial)

### Comunidad
- [OpenAI Community](https://community.openai.com/)
- [r/OpenAI](https://reddit.com/r/OpenAI)
- [Google AI Discord](https://discord.gg/google-ai)

---

**¿Necesitas ayuda?** Revisa la sección de [Troubleshooting](#10-troubleshooting) o contacta al equipo de soporte.

**Última actualización:** Noviembre 2025
**Autor:** Ariel | GatoRojoLab
