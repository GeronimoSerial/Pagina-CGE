import { NextRequest, NextResponse } from 'next/server';
import { WebhookOperationLogger } from '@/shared/lib/webhook-logger';
import {
  validateWebhookAuth,
  parseWebhookPayload,
  validateCollection,
  createErrorResponse,
  createIgnoredResponse,
  safeRevalidateWithLogger,
  createWebhookResponse,
  CommonWebhookPayload,
} from '@/shared/lib/webhook-common';

interface TramiteWebhookPayload {
  event: 'create' | 'update' | 'delete';
  collection: string;
  keys: string[];
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
      const error = createErrorResponse(
        'Token de autorización requerido o inválido',
        401,
      );
      return NextResponse.json(error.body, { status: error.status });
    }

    // 2. Parsear y validar payload
    let payload: CommonWebhookPayload;
    try {
      payload = await parseWebhookPayload(request);
    } catch (error) {
      const errorResponse = createErrorResponse(
        error instanceof Error ? error.message : 'Error al parsear payload',
        400,
      );
      return NextResponse.json(errorResponse.body, {
        status: errorResponse.status,
      });
    }

    // 3. Validar que sea la colección correcta
    if (!validateCollection(payload, 'tramites')) {
      const ignored = createIgnoredResponse(payload.collection, 'tramites');
      return NextResponse.json(ignored.body, { status: ignored.status });
    }

    const { event, payload: data } = payload;
    const slug = data?.slug;
    const categoria = data?.categoria;
    const titulo = data?.titulo;

    // Inicializar logger con métricas de tiempo
    const logger = new WebhookOperationLogger('tramites', event, slug);

    // Función helper usando la utilidad común
    const safeRevalidate = async (type: 'path' | 'tag', target: string) => {
      return await safeRevalidateWithLogger(logger, type, target);
    };

    // 6. Revalidar según el tipo de evento
    switch (event) {
      case 'create':
        // Revalidar tags principales
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-list');
        await safeRevalidate('tag', 'tramites-navigation');

        // Revalidar por categoría específica
        if (categoria) {
          const categoriaSlug = categoria.toLowerCase().replace(/\s+/g, '-');
          await safeRevalidate('tag', `tramites-categoria-${categoriaSlug}`);

          // Especial atención a ISR
          if (categoria.toLowerCase().includes('isr')) {
            await safeRevalidate('tag', 'tramites-categoria-isr');
          }
        }

        // Revalidar paths principales
        await safeRevalidate('path', '/tramites');
        break;

      case 'update':
        // Revalidar página específica
        if (slug) {
          await safeRevalidate('tag', `tramites-page-${slug}`);
          await safeRevalidate('path', `/tramites/${slug}`);
        }

        // Revalidar tags principales
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-list');
        await safeRevalidate('tag', 'tramites-navigation');

        // Revalidar por categoría
        if (categoria) {
          const categoriaSlug = categoria.toLowerCase().replace(/\s+/g, '-');
          await safeRevalidate('tag', `tramites-categoria-${categoriaSlug}`);

          // Especial atención a ISR
          if (categoria.toLowerCase().includes('isr')) {
            await safeRevalidate('tag', 'tramites-categoria-isr');
          }
        }

        await safeRevalidate('path', '/tramites');
        break;

      case 'delete':
        // Revalidar todo cuando se elimina contenido
        await safeRevalidate('tag', 'tramites-all');
        await safeRevalidate('tag', 'tramites-list');
        await safeRevalidate('tag', 'tramites-navigation');

        if (categoria) {
          const categoriaSlug = categoria.toLowerCase().replace(/\s+/g, '-');
          await safeRevalidate('tag', `tramites-categoria-${categoriaSlug}`);

          if (categoria.toLowerCase().includes('isr')) {
            await safeRevalidate('tag', 'tramites-categoria-isr');
          }
        }

        await safeRevalidate('path', '/tramites');
        break;

      default:
        return NextResponse.json(
          { error: `Evento no soportado: ${event}` },
          { status: 400 },
        );
    }

    // 7. Finalizar logger y crear respuesta usando utilidad común
    const result = logger.finish();
    const response = createWebhookResponse('trámite', event, result, {
      event,
      slug,
      categoria,
      titulo,
    });

    return NextResponse.json(response.body, { status: response.status });
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
    supportedEvents: ['create', 'update', 'delete'],
    collection: 'tramites',
    specialCategories: ['ISR', 'General'],
    endpoints: {
      webhook: '/api/revalidateTramites',
      monitoring: '/api/monitoring',
    },
  });
}
