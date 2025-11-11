/* eslint-disable no-console */
/**
 * API Handler para Chatbot OpenAI
 * 
 * Endpoint: POST /api/chat-openai
 * 
 * Características:
 * - Streaming de respuestas usando Server-Sent Events
 * - Rate limiting básico
 * - Sanitización de input
 * - Manejo de contexto conversacional
 * - Logging para analytics
 * 
 * Variables de entorno requeridas:
 * - OPENAI_API_KEY: API key de OpenAI
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
const SYSTEM_PROMPT = `Eres un asistente virtual amigable y profesional de GatoRojoLab, una empresa de desarrollo web especializada en JAM Stack, diseño UX y accesibilidad.

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
    const sanitizedMessages = messages.slice(-10).map((msg: ChatCompletionMessageParam) => ({
      role: msg.role,
      content:
        typeof msg.content === 'string' ? msg.content.slice(0, 500) : msg.content,
    }));

    // Añadir system prompt
    const fullMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sanitizedMessages,
    ];

    console.log(`[OpenAI] Nueva solicitud de ${clientIp}, ${messages.length} mensajes`);

    // Crear streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o', // o 'gpt-3.5-turbo' para menor costo
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
      stream: true,
    });

    // Configurar SSE stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[OpenAI] Error en streaming:', error);
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
    console.error('[OpenAI] Error en handler:', error);

    // Manejar errores específicos de OpenAI
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return Response.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return Response.json(
          { error: 'Límite de OpenAI alcanzado. Intenta más tarde.' },
          { status: 503 }
        );
      }
    }

    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
