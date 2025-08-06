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
  event:
    | 'noticias.items.create'
    | 'noticias.items.update'
    | 'noticias.items.delete';
  collection: 'noticias';
  keys: string[];
  slug?: string;
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
      return NextResponse.json(
        { error: 'Token de autorización requerido o inválido' },
        { status: 401 }
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
        { status: 400 }
      );
    }

    // 3. Validar que sea la colección correcta
    if (!validateCollection(payload, 'noticias')) {
      return NextResponse.json(
        {
          message: `Evento ignorado - colección '${payload.collection}' no es 'noticias'`,
          collection: payload.collection,
        },
        { status: 200 }
      );
    }

    const { event, payload: data } = payload;
    const slug = payload.slug;
    const esImportante = data?.esImportante;
    const categoria = data?.categoria;

    // Inicializar logger con métricas de tiempo
    const logger = new WebhookOperationLogger('noticias', event, slug);

    // Función helper usando la utilidad común
    const safeRevalidate = async (type: 'path' | 'tag', target: string) => {
      return await safeRevalidateWithLogger(logger, type, target);
    };

    // Revalidar según evento
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
          { status: 400 }
        );
    }

    // Finalizar logger y crear respuesta
    const result = logger.finish();
    
    return NextResponse.json({
      success: true,
      collection: 'noticias',
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
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Webhook activo',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    supportedEvents: [
      'noticias.items.create',
      'noticias.items.update',
      'noticias.items.delete',
    ],
    collection: 'noticias',
  });
}
