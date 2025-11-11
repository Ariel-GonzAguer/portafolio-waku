/* eslint-disable no-console */
/**
 * API Handler para Chatbot Google Gemini
 * 
 * Endpoint: POST /api/chat-gemini
 * 
 * Características:
 * - Streaming de respuestas usando Server-Sent Events
 * - Tier gratuito generoso (15 req/min)
 * - Rate limiting básico
 * - Safety settings configurables
 * - Manejo de contexto conversacional
 * 
 * Variables de entorno requeridas:
 * - GEMINI_API_KEY: API key de Google AI Studio
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar cliente Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rate limiting simple (en producción usar Redis o similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRecord = requestCounts.get(userId);

  if (!userRecord || now > userRecord.resetTime) {
    requestCounts.set(userId, {
      count: 1,
      resetTime: now + 60000,
    });
    return true;
  }

  if (userRecord.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  userRecord.count++;
  return true;
}

/**
 * System prompt personalizado para el chatbot
 * IMPORTANTE: Personalizar según el negocio del cliente
 */
const SYSTEM_INSTRUCTION = `Eres un asistente virtual amigable y profesional de GatoRojoLab, una empresa de desarrollo web especializada en JAM Stack, diseño UX y accesibilidad.

Tu tono debe ser:
- Profesional pero cercano
- Conciso y directo (máximo 3 párrafos por respuesta)
- Empático con las necesidades del usuario
- Enfocado en soluciones prácticas

Puedes ayudar con:
- Información sobre servicios de desarrollo web
- Consultas sobre tecnologías (React, TypeScript, Waku, Astro)
- Asesoramiento básico sobre UX/UI y accesibilidad
- Presupuestos generales (redirigir a contacto para cotizaciones exactas)

Si no sabes algo o está fuera de tu alcance, sé honesto y ofrece alternativas (como agendar una llamada con el equipo).

Responde siempre en español de forma natural y profesional.`;

// Configuración del modelo
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: SYSTEM_INSTRUCTION,
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
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

export async function POST(request: Request): Promise<Response> {
  try {
    // Obtener IP para rate limiting (en producción usar user ID o token)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Verificar rate limit
    if (!checkRateLimit(clientIp)) {
      console.log(`Rate limit excedido para IP: ${clientIp}`);
      return Response.json(
        { error: 'Demasiadas solicitudes. Por favor intenta en un minuto.' },
        { status: 429 }
      );
    }

    // Parsear body
    const body = await request.json();
    const { messages } = body;

    // Validar input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Se requiere un array de mensajes' },
        { status: 400 }
      );
    }

    // Sanitizar mensajes (limitar longitud y cantidad)
    // Gemini espera formato { role: 'user' | 'model', parts: [{ text: string }] }
    const sanitizedMessages = messages.slice(-10).map((msg: { role: string; parts: { text: string }[] }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts[0].text.slice(0, 500) }],
    }));

    console.log(`[Gemini] Nueva solicitud de ${clientIp}, ${messages.length} mensajes`);

    // Iniciar chat con historial
    const chat = model.startChat({
      history: sanitizedMessages.slice(0, -1), // Todos menos el último
    });

    // Enviar último mensaje y obtener stream
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    // Configurar SSE stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[Gemini] Error en streaming:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('[Gemini] Error en handler:', error);

    // Manejar errores específicos de Gemini
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return Response.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota')) {
        return Response.json(
          { error: 'Límite de Gemini alcanzado. Intenta más tarde.' },
          { status: 503 }
        );
      }
      if (error.message.includes('SAFETY')) {
        return Response.json(
          { error: 'Tu mensaje fue bloqueado por filtros de seguridad. Por favor reformúlalo.' },
          { status: 400 }
        );
      }
    }

    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
