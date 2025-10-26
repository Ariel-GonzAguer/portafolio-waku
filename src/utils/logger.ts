/**
 * Sistema de logging centralizado para SuperKeg
 *
 * Proporciona métodos estandarizados para logging que pueden ser
 * fácilmente deshabilitados en producción o configurados por nivel.
 *
 * Ventajas:
 * - Control centralizado de todos los logs
 * - Fácil desactivación en producción
 * - Formato consistente de mensajes
 * - Posibilidad de extender (enviar a servicios externos, etc.)
 * - Mejor debugging con contexto adicional
 *
 * @module logger
 */

/**
 * Niveles de logging disponibles
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

/**
 * Configuración del logger
 */
interface LoggerConfig {
  /** Nivel mínimo de logging. 'none' deshabilita todo */
  level: LogLevel;
  /** Si se debe incluir timestamp en los logs */
  includeTimestamp: boolean;
  /** Prefijo para todos los mensajes */
  prefix: string;
}

/**
 * Configuración por defecto
 * En producción, cambiar level a 'error' o 'none'
 */
const isProd =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'production';
const config: LoggerConfig = {
  level: isProd ? 'error' : 'debug',
  includeTimestamp: true,
  prefix: '[SuperKeg]',
};

/**
 * Jerarquía de niveles para comparación
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

/**
 * Verifica si un nivel de log está habilitado
 */
function isLevelEnabled(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level];
}

/**
 * Formatea el mensaje con prefijo y timestamp
 */
function formatMessage(level: string, message: string): string {
  const parts = [config.prefix, `[${level.toUpperCase()}]`];

  if (config.includeTimestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }

  parts.push(message);
  return parts.join(' ');
}

/**
 * Logging de nivel DEBUG
 * Información detallada para debugging durante desarrollo
 */
export function debug(message: string, ...args: unknown[]): void {
  if (!isLevelEnabled('debug')) return;
  // @eslint-disable-next-line no-console
  console.log(formatMessage('debug', message), ...args);
}

/**
 * Logging de nivel INFO
 * Información general sobre el flujo de la aplicación
 */
export function info(message: string, ...args: unknown[]): void {
  if (!isLevelEnabled('info')) return;
  // @eslint-disable-next-line no-console
  console.info(formatMessage('info', message), ...args);
}

/**
 * Logging de nivel WARN
 * Advertencias que no son errores críticos pero requieren atención
 */
export function warn(message: string, ...args: unknown[]): void {
  if (!isLevelEnabled('warn')) return;
  // @eslint-disable-next-line no-console
  console.warn(formatMessage('warn', message), ...args);
}

/**
 * Logging de nivel ERROR
 * Errores críticos que afectan la funcionalidad
 */
export function error(message: string, ...args: unknown[]): void {
  if (!isLevelEnabled('error')) return;
  // @eslint-disable-next-line no-console
  console.error(formatMessage('error', message), ...args);
}

/**
 * Actualiza la configuración del logger
 * Útil para cambiar el nivel de logging dinámicamente
 */
export function configure(newConfig: Partial<LoggerConfig>): void {
  Object.assign(config, newConfig);
}

/**
 * Obtiene la configuración actual
 */
export function getConfig(): Readonly<LoggerConfig> {
  return { ...config };
}

/**
 * Exportación por defecto con todos los métodos
 */
export default {
  debug,
  info,
  warn,
  error,
  configure,
  getConfig,
};
