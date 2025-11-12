/**
 * API Serverless para Chatbot con Google Gemini
 * 
 * Endpoint: POST /api/chat-gemini
 * 
 * Features:
 * - Integración con Google Gemini 1.5 Flash
 * - Conexión opcional con Firestore para datos del negocio
 * - Rate limiting por IP
 * - Sanitización de inputs
 * - Streaming de respuestas
 * - Historial de conversación
 * - Safety settings configurables
 * 
 * @example
 * // Request
 * POST /api/chat-gemini
 * {
 *   "question": "¿Cuáles son sus horarios?",
 *   "history": [
 *     { "role": "user", "parts": [{ "text": "Hola" }] },
 *     { "role": "model", "parts": [{ "text": "¡Hola! ¿En qué puedo ayudarte?" }] }
 *   ]
 * }
 * 
 * // Response (streaming)
 * data: {"content": "Nuestros horarios son..."}
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
// import admin from 'firebase-admin'; // Descomenta si usas Firestore

// ============================================
// CONFIGURACIÓN
// ============================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Inicializar Firebase Admin (opcional)
/*
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();
*/

// Safety settings para contenido
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 15; // requests (Gemini free tier: 15 RPM)
const RATE_WINDOW = 60 * 1000; // 1 minuto

/**
 * Verifica si una IP ha excedido el rate limit.
 * 
 * @param clientIp - IP del cliente
 * @returns true si está dentro del límite, false si excedió
 */
function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// ============================================
// SANITIZACIÓN
// ============================================

/**
 * Sanitiza el input del usuario para prevenir inyecciones.
 * 
 * @param text - Texto a sanitizar
 * @returns Texto sanitizado
 */
function sanitizeInput(text: string): string {
  return text
    .trim()
    .slice(0, 500) // Límite de caracteres
    .replace(/[<>]/g, ''); // Remover HTML básico
}

// ============================================
// OBTENER DATOS DEL NEGOCIO (FIRESTORE)
// ============================================

/**
 * Obtiene información del negocio desde Firestore.
 * 
 * @returns Datos del negocio o null si no hay conexión
 */
async function getBusinessData(): Promise<any> {
  try {
    // OPCIÓN 1: Usando Firestore (descomenta si usas Firebase)
    /*
    const doc = await db.collection('businessInfo').doc('general').get();
    if (!doc.exists) {
      console.warn('[Gemini] No se encontró información del negocio en Firestore');
      return null;
    }
    return doc.data();
    */

    // OPCIÓN 2: Datos estáticos (para pruebas)
    return {
      name: 'Café Verde',
      description: 'Cafetería vegana que ofrece café orgánico y postres sin gluten.',
      hours: 'Lunes a sábado, de 8am a 6pm',
      address: 'Avenida Central, San José, Costa Rica',
      products: [
        { name: 'Capuchino vegano', price: '₡2500' },
        { name: 'Brownie sin gluten', price: '₡1800' },
        { name: 'Smoothie tropical', price: '₡2200' },
      ],
      contact: 'WhatsApp: +506 8888 8888',
      website: 'https://cafeverde.com',
    };
  } catch (error) {
    console.error('[Gemini] Error obteniendo datos del negocio:', error);
    return null;
  }
}

// ============================================
// SYSTEM INSTRUCTION
// ============================================

/**
 * Genera la system instruction con la información del negocio.
 * 
 * @param businessData - Datos del negocio
 * @returns System instruction personalizada
 */
function createSystemInstruction(businessData: any): string {
  if (!businessData) {
    return `
      Eres un asistente virtual amable y profesional.
      Responde de manera concisa y útil.
      Si no tienes información sobre algo, di "No tengo esa información disponible".
    `.trim();
  }

  return `
    Eres el asistente virtual de "${businessData.name}".
    
    Información del negocio:
    - Descripción: ${businessData.description}
    - Horarios: ${businessData.hours}
    - Dirección: ${businessData.address}
    - Contacto: ${businessData.contact}
    ${businessData.products ? `- Productos: ${JSON.stringify(businessData.products)}` : ''}
    ${businessData.website ? `- Sitio web: ${businessData.website}` : ''}
    
    Instrucciones:
    - Responde SOLO con información del negocio proporcionada
    - Sé amable, profesional y conciso
    - Si el usuario pregunta algo que no está en la información, di "No tengo esa información, pero puedes contactarnos en ${businessData.contact}"
    - No inventes precios, horarios ni información que no esté aquí
    - Usa tono conversacional y cercano
    - Si el usuario te saluda, responde amablemente y ofrece ayuda
    - Responde en español siempre
  `.trim();
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();

  try {
    // 1. Obtener IP del cliente
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    console.log(`[Gemini] Nueva solicitud de ${clientIp}`);

    // 2. Rate limiting
    if (!checkRateLimit(clientIp)) {
      console.warn(`[Gemini] Rate limit excedido para ${clientIp}`);
      return new Response(
        JSON.stringify({
          error: 'Demasiadas solicitudes. Por favor espera un minuto.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Parsear body
    const body = await request.json();
    const { question, history = [] } = body;

    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'La pregunta es requerida' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Sanitizar input
    const sanitizedQuestion = sanitizeInput(question);
    console.log(`[Gemini] Pregunta: "${sanitizedQuestion}"`);

    // 5. Obtener datos del negocio
    const businessData = await getBusinessData();
    const systemInstruction = createSystemInstruction(businessData);

    // 6. Configurar modelo
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Modelo rápido y económico
      systemInstruction,
      safetySettings,
      generationConfig: {
        temperature: 0.7, // Creatividad moderada
        topP: 0.9, // Nucleus sampling
        topK: 40, // Top-K sampling
        maxOutputTokens: 500, // Límite de tokens en respuesta
      },
    });

    // 7. Convertir historial a formato Gemini
    const geminiHistory = history.slice(-10).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.parts?.[0]?.text || '' }],
    }));

    // 8. Crear chat con historial
    const chat = model.startChat({
      history: geminiHistory,
    });

    // 9. Enviar mensaje y obtener stream
    const result = await chat.sendMessageStream(sanitizedQuestion);

    // 10. Crear ReadableStream para respuesta
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const content = chunk.text();
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          // Enviar evento de finalización
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

          const duration = Date.now() - startTime;
          console.log(`[Gemini] Respuesta completada en ${duration}ms`);
        } catch (error) {
          console.error('[Gemini] Error en streaming:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[Gemini] Error en el handler:', error);

    // Manejo de errores específicos de Gemini
    if (error?.message?.includes('API_KEY_INVALID')) {
      return new Response(
        JSON.stringify({
          error: 'API key inválida. Contacta al administrador.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (error?.message?.includes('RATE_LIMIT_EXCEEDED')) {
      return new Response(
        JSON.stringify({
          error: 'Límite de Gemini excedido. Intenta más tarde.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (error?.message?.includes('SAFETY')) {
      return new Response(
        JSON.stringify({
          error: 'La respuesta fue bloqueada por razones de seguridad.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        message: error?.message || 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface ChatRequest {
  question: string;
  history?: GeminiMessage[];
}

export interface BusinessData {
  name: string;
  description: string;
  hours: string;
  address: string;
  contact: string;
  products?: Array<{ name: string; price: string }>;
  website?: string;
}
