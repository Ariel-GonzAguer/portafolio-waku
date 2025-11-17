# Propuestas / Chatbots — Resumen rápido

Este directorio contiene los artefactos para entregar un servicio de integración de chatbots (OpenAI / Google Gemini). Este README sirve como guía rápida para probar localmente, configurar variables y entender dónde están los archivos clave.

Contenido principal

- `apis-Back Serverless/` — Handlers serverless para OpenAI y Gemini (endpoints listos para copiar a Vercel/Netlify).
- `componentes-Front/` — Componentes React (TSX) flotantes para integrar en el frontend (`ChatbotOpenAI.tsx`, `ChatbotGemini.tsx`).
- `GUIA_INTEGRACION.md` — Documentación técnica completa (instalación, env, deploy, security, troubleshooting).
- `PROPUESTA_COMERCIAL.md` — Propuesta para clientes (paquetes, precios, modelo de cobro).
- `.env.example` — Plantilla de variables de entorno mínima (en este repo puede haber `.env.chatbots.example` con versión ampliada).

Requisitos rápidos

- pnpm como gestor de paquetes (NO usar npm).
- Node >= 18 recomendado.
- Tener cuentas / API keys para OpenAI y/o Google Gemini según el proveedor elegido.

Variables de entorno (mínimo)

- `OPENAI_API_KEY` — clave para OpenAI (si usas OpenAI).
- `GEMINI_API_KEY` — clave para Gemini (si usas Gemini).
- `CHAT_OPENAI_ENDPOINT` — ruta del endpoint serverless (por defecto `/api/chat-openai`).
- `CHAT_GEMINI_ENDPOINT` — ruta del endpoint serverless (por defecto `/api/chat-gemini`).
- Si usas Firestore: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

Archivo .env ejemplo

- Usa `propuestas/chatbots/.env.example` o `propuestas/chatbots/.env.chatbots.example` como plantilla.
- No subas claves reales al repositorio. En Vercel/Netlify configura las variables en su panel.

Cómo probar localmente (pasos rápidos)

1. Instala dependencias en la raíz del repo:

```bash
pnpm install
```

2. Asegúrate de tener las variables necesarias en `.env.local` (ejemplo en `propuestas/chatbots/.env.example`).

3. Levanta el dev server (en un proyecto Next.js/React compatible):

```bash
pnpm dev
```

4. Copia los endpoints serverless a `src/pages/api/` o a la plataforma serverless que uses (Vercel/Netlify). Los archivos en `apis-Back Serverless/` son handlers listos para usar.

5. Importa el componente en una página para probar la UI. Ejemplo (Next.js):

```tsx
import ChatbotOpenAI from '~/propuestas/chatbots/componentes-Front/ChatbotOpenAI';

export default function Page() {
  return (
    <div>
      <ChatbotOpenAI />
    </div>
  );
}
```

Notas técnicas relevantes

- Streaming SSE: los endpoints implementan streaming; el componente cliente usa `ReadableStream` para mostrar la respuesta en tiempo real.
- Rate limiting: hay límites básicos en el backend (Map in-memory). Para producción considere un rate limiting persistente (Redis).
- Seguridad: las keys NUNCA deben exponerse al frontend. El frontend llama al endpoint serverless; este hace la llamada a OpenAI/Gemini.

Errores comunes al probar

- "Cannot find module '@google/generative-ai'": instale la dependencia en su entorno con `pnpm add @google/generative-ai` si va a usar Gemini, o adapte el handler para no importarla.
- Problemas con `FIREBASE_PRIVATE_KEY`: reemplace los saltos de línea por `\n` en `.env.local` o use un secret manager.
- `Object is possibly 'undefined'` en componentes: ya se aplicó un guard en `ChatbotOpenAI.tsx` para evitar este problema.

Enlaces rápidos

- Guía técnica: `GUIA_INTEGRACION.md`
- Propuesta comercial: `PROPUESTA_COMERCIAL.md`

Siguientes pasos recomendados

- (Opcional) Renombrar `propuestas/chatbots/.env.chatbots.example` a `.env.example` si prefieres la plantilla ampliada.
- Desplegar los endpoints en Vercel/Netlify y configurar variables en el panel.
- Ejecutar pruebas de carga si esperas alto volumen de consultas.

Contacto

- Ariel / GatoRojoLab — detalles en `PROPUESTA_COMERCIAL.md`.

---

Archivo generado automáticamente por el asistente; si quieres que añada más ejemplos o instrucciones específicas de integración (por ejemplo, cómo inyectar el widget en WordPress/Shopify), dime y lo incluyo.
