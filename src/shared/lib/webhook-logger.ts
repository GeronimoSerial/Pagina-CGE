/**
 * Utilidades para logging de webhook
 * Separado del route handler para evitar conflictos de Next.js
 */

interface WebhookLog {
  timestamp: string;
  event: string;
  slug?: string;
  paths: string[];
  success: boolean;
  error?: string;
}

// En un escenario real, esto iría a una base de datos o Redis
// Por ahora usamos memoria del proceso (se pierde al reiniciar)
let webhookLogs: WebhookLog[] = [];

/**
 * Función auxiliar para registrar logs desde el webhook
 */
export function logWebhookEvent(
  event: string,
  slug?: string,
  paths: string[] = [],
  success: boolean = true,
  error?: string,
) {
  const log: WebhookLog = {
    timestamp: new Date().toISOString(),
    event,
    slug,
    paths,
    success,
    ...(error && { error }),
  };

  webhookLogs.push(log);

  // Mantener solo los últimos 1000 logs para evitar memory leaks
  if (webhookLogs.length > 1000) {
    webhookLogs = webhookLogs.slice(-1000);
  }

  console.log('📝 Log de webhook registrado:', {
    event,
    slug,
    success,
    pathCount: paths.length,
    timestamp: log.timestamp,
  });
}

/**
 * Obtener todos los logs (usado por el endpoint de monitoreo)
 */
export function getWebhookLogs(limit: number = 50): WebhookLog[] {
  return webhookLogs.slice(-limit);
}

/**
 * Limpiar todos los logs
 */
export function clearWebhookLogs(): number {
  const previousCount = webhookLogs.length;
  webhookLogs = [];
  return previousCount;
}

/**
 * Obtener estadísticas de logs
 */
export function getWebhookLogStats() {
  const totalLogs = webhookLogs.length;
  const successCount = webhookLogs.filter((log) => log.success).length;
  const errorCount = totalLogs - successCount;
  const lastUpdate = webhookLogs[webhookLogs.length - 1]?.timestamp;

  return {
    totalLogs,
    successCount,
    errorCount,
    lastUpdate,
  };
}
