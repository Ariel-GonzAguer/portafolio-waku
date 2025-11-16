/**
 * API Serverless para Chatbot con OpenAI
 *
 * Endpoint: POST /api/chat-openai
 *
 * Features:
 * - Integración con OpenAI GPT-4
 * - Conexión opcional con Firestore para datos del negocio
 * - Rate limiting por IP
 * - Sanitización de inputs
 * - Streaming de respuestas
 * - Historial de conversación
 *
 * @example
 * // Request
 * POST /api/chat-openai
 * {
 *   "question": "¿Cuáles son sus horarios?",
 *   "history": [
 *     { "role": "user", "content": "Hola" },
 *     { "role": "assistant", "content": "¡Hola! ¿En qué puedo ayudarte?" }
 *   ]
 * }
 *
 * // Response (streaming)
 * data: {"content": "Nuestros horarios son..."}
 */

import OpenAI from 'openai';
// import admin from 'firebase-admin'; // Descomenta si usas Firestore

// ============================================
// CONFIGURACIÓN
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Inicializar Firebase Admin (opcional)
/*
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();
*/

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 10; // requests
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
      console.warn('[OpenAI] No se encontró información del negocio en Firestore');
      return null;
    }
    return doc.data();
    */

    // OPCIÓN 2: Datos estáticos (para pruebas)
    return {
      name: 'Gato Rojo Lab - Desarrollo JAMstack, accesibilidad y ',
      description:
      'Soluciones centradas en la Persona Usuaria. Accesibilidad, minimalismo y creatividad. Desarrollo JAM Stack tipado, testeado, limpio, con backend serverless',
      hours: 'martes a sábado: 10am a 4pm, domingo y lunes: cerrado.',
      servicios: [
      {
        name: 'Desarrollo de Aplicaciones Web JAM Stack',
        description:
        'Creación de aplicaciones web modernas utilizando TypeScript, APIs y Markup. Desarrollo de soluciones escalables con React+Vite, Waku o Astro, optimizadas para rendimiento y SEO.',
      },
      {
        name: 'Investigación Experiencias (UX Research)',
        description:
        'Investigación profunda para entender necesidades de las personas usuarias. Incluye entrevistas, encuestas, análisis de comportamiento y pruebas de usabilidad para informar decisiones de diseño.',
      },
      {
        name: 'Integración de componentes con IA',
        description:
        'Incorporación de funcionalidades impulsadas por inteligencia artificial en aplicaciones web. Implementación de chatbots y generación de contenido.',
      },
      {
        name: 'Diseño de Interfaces de Usuario (UI/UX)',
        description:
        'Creación de diseños intuitivos y atractivos centrados en la experiencia del usuario. Utilizando herramientas como Figma para prototipos interactivos y wireframes.',
      },
      {
        name: 'Auditoría de Accesibilidad Web',
        description:
        'Evaluación y mejora de la accesibilidad en sitios web para cumplir con estándares WCAG. Asegurando que las aplicaciones sean usables por personas con discapacidades.',
      },
      {
        name: 'Consultoría en Tecnologías Web',
        description:
        'Asesoramiento experto en selección de tecnologías, arquitectura de proyectos y mejores prácticas para desarrollo web moderno y sostenible.',
      },
      ],
      whatsapp: '506 63685484',
      email: 'ariegonzaguer@gmail.com',
      faq: {
      '¿Qué es JAMstack?':
        'JAMstack es una arquitectura web moderna que separa el frontend del backend, utilizando JavaScript, APIs y Markup para crear sitios rápidos y seguros.',
      '¿Por qué es importante la accesibilidad web?':
        'La accesibilidad web asegura que todas las personas, incluidas aquellas con discapacidades, puedan acceder y utilizar sitios web de manera efectiva.',
      '¿Qué tecnologías utilizan?':
        'Utilizamos tecnologías como React, Vite, Astro, TypeScript y diversas APIs para construir aplicaciones web modernas y eficientes.',
      '¿Ofrecen soporte post-lanzamiento?':
        'Sí, ofrecemos servicios de mantenimiento y soporte para asegurar que su aplicación web funcione sin problemas después del lanzamiento.',
      },
    };
  } catch (error) {
    console.error('[OpenAI] Error obteniendo datos del negocio:', error);
    return null;
  }
}

// ============================================
// SYSTEM PROMPT
// ============================================

/**
 * Genera el system prompt con la información del negocio.
 *
 * @param businessData - Datos del negocio
 * @returns System prompt personalizado
 */
function createSystemPrompt(businessData: any): string {
  if (!businessData) {
    return `
      Eres un asistente virtual amable y profesional de Gato Rojo Lab.
      Responde de manera concisa y útil.
      Si no tienes información sobre algo, di "No tengo esa información disponible" y sugiere escribir al correo de soporte para más detalles.
    `.trim();
  }

  return `
    Eres el asistente virtual de "${businessData.name}".
    
    Información del negocio:
    - Descripción: ${businessData.description}
    - Horarios: ${businessData.hours}
    - Dirección: ${businessData.address}
    - Whatsapp: ${businessData.whatsapp}
    - Email: ${businessData.email}
    - Servicios: ${businessData.servicios
      .map((s: any) => `${s.name}: ${s.description}`)
      .join('; ')}
    - Preguntas frecuentes: ${Object.entries(businessData.faq)
      .map(([q, a]) => `${q} - ${a}`)
      .join('; ')}
    
    Instrucciones:
    - Responde SOLO con información del negocio proporcionada
    - Sé amable, profesional y conciso
    - Si el usuario pregunta algo que no está en la información, di "No tengo esa información, pero puedes contactarnos en ${businessData.email}"
    - No inventes precios, horarios ni información que no esté aquí
    - Usa tono conversacional y cercano
    - Si el usuario te saluda, responde amablemente y ofrece ayuda
    - Si alguiente dice que quiere adquirir un servicio, indicale que puede escribir al correo de soporte para más detalles
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

    console.log(`[OpenAI] Nueva solicitud de ${clientIp}`);

    // 2. Rate limiting
    if (!checkRateLimit(clientIp)) {
      console.warn(`[OpenAI] Rate limit excedido para ${clientIp}`);
      return new Response(
        JSON.stringify({
          error: 'Demasiadas solicitudes. Por favor espera un minuto.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // 3. Parsear body
    const body = await request.json();
    const { question, history = [] } = body;

    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'La pregunta es requerida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Sanitizar input
    const sanitizedQuestion = sanitizeInput(question);
    console.log(`[OpenAI] Pregunta: "${sanitizedQuestion}"`);

    // 5. Obtener datos del negocio
    const businessData = await getBusinessData();
    const systemPrompt = createSystemPrompt(businessData);

    // 6. Preparar mensajes
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Solo últimos 10 mensajes
      { role: 'user', content: sanitizedQuestion },
    ];

    // 7. Crear streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 'gpt-3.5-turbo' para menor costo
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // 8. Crear ReadableStream para respuesta
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          // Enviar evento de finalización
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();

          const duration = Date.now() - startTime;
          console.log(`[OpenAI] Respuesta completada en ${duration}ms`);
        } catch (error) {
          console.error('[OpenAI] Error en streaming:', error);
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
    console.error('[OpenAI] Error en el handler:', error);

    // Manejo de errores específicos de OpenAI
    if (error?.status === 401) {
      return new Response(
        JSON.stringify({
          error: 'API key inválida. Contacta al administrador.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (error?.status === 429) {
      return new Response(
        JSON.stringify({
          error: 'Límite de OpenAI excedido. Intenta más tarde.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
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
      },
    );
  }
}

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  question: string;
  history?: ChatMessage[];
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
