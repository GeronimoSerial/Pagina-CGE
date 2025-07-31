import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearAllCaches } from '@/shared/lib/unified-cache';
import { clearNavigationCache } from '@/features/tramites/services/docs-data';
import { logger } from '@/shared/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const authHeader = request.headers.get('authorization');
    const userAgent = request.headers.get('user-agent');
    const body = await request.json();

    logger.webhook.received('revalidate', {
      authHeader: authHeader ? 'Present' : 'Missing',
      userAgent,
      body,
    });

    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      logger.warn('webhook', 'Unauthorized webhook attempt', { userAgent, authHeader: !!authHeader });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { model, entry } = body;

    switch (model) {
      case 'noticia':
        logger.info('webhook', 'Processing noticia revalidation', { slug: entry?.slug });
        
        // Limpiar todos los cachés
        clearAllCaches();
        logger.cache.clear('unified-cache', 'webhook-triggered');
        
        // Revalidar rutas principales
        await Promise.all([
          revalidatePath('/'),
          revalidatePath('/noticias'),
          revalidatePath('/noticias', 'layout'),
        ]);
        
        // Revalidar páginas de noticias
        const pageRevalidations = [];
        for (let i = 1; i <= 3; i++) {
          pageRevalidations.push(revalidatePath(`/noticias/page/${i}`));
        }
        pageRevalidations.push(revalidatePath('/noticias/page/[pageNumber]', 'page'));
        await Promise.all(pageRevalidations);

        // Revalidar noticia específica si hay slug
        if (entry?.slug) {
          await revalidatePath(`/noticias/${entry.slug}`);
        }

        console.log(
          `✅ Revalidated noticias in ${Date.now() - startTime}ms:`,
          entry?.slug || 'all',
        );
        break;

      case 'tramite':
        logger.info('webhook', 'Processing tramite revalidation', { slug: entry?.slug });

        // Limpiar cachés
        clearAllCaches();
        clearNavigationCache();

        // Revalidar rutas de trámites
        await Promise.all([
          revalidatePath('/tramites'),
          revalidatePath('/tramites', 'layout'),
        ]);

        if (entry?.slug) {
          await Promise.all([
            revalidatePath(`/tramites/${entry.slug}`),
            revalidatePath(`/tramites/${entry.slug}`, 'layout'),
          ]);
        }

        console.log(
          `✅ Revalidated tramites in ${Date.now() - startTime}ms:`,
          entry?.slug || 'all',
        );
        break;

      default:
        logger.info('webhook', 'Processing unknown model webhook (fallback)');

        // Limpiar todos los cachés
        clearAllCaches();
        clearNavigationCache();

        // Revalidar rutas principales
        await Promise.all([
          revalidatePath('/'),
          revalidatePath('/noticias'),
          revalidatePath('/tramites'),
        ]);

        console.log(`✅ Fallback revalidation completed in ${Date.now() - startTime}ms`);
    }

    const totalTime = Date.now() - startTime;
    logger.webhook.processed(model, totalTime);

    return NextResponse.json({
      success: true,
      revalidated: true,
      model,
      entry: entry?.slug,
      processingTimeMs: totalTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.webhook.error('revalidate', error as Error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
