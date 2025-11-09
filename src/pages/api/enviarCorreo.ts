// Waku API Route - Usa Web Standards (Request/Response)
// Utilidades de seguridad
import {
  getClientIp,
  applySecurityHeaders,
  sanitizeForLogging,
  isValidEmail,
  sanitizeHtml,
  sanitizeEmail,
} from '../../utils/security';

// emailJS
import emailjs from '@emailjs/nodejs';

/**
 * Maneja las solicitudes de envío de correo electrónico para el formulario de contacto.
 *
 * Esta función procesa las solicitudes POST para enviar correos de contacto
 * a través de EmailJS. Aplica medidas de seguridad, sanitiza los datos de entrada
 * y valida la información antes del envío.
 *
 * @param request - El objeto Request estándar que contiene los datos del formulario
 *
 * @returns Promise<Response> - Retorna una respuesta JSON con el resultado de la operación
 *
 * @throws {400} Cuando el email es inválido o faltan datos requeridos
 * @throws {405} Cuando se usa un método HTTP diferente a POST
 * @throws {500} Cuando ocurre un error interno al enviar el correo
 *
 * @example
 * // Uso desde el frontend (como en Contacto.tsx):
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
 *     servicio: 'desarrollo_web',
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
export const POST = async (request: Request): Promise<Response> => {
  try {
    // Obtener y sanitizar IP del cliente
    const clientIp = getClientIp({ headers: request.headers });
    const sanitizedIp = sanitizeForLogging(clientIp);

    console.log(`Solicitud recibida de IP: ${sanitizedIp}`);

    // Obtener el body del request
    const body = await request.json();

    // Sanitizar body
    const sanitizedUser_email = sanitizeEmail(body.user_email);
    const sanitizedUser_nombre = sanitizeHtml(body.user_nombre);
    const sanitizedUser_mensaje = sanitizeHtml(body.user_mensaje);

    // Validar email
    if (!isValidEmail(body.user_email)) {
      const headers = new Headers();
      applySecurityHeaders(headers);
      return Response.json({ error: 'Email inválido' }, { status: 400, headers });
    }

    // Validar campos mínimos
    if (!sanitizedUser_email || !sanitizedUser_nombre || !sanitizedUser_mensaje) {
      const headers = new Headers();
      applySecurityHeaders(headers);
      return Response.json({ error: 'Datos insuficientes' }, { status: 400, headers });
    }

    // Validar que las variables de entorno de EmailJS estén definidas
    if (!process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
      const headers = new Headers();
      applySecurityHeaders(headers);
      return Response.json(
        { error: 'Configuración de EmailJS incompleta' },
        { status: 500, headers },
      );
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

    const headers = new Headers();
    applySecurityHeaders(headers);
    return Response.json(
      {
        message: 'Correo enviado correctamente',
        response,
      },
      { status: 200, headers },
    );
  } catch (error: unknown) {
    console.error('Error al enviar correo:', error);
    // Log detallado del error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    const headers = new Headers();
    applySecurityHeaders(headers);
    return Response.json({ error: 'Error interno al enviar el correo' }, { status: 500, headers });
  }
};
