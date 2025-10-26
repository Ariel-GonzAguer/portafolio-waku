/**
 * Utilidades de seguridad para SuperKeg
 *
 * Este módulo contiene funciones reutilizables para implementar
 * medidas de seguridad en toda la aplicación.
 */

/**
 * Sanitiza texto HTML para prevenir ataques XSS
 * @param text - Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeHtml(text: string | unknown): string {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida formato de email
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
}

/**
 * Sanitiza un email removiendo caracteres peligrosos y normalizándolo
 * @param email - Email a sanitizar
 * @returns Email sanitizado
 * @example
 * ```typescript
 * const email = sanitizeEmail('  USER@EXAMPLE.COM  ');
 * console.log(email); // 'user@example.com'
 * ```
 */
export function sanitizeEmail(email: string | unknown): string {
  if (typeof email !== 'string') {
    return '';
  }

  return email
    .trim() // Eliminar espacios al inicio y final
    .toLowerCase() // Convertir a minúsculas
    .replace(/[<>]/g, '') // Eliminar caracteres HTML peligrosos
    .replace(/[^\w@.-]/g, '') // Solo permitir caracteres alfanuméricos, @, . y -
    .slice(0, 100); // Limitar longitud máxima
}

/**
 * Normaliza un email para comparaciones y almacenamiento seguro
 * @param email - Email a normalizar
 * @returns Email normalizado o cadena vacía si es inválido
 * @example
 * ```typescript
 * const email = normalizeEmail('  User+tag@Gmail.Com  ');
 * console.log(email); // 'user@gmail.com'
 * ```
 */
export function normalizeEmail(email: string | unknown): string {
  const sanitized = sanitizeEmail(email);
  
  if (!isValidEmail(sanitized)) {
    return '';
  }

  // Separar usuario y dominio
  const [user, domain] = sanitized.split('@');
  
  if (!user || !domain) {
    return '';
  }
  
  // Para Gmail, remover puntos y etiquetas (+)
  let normalizedUser = user;
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    normalizedUser = user.replace(/\./g, '').split('+')[0] || user;
  }

  return `${normalizedUser}@${domain}`;
}

/**
 * Valida y sanitiza un email de forma completa
 * @param email - Email a procesar
 * @returns Objeto con email sanitizado y estado de validez
 * @example
 * ```typescript
 * const result = validateAndSanitizeEmail('user@example.com');
 * if (result.isValid) {
 *   console.log('Email válido:', result.email);
 * }
 * ```
 */
export function validateAndSanitizeEmail(email: string | unknown): {
  isValid: boolean;
  email: string;
  error?: string;
} {
  if (typeof email !== 'string') {
    return {
      isValid: false,
      email: '',
      error: 'El email debe ser una cadena de texto'
    };
  }

  const sanitized = sanitizeEmail(email);
  
  if (!sanitized) {
    return {
      isValid: false,
      email: '',
      error: 'Email vacío después de sanitizar'
    };
  }

  if (!isValidEmail(sanitized)) {
    return {
      isValid: false,
      email: sanitized,
      error: 'Formato de email inválido'
    };
  }

  return {
    isValid: true,
    email: sanitized
  };
}

/**
 * Oculta parcialmente un email para mostrar en logs o UI
 * @param email - Email a ocultar
 * @returns Email parcialmente oculto
 * @example
 * ```typescript
 * const masked = maskEmail('usuario@ejemplo.com');
 * console.log(masked); // 'us****@ejemplo.com'
 * ```
 */
export function maskEmail(email: string | unknown): string {
  if (typeof email !== 'string' || !email.includes('@')) {
    return '***';
  }

  const [user, domain] = email.split('@');
  
  if (!user || !domain) {
    return '***';
  }
  
  if (user.length <= 2) {
    return `**@${domain}`;
  }

  const maskedUser = user.slice(0, 2) + '*'.repeat(Math.max(user.length - 2, 2));
  return `${maskedUser}@${domain}`;
}

/**
 * Valida longitud de string para prevenir ataques
 * @param text - Texto a validar
 * @param maxLength - Longitud máxima permitida
 * @returns true si la longitud es válida
 */
export function isValidLength(text: string, maxLength: number): boolean {
  return Boolean(text) && text.length > 0 && text.length <= maxLength;
}

/**
 * Normaliza dirección IP para rate limiting
 * @param req - Request object de Vercel
 * @returns IP normalizada
 */
export function getClientIp(req: {
  headers: { [key: string]: string | string[] | undefined };
}): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];

  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips ? ips.split(',')[0]?.trim() || 'unknown' : 'unknown';
  }

  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] || 'unknown' : realIp;
  }

  return 'unknown';
}

/**
 * Sanitiza logs para evitar exposición de información sensible
 * @param data - Datos a loggear
 * @returns Datos sanitizados para logging
 */
export function sanitizeForLogging(data: unknown): unknown {
  if (typeof data === 'string') {
    // Ocultar información sensible en strings
    return data
      .replace(/password[^&\s]*/gi, 'password=***')
      .replace(/key[^&\s]*/gi, 'key=***')
      .replace(/token[^&\s]*/gi, 'token=***');
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...(data as Record<string, unknown>) };
    const sensitiveKeys = ['password', 'key', 'token', 'secret', 'credential'];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '***';
      }
    }

    return sanitized;
  }

  return data;
}

/**
 * Headers de seguridad comunes para APIs
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Aplica headers de seguridad a una respuesta
 * @param res - Response object
 */
export function applySecurityHeaders(res: {
  setHeader: (key: string, value: string) => void;
}): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}
