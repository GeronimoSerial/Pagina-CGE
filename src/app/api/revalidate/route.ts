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

interface WebhookPayload {
  event: 'create' | 'update' | 'delete';
  collection: string;
  keys: string[];
  payload?: {
    id: string;
    slug?: string;
    esImportante?: boolean;
    titulo?: string;
    categoria?: string;
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
    if (!validateCollection(payload, 'noticias')) {
      const ignored = createIgnoredResponse(payload.collection, 'noticias');
      return NextResponse.json(ignored.body, { status: ignored.status });
    }

    const { event, payload: data } = payload;
    const slug = data?.slug;
    const esImportante = data?.esImportante;
    const categoria = data?.categoria;

    // Inicializar logger con métricas de tiempo
    const logger = new WebhookOperationLogger('noticias', event, slug);

    // Función helper usando la utilidad común
    const safeRevalidate = async (type: 'path' | 'tag', target: string) => {
      return await safeRevalidateWithLogger(logger, type, target);
    };

    // 6. Revalidar según evento
    switch (event) {
      case 'create':
        // Tags generales que se usan en múltiples fetches
        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-slugs');
        await safeRevalidate('tag', 'noticias-paginated');
        await safeRevalidate('tag', 'noticias-categorias');
        await safeRevalidate('tag', 'noticias-count');
        await safeRevalidate('tag', 'noticias-list');
        await safeRevalidate('tag', 'noticias-page-1');

        // Tags dinámicos de tipo para endpoint principal
        const noticiasTypes = ['featured', 'paginated', 'all'];
        for (const type of noticiasTypes) {
          await safeRevalidate('tag', `noticias-${type}`);
        }

        // Si es noticia importante, invalidar featured
        if (esImportante) {
          await safeRevalidate('tag', 'noticias-featured');
        }

        // Si tiene categoría, invalidar noticias de esa categoría
        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }

        // Paths principales
        await safeRevalidate('path', '/noticias');
        await safeRevalidate('path', '/noticias/page/1');
        await safeRevalidate('path', '/');
        break;

      case 'update':
        // Tags generales
        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-slugs');
        await safeRevalidate('tag', 'noticias-paginated');
        await safeRevalidate('tag', 'noticias-categorias');
        await safeRevalidate('tag', 'noticias-count');
        await safeRevalidate('tag', 'noticias-list');

        // Tag específico de la noticia
        if (slug) {
          await safeRevalidate('tag', `noticia-${slug}`);
          await safeRevalidate('path', `/noticias/${slug}`);
        }

        // Páginas de noticias (invalidar varias por si cambió de posición)
        for (let i = 1; i <= 5; i++) {
          await safeRevalidate('tag', `noticias-page-${i}`);
        }

        // Si es importante, invalidar featured
        if (esImportante) {
          await safeRevalidate('tag', 'noticias-featured');
        }

        // Si tiene categoría, invalidar noticias de esa categoría
        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }

        // Paths principales
        await safeRevalidate('path', '/noticias');
        await safeRevalidate('path', '/noticias/page/1');
        await safeRevalidate('path', '/');
        break;

      case 'delete':
        // Tags generales (todos porque se eliminó contenido)
        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-slugs');
        await safeRevalidate('tag', 'noticias-paginated');
        await safeRevalidate('tag', 'noticias-categorias');
        await safeRevalidate('tag', 'noticias-count');
        await safeRevalidate('tag', 'noticias-list');
        await safeRevalidate('tag', 'noticias-featured');

        // Tag específico de la noticia eliminada
        if (slug) {
          await safeRevalidate('tag', `noticia-${slug}`);
        }

        // Todas las páginas porque cambió la numeración
        for (let i = 1; i <= 5; i++) {
          await safeRevalidate('tag', `noticias-page-${i}`);
        }

        // Si tenía categoría, invalidar esa categoría
        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }

        // Paths principales
        await safeRevalidate('path', '/noticias');
        await safeRevalidate('path', '/noticias/page/1');
        await safeRevalidate('path', '/');
        break;

      default:
        return NextResponse.json(
          { error: `Evento no soportado: ${event}` },
          { status: 400 },
        );
    }

    // 7. Finalizar logger y crear respuesta usando utilidad común
    const result = logger.finish();
    const response = createWebhookResponse('noticias', event, result);

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
    status: 'Webhook activo',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    supportedEvents: ['create', 'update', 'delete'],
    collection: 'noticias',
  });
}
