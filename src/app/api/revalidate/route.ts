import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  newsCache,
  tramitesCache,
  relatedCache,
} from '@/shared/lib/aggressive-cache';

export async function POST(request: NextRequest) {
  try {
    // Log detallado para debugging
    const authHeader = request.headers.get('authorization');
    const userAgent = request.headers.get('user-agent');
    const body = await request.json();

    console.log('🔔 Webhook received:', {
      timestamp: new Date().toISOString(),
      authHeader: authHeader ? 'Present' : 'Missing',
      userAgent,
      body: JSON.stringify(body, null, 2),
      headers: Object.fromEntries(request.headers.entries()),
    });

    // Verificar token
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      console.log('❌ Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { model, entry } = body;

    // Revalidar según el contenido
    switch (model) {
      case 'noticia':
        newsCache.clear(); // Limpiar cache de noticias en RAM
        relatedCache.clear(); // Limpiar cache de noticias relacionadas
        revalidatePath('/');
        revalidatePath('/noticias');

        if (entry?.slug) {
          revalidatePath(`/noticias/${entry.slug}`);
        }

        console.log(
          '✅ Revalidated noticias and related cache:',
          entry?.slug || 'all',
        );
        break;

      case 'tramite':
        tramitesCache.clear(); // Limpiar cache de trámites en RAM
        revalidatePath('/tramites');
        revalidatePath('/tramites', 'layout'); // Revalidar layout para actualizar sidebar
        //revalidateTag('tramites');

        if (entry?.slug) {
          revalidatePath(`/tramites/${entry.slug}`);
          revalidatePath(`/tramites/${entry.slug}`, 'layout'); // Revalidar layout específico
        }

        console.log(
          '✅ Revalidated tramites and layout:',
          entry?.slug || 'all',
        );
        break;

      default:
        newsCache.clear();
        tramitesCache.clear();
        relatedCache.clear(); // Limpiar cache de noticias relacionadas
        revalidatePath('/');
        console.log('✅ Revalidated all paths (fallback)');
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      model,
      entry: entry?.slug,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
