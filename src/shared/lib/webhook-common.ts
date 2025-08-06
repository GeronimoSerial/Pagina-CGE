/**
 * Utilidades comunes para webhooks de revalidación
 */

import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { WebhookOperationLogger } from './webhook-logger';

export interface CommonWebhookPayload {
  event: 'create' | 'update' | 'delete';
  collection: string;
  keys: string[];
  slug?: string; 
  payload?: Record<string, any>;
}

/**
 * Validar el token de autorización del webhook
 */
export async function validateWebhookAuth(
  request: NextRequest,
): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;

  if (!authHeader || !expectedToken) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === expectedToken;
}

/**
 * Parsear y normalizar el payload del webhook
 */
export async function parseWebhookPayload(
  request: NextRequest,
): Promise<CommonWebhookPayload> {
  const rawBody = await request.text();

  if (!rawBody?.trim()) {
    throw new Error('Payload vacío');
  }

  let body = JSON.parse(rawBody.trim());
  
  // Si es string, parsearlo una vez más
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }

  // Extraer slug del payload si existe
  let slug: string | undefined;
  let payloadData: any = {};
  
  if (body.payload) {
    if (typeof body.payload === 'string') {
      try {
        payloadData = JSON.parse(body.payload);
      } catch {
        payloadData = {};
      }
    } else {
      payloadData = body.payload;
    }
    slug = payloadData.slug;
  }

  return {
    event: body.event?.includes('create') ? 'create' : 
           body.event?.includes('delete') ? 'delete' : 'update',
    collection: body.collection || '',
    keys: body.keys || [],
    slug,
    payload: payloadData,
  };
}

/**
 * Validar que el payload pertenece a la colección esperada
 */
export function validateCollection(
  payload: CommonWebhookPayload,
  expectedCollection: string,
): boolean {
  return payload.collection === expectedCollection;
}

/**
 * Crear respuesta de error estándar para webhooks
 */
export function createErrorResponse(message: string, status: number = 400) {
  return {
    body: { error: message },
    status,
  };
}

/**
 * Crear respuesta de colección ignorada
 */
export function createIgnoredResponse(
  collection: string,
  expectedCollection: string,
) {
  return {
    body: {
      message: `Evento ignorado - no es de la colección ${expectedCollection}`,
      collection,
    },
    status: 200,
  };
}

/**
 * Función helper mejorada para revalidar con métricas
 */
export async function safeRevalidateWithLogger(
  logger: WebhookOperationLogger,
  type: 'path' | 'tag',
  target: string,
  maxRetries: number = 1,
): Promise<boolean> {
  const startTime = Date.now();
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    try {
      if (type === 'path') {
        await revalidatePath(target);
      } else {
        await revalidateTag(target);
      }
      const duration = Date.now() - startTime;
      logger.logOperation(type, target, duration, true, undefined, attempts);
      return true;
    } catch (error) {
      if (attempts >= maxRetries) {
        const duration = Date.now() - startTime;
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        logger.logOperation(
          type,
          target,
          duration,
          false,
          errorMessage,
          attempts,
        );
        return false;
      }
      // Breve pausa antes del retry
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return false;
}

/**
 * Crear respuesta estándar de webhook con métricas
 */
export function createWebhookResponse(
  webhookType: string,
  event: string,
  result: { totalDuration: number; operations: any[] },
  extraData: Record<string, any> = {},
) {
  const failed = result.operations.filter((op) => !op.success);
  const successful = result.operations.filter((op) => op.success);
  const success = failed.length === 0;

  return {
    body: {
      success,
      message: success
        ? `Revalidación exitosa para ${webhookType} ${event}`
        : `Revalidación con ${failed.length} errores`,
      ...extraData,
      totalDuration: result.totalDuration,
      operations: {
        total: result.operations.length,
        successful: successful.length,
        failed: failed.length,
        avgDuration:
          result.operations.length > 0
            ? Math.round(
                result.operations.reduce(
                  (sum: number, op: any) => sum + op.duration,
                  0,
                ) / result.operations.length,
              )
            : 0,
      },
      details: result.operations.map((op: any) => ({
        type: op.type,
        target: op.target,
        duration: `${op.duration}ms`,
        success: op.success,
        ...(op.error && { error: op.error }),
        ...(op.attempts && op.attempts > 1 && { attempts: op.attempts }),
      })),
      errors:
        failed.length > 0
          ? failed.map((op: any) => `${op.type}:${op.target} - ${op.error}`)
          : undefined,
      timestamp: new Date().toISOString(),
    },
    status: success ? 200 : successful.length > 0 ? 207 : 500,
  };
}
