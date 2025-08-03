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

  duration?: number;
  operationDetails?: OperationLog[];
}

interface OperationLog {
  type: 'path' | 'tag';
  target: string;
  duration: number;
  success: boolean;
  attempts?: number;
  error?: string;
}

let webhookLogs: WebhookLog[] = [];

export function logWebhookEvent(
  event: string,
  slug?: string,
  paths: string[] = [],
  success: boolean = true,
  error?: string,
  duration?: number,
  operationDetails?: OperationLog[],
) {
  const log: WebhookLog = {
    timestamp: new Date().toISOString(),
    event,
    slug,
    paths,
    success,
    ...(error && { error }),
    ...(duration && { duration }),
    ...(operationDetails && { operationDetails }),
  };

  webhookLogs.push(log);

  if (webhookLogs.length > 1000) {
    webhookLogs = webhookLogs.slice(-1000);
  }

  const durationInfo = duration ? ` (${duration}ms)` : '';
  const operationInfo = operationDetails
    ? ` - ${operationDetails.length} ops, avg: ${Math.round(operationDetails.reduce((sum, op) => sum + op.duration, 0) / operationDetails.length)}ms`
    : '';

  console.log(`📝 Webhook ${event}${durationInfo}${operationInfo}:`, {
    event,
    slug,
    success,
    pathCount: paths.length,
    timestamp: log.timestamp,
    ...(duration && { totalDuration: `${duration}ms` }),
    ...(operationDetails && {
      operations: {
        total: operationDetails.length,
        successful: operationDetails.filter((op) => op.success).length,
        failed: operationDetails.filter((op) => !op.success).length,
      },
    }),
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

  const logsWithDuration = webhookLogs.filter((log) => log.duration);
  const avgDuration =
    logsWithDuration.length > 0
      ? Math.round(
          logsWithDuration.reduce((sum, log) => sum + (log.duration || 0), 0) /
            logsWithDuration.length,
        )
      : 0;

  return {
    totalLogs,
    successCount,
    errorCount,
    lastUpdate,
    avgDuration,
    totalWithMetrics: logsWithDuration.length,
  };
}

/**
 * Helper para crear un logger de operaciones para un webhook específico
 */
export class WebhookOperationLogger {
  private operations: OperationLog[] = [];
  private startTime: number;

  constructor(
    private webhookType: string,
    private event: string,
    private slug?: string,
  ) {
    this.startTime = Date.now();
    console.log(
      `🚀 Iniciando ${webhookType} webhook: ${event}${slug ? ` (${slug})` : ''}`,
    );
  }

  logOperation(
    type: 'path' | 'tag',
    target: string,
    duration: number,
    success: boolean,
    error?: string,
    attempts = 1,
  ) {
    const operation: OperationLog = {
      type,
      target,
      duration,
      success,
      attempts,
      ...(error && { error }),
    };

    this.operations.push(operation);

    const status = success ? 'Success' : 'Failed';
    const attemptInfo = attempts > 1 ? ` (${attempts} attempts)` : '';
    console.log(`  ${status} ${type}:${target} - ${duration}ms${attemptInfo}`);

    if (error) {
      console.error(`     └─ Error: ${error}`);
    }
  }

  finish(): { totalDuration: number; operations: OperationLog[] } {
    const totalDuration = Date.now() - this.startTime;
    const successful = this.operations.filter((op) => op.success).length;
    const failed = this.operations.length - successful;

    console.log(
      `📊 ${this.webhookType} ${this.event} completado: ${totalDuration}ms total, ${successful}/${this.operations.length} exitosas`,
    );

    // Registrar en el sistema de logs existente
    const paths = this.operations.map((op) => `${op.type}:${op.target}`);
    logWebhookEvent(
      `${this.webhookType}-${this.event}`,
      this.slug,
      paths,
      failed === 0,
      failed > 0 ? `${failed} operaciones fallaron` : undefined,
      totalDuration,
      this.operations,
    );

    return {
      totalDuration,
      operations: [...this.operations],
    };
  }
}
