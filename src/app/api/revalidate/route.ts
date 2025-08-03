import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logWebhookEvent } from '@/shared/lib/webhook-logger';

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
    // 1. Validar token
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;

    if (!authHeader || !expectedToken) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token !== expectedToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // 2. Parsear payload
    const rawBody = await request.text();
    if (!rawBody?.trim()) {
      return NextResponse.json({ error: 'Payload vacío' }, { status: 400 });
    }

    const body = JSON.parse(rawBody);

    // 3. Normalizar formato 
    let payload: WebhookPayload;

    if (typeof body.event === 'string' && body.event.includes('"event"')) {
      // Formato con payload anidado como string
      const actualPayload = JSON.parse(body.event);
      const action = actualPayload.event.split('.').pop();

      payload = {
        event: action as 'create' | 'update' | 'delete',
        collection: actualPayload.collection,
        keys: actualPayload.keys || [String(actualPayload.key)],
        payload: actualPayload.payload,
      };
    } else {
      // Formato directo
      payload = body as WebhookPayload;
    }

    // 4. Validar colección
    if (payload.collection !== 'noticias') {
      return NextResponse.json(
        { message: 'Evento ignorado - no es noticia' },
        { status: 200 },
      );
    }

    const { event, payload: data } = payload;
    const slug = data?.slug;
    const esImportante = data?.esImportante;
    const categoria = data?.categoria;

    const revalidated: string[] = [];
    const errors: string[] = [];

    // 5. Función helper para revalidar
    const safeRevalidate = async (type: 'path' | 'tag', target: string) => {
      try {
        if (type === 'path') {
          await revalidatePath(target);
        } else {
          await revalidateTag(target);
        }
        revalidated.push(`${type}:${target}`);
      } catch (error) {
        errors.push(
          `Error en ${type} '${target}': ${error instanceof Error ? error.message : 'Error desconocido'}`,
        );
      }
    };

    // 6. Revalidar según evento
    switch (event) {
      case 'create':
        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-paginated');
        await safeRevalidate('tag', 'noticias-page-1');

        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }
        if (esImportante) {
          await safeRevalidate('tag', 'noticias-featured');
        }

        await safeRevalidate('path', '/noticias');
        await safeRevalidate('path', '/noticias/page/1');
        await safeRevalidate('path', '/');
        break;

      case 'update':
        if (slug) {
          await safeRevalidate('path', `/noticias/${slug}`);
        }

        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-paginated');

        for (let i = 1; i <= 3; i++) {
          await safeRevalidate('tag', `noticias-page-${i}`);
        }

        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }
        if (esImportante) {
          await safeRevalidate('tag', 'noticias-featured');
        }

        await safeRevalidate('path', '/noticias');
        await safeRevalidate('path', '/noticias/page/1');
        await safeRevalidate('path', '/');
        break;

      case 'delete':
        await safeRevalidate('tag', 'noticias');
        await safeRevalidate('tag', 'noticias-paginated');
        await safeRevalidate('tag', 'noticias-featured');

        for (let i = 1; i <= 3; i++) {
          await safeRevalidate('tag', `noticias-page-${i}`);
        }

        if (categoria) {
          await safeRevalidate('tag', `noticias-categoria-${categoria}`);
        }

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

    // 7. Log del resultado
    const success = errors.length === 0;

    logWebhookEvent(
      event,
      slug,
      revalidated,
      success,
      success ? undefined : errors.join('; '),
    );

    // 8. Respuesta
    return NextResponse.json(
      {
        success,
        message: success
          ? `Revalidación exitosa para ${event}`
          : `Revalidación con ${errors.length} errores`,
        revalidated,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      },
      {
        status: success ? 200 : revalidated.length > 0 ? 207 : 500,
      },
    );
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
