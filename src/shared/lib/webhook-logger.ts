/**
 * Utilidades para logging de webhook
 */

interface WebhookLog {
  timestamp: string;
  event: string;
  slug?: string;
  paths: string[];
  success: boolean;
  error?: string;
}


let webhookLogs: WebhookLog[] = [];


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
