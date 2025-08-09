import { NextRequest, NextResponse } from 'next/server';
import { WebhookOperationLogger } from '@/shared/lib/webhook-logger';
import {
  validateWebhookAuth,
  parseWebhookPayload,
  validateCollection,
  safeRevalidateWithLogger,
  CommonWebhookPayload,
} from '@/shared/lib/webhook-common';

interface TramiteWebhookPayload {
  event:
    | 'tramites.items.create'
    | 'tramites.items.update'
    | 'tramites.items.delete';
  collection: 'tramites';
  keys: string[];
  slug?: string;
  payload?: {
    id: string;
    slug?: string;
    titulo?: string;
    categoria?: string;
    contenido?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validar token de autorización
    if (!(await validateWebhookAuth(request))) {
      return NextResponse.json(
        { error: 'Token de autorización requerido o inválido' },
        { status: 401 },
      );
    }

    // 2. Parsear payload
    let payload: CommonWebhookPayload;
    try {
      payload = await parseWebhookPayload(request);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Payload inválido',
          message: error instanceof Error ? error.message : 'Error de parseo',
        },
        { status: 400 },
      );
    }

    // 3. Validar que sea la colección correcta
    if (!validateCollection(payload, 'tramites')) {
      return NextResponse.json(
        {
          message: `Evento ignorado - colección '${payload.collection}' no es 'tramites'`,
          collection: payload.collection,
        },
        { status: 200 },
      );
    }

    const { event, payload: data } = payload;
    const slug = payload.slug;

    // Inicializar logger con métricas de tiempo
    const logger = new WebhookOperationLogger('tramites', event, slug);

    const safeRevalidate = async (type: 'path' | 'tag', target: string) => {
      return await safeRevalidateWithLogger(logger, type, target);
    };

    switch (event) {
      case 'create':
        // Tags utilizados en los servicios reales
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-navigation');
        await safeRevalidate('tag', 'tramites-list');

        await safeRevalidate('path', '/tramites');
        await safeRevalidate('path', '/');
        break;

      case 'update':
        // Tags generales
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-navigation');
        await safeRevalidate('tag', 'tramites-list');

        // Tag específico del trámite
        if (slug) {
          await safeRevalidate('tag', `tramites-page-${slug}`);
          await safeRevalidate('path', `/tramites/${slug}`);
        }

        // Paths principales
        await safeRevalidate('path', '/tramites');
        await safeRevalidate('path', '/');
        break;

      case 'delete':
        // Tags generales (todos porque se eliminó contenido)
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-navigation');
        await safeRevalidate('tag', 'tramites-list');

        // Tag específico del trámite eliminado
        if (slug) {
          await safeRevalidate('tag', `tramites-page-${slug}`);
        }

        // Paths principales
        await safeRevalidate('path', '/tramites');
        await safeRevalidate('path', '/');
        break;

      default:
        return NextResponse.json(
          { error: `Evento no soportado: ${event}` },
          { status: 400 },
        );
    }

    // Finalizar logger y crear respuesta
    const result = logger.finish();

    return NextResponse.json({
      success: true,
      collection: 'tramites',
      event,
      slug,
      operations: result.operations.length,
      duration: result.totalDuration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Webhook de trámites activo',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    supportedEvents: [
      'tramites.items.create',
      'tramites.items.update',
      'tramites.items.delete',
    ],
    collection: 'tramites',
  });
}
