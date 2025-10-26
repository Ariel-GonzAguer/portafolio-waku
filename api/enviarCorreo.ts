// vercel
import { VercelRequest, VercelResponse } from '@vercel/node';
// Utilidades de seguridad
import {
  getClientIp,
  applySecurityHeaders,
  sanitizeForLogging,
  isValidEmail,
  sanitizeHtml,
  sanitizeEmail
} from '../src/utils/security';

// emailJS
import emailjs from '@emailjs/nodejs';

/**
 * Maneja las solicitudes de envío de correo electrónico para pedidos de la tienda.
 * 
 * Esta función procesa las solicitudes POST para enviar correos de confirmación
 * de pedidos a los clientes utilizando EmailJS. Aplica medidas de seguridad,
 * sanitiza los datos de entrada y valida la información antes del envío.
 * 
 * @param req - El objeto de solicitud de Vercel que contiene los datos del pedido
 * @param res - El objeto de respuesta de Vercel para enviar la respuesta al cliente
 * 
 * @returns Promise<void> - Retorna una respuesta JSON con el resultado de la operación
 * 
 * @throws {400} Cuando el email es inválido o faltan datos requeridos
 * @throws {405} Cuando se usa un método HTTP diferente a POST
 * @throws {500} Cuando ocurre un error interno al enviar el correo
 * 
 * @example
 * // Uso desde el frontend (como en Carrito.tsx):
 * ```typescript
 * const response = await fetch('/api/enviarCorreo', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     user_email: 'cliente@ejemplo.com',
 *     user_nombre: 'Juan Pérez',
 *     user_mensaje: 'Quiero agendar una cita.',
 *   }),
 * });
 * 
 * const data = await response.json();
 * if (response.ok) {
 *   console.log('Correo enviado:', data.message);
 * } else {
 *   console.error('Error:', data.error);
 * }
 * ```
 * 
 * @security
 * - Aplica cabeceras de seguridad HTTP
 * - Sanitiza todas las entradas del usuario
 * - Valida formato de email
 * - Registra IP del cliente para auditoría
 * - Solo acepta métodos POST
 * 
 * @dependencies
 * - EmailJS para el envío de correos
 * - Variables de entorno: EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, EMAILJS_SERVICE_ID
 * - Funciones de validación y sanitización personalizadas
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Aplicar cabeceras de seguridad
  applySecurityHeaders(res);
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtener y sanitizar IP del cliente
  const clientIp = getClientIp(req);
  const sanitizedIp = sanitizeForLogging(clientIp || 'IP desconocida');

  // sanitizar body
  const sanitizedUser_email = sanitizeEmail(req.body.user_email);
  const sanitizedUser_nombre = sanitizeHtml(req.body.user_nombre);
  const sanitizedUser_mensaje = sanitizeHtml(req.body.user_mensaje);

  console.log(`Solicitud recibida de IP: ${sanitizedIp}`);

  /* *** 

  LOGS PARA REVISAR DATOS QUE LLEGARÁN A EMAILJS → BORRRAR AL FINAL
  console.log('Vercel → Datos que llegan a EmailJS:', {
    user_email: sanitizedUser_email,
    user_nombre: sanitizedUser_nombre,
    user_mensaje: sanitizedUser_mensaje
  });

   *** */

  // Validar email
  if (!isValidEmail(req.body.user_email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    // Validar campos mínimos
    if (!sanitizedUser_email || !sanitizedUser_nombre || !sanitizedUser_mensaje) {
      return res.status(400).json({ error: 'Datos insuficientes' });
    }

    // Validar que las variables de entorno de EmailJS estén definidas
    if (!process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
      return res.status(500).json({ error: 'Configuración de EmailJS incompleta' });
    }

    // Inicializar EmailJS con las credenciales
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!,
    });

    const response = await emailjs.send(process.env.EMAILJS_SERVICE_ID!, 'CAMBIAR', {
      user_email: sanitizedUser_email,
      user_nombre: sanitizedUser_nombre,
      user_mensaje: sanitizedUser_mensaje,
    });

    return res.status(200).json({
      message: 'Correo enviado correctamente',
      response,
    });
  } catch (error: unknown) {
    console.error('Error al enviar correo:', error);
    // Log detallado del error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({ error: 'Error interno al enviar el correo' });
  }
}
