/**
 * Componente Chatbot con OpenAI
 *
 * Chatbot flotante que usa la API de OpenAI para responder preguntas.
 *
 * Features:
 * - UI flotante (botón + ventana de chat)
 * - Streaming de respuestas en tiempo real
 * - Historial de conversación
 * - Auto-scroll al último mensaje
 * - Indicador de escritura
 * - Manejo de errores
 * - Rate limiting del lado del cliente
 *
 * @example
 * import ChatbotOpenAI from './ChatbotOpenAI';
 *
 * export default function Page() {
 *   return (
 *     <div>
 *       <ChatbotOpenAI />
 *     </div>
 *   );
 * }
 */

'use client';

// hooks
import { useState, useRef, useEffect } from 'react';
// utils
import { error as logError } from '../utils/logger';

// ============================================
// TIPOS
// ============================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Extrae fragmentos JSON desde cadenas concatenadas (p. ej. varios eventos SSE sin newline).
 */
function extractJsonFragments(raw: string): string[] {
  const fragments: string[] = [];
  let cursor = 0;
  const len = raw.length;

  while (cursor < len) {
    const start = raw.indexOf('{', cursor);
    if (start === -1) break;
    let depth = 0;
    let end = -1;

    for (let i = start; i < len; i++) {
      const char = raw[i];
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }

    if (end === -1) break;
    fragments.push(raw.slice(start, end + 1));
    cursor = end + 1;
  }

  return fragments;
}

function updateLastMessage(prev: Message[], assistantMessage: string): Message[] {
  const newMessages = [...prev];
  const lastIndex = newMessages.length - 1;

  if (lastIndex >= 0 && newMessages[lastIndex]) {
    newMessages[lastIndex] = {
      ...newMessages[lastIndex],
      content: assistantMessage,
    };
    return newMessages;
  }

  return [...newMessages, { role: 'assistant', content: assistantMessage, timestamp: Date.now() }];
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ChatbotOpenAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Envía un mensaje al chatbot
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Preparar historial para la API
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Llamar a la API
      const response = await fetch('/api/api-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          history,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la respuesta');
      }

      // Leer streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (!reader) {
        throw new Error('No se pudo leer la respuesta');
      }

      // Crear mensaje vacío del asistente
      const assistantMsg: Message = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const raw = String(data).trim();
              if (!raw.includes('{')) continue;

              const fragments = extractJsonFragments(raw);
              for (const fragment of fragments) {
                try {
                  const parsed = JSON.parse(fragment);
                  const delta = parsed.choices?.[0]?.delta?.content ?? parsed.content;
                  if (!delta) continue;
                  assistantMessage += delta;
                  setMessages(prev => updateLastMessage(prev, assistantMessage));
                } catch (innerErr) {
                  logError('Error parseando fragmento JSON:', innerErr, 'fragment:', fragment);
                }
              }
            } catch (e) {
              logError('Error parseando chunk:', e);
            }
          }
        }
      }
    } catch (err: unknown) {
      logError('Error en el chatbot:', err);
      // Normalizar el error para TypeScript: si es una Error usamos su message, si no usamos String() como fallback.
      if (err instanceof Error) {
        setError(err.message || 'Error desconocido');
      } else {
        setError(String(err) || 'Error desconocido');
      }

      // Remover el último mensaje si hubo error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Limpia la conversación
   */
  function handleClear() {
    setMessages([]);
    setError(null);
  }

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-300 to-red-600 hover:from-amber-300 hover:to-amber-700 text-black rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Abrir chat"
          title="¿Necesitas ayuda?"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-300 to-red-600 text-black p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">Asistente Virtual</h3>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="hover:bg-white/20 p-1 rounded transition"
                  title="Limpiar conversación"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
                title="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <p className="text-lg mb-2">👋 ¡Hola!</p>
                <p>¿En qué puedo ayudarte hoy?</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-red-300 to-red-600 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1 border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-red-300 to-red-600 hover:from-amber-300 hover:to-amber-700 text-black rounded-lg px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
