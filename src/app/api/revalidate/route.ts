import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  newsCache,
  tramitesCache,
  relatedCache,
  newsPagesCache,
  featuredNewsCache,
} from '@/shared/lib/aggressive-cache';
import { clearNavigationCache } from '@/features/tramites/services/docs-data';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
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

    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      console.log('❌ Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { model, entry } = body;

    switch (model) {
      case 'noticia':
        console.log('📄 Revalidating noticias after webhook...');
        
        // Limpiar caches de memoria SIEMPRE
        newsCache.clear();
        relatedCache.clear();
        newsPagesCache.clear();
        featuredNewsCache.clear();
        
        // Revalidar rutas principales SIEMPRE
        revalidatePath('/');
        revalidatePath('/noticias');
        revalidatePath('/noticias', 'layout');

        // Estrategia inteligente basada en el tipo de operación
        const operation = entry?.operation || 'update'; // 'create', 'update', 'delete'
        
        if (operation === 'create') {
          // Nueva noticia: empuja TODAS las páginas existentes
          console.log('📝 New noticia: revalidating first 3 pages + pattern (content shifts)');
          for (let i = 1; i <= 3; i++) {
            revalidatePath(`/noticias/page/${i}`);
          }
          revalidatePath('/noticias/page/[pageNumber]', 'page'); // Marca patrón como stale
        } else if (operation === 'delete') {
          // Noticia eliminada: puede afectar múltiples páginas (desplazamiento)
          console.log('🗑️ Deleted noticia: revalidating first 5 pages + pattern');
          for (let i = 1; i <= 5; i++) {
            revalidatePath(`/noticias/page/${i}`);
          }
          revalidatePath('/noticias/page/[pageNumber]', 'page');
        } else {
          // Update: depende si cambió el orden (featured, fecha, etc.)
          const isImportantChange = entry?.esImportante !== undefined || entry?.fecha !== undefined;
          
          if (isImportantChange) {
            console.log('⭐ Important field changed: revalidating first 3 pages + pattern');
            for (let i = 1; i <= 3; i++) {
              revalidatePath(`/noticias/page/${i}`);
            }
          } else {
            console.log('✏️ Content update: revalidating page 1 + pattern');
            revalidatePath('/noticias/page/1');
          }
          
          revalidatePath('/noticias/page/[pageNumber]', 'page');
        }

        if (entry?.slug) {
          revalidatePath(`/noticias/${entry.slug}`);
        }

        const revalidationTime = Date.now() - startTime;
        console.log(
          `✅ Revalidated noticias (${operation}) in ${revalidationTime}ms:`,
          entry?.slug || 'all',
        );
        break;

      case 'tramite':
        console.log('🔄 Processing tramite webhook...');

        try {
          tramitesCache.clear();
          console.log('✅ Memory cache cleared');

          clearNavigationCache();
          console.log('✅ Local navigation cache cleared');
        } catch (error) {
          console.error('❌ Error clearing caches:', error);
        }

        try {
          revalidatePath('/tramites');
          console.log('✅ Revalidated /tramites');

          revalidatePath('/tramites', 'layout');
          console.log('✅ Revalidated /tramites layout');

          if (entry?.slug) {
            revalidatePath(`/tramites/${entry.slug}`);
            console.log(`✅ Revalidated /tramites/${entry.slug}`);

            revalidatePath(`/tramites/${entry.slug}`, 'layout');
            console.log(`✅ Revalidated /tramites/${entry.slug} layout`);
          }
        } catch (error) {
          console.error('❌ Error revalidating paths:', error);
          throw error;
        }

        console.log(
          '✅ Tramite webhook completed successfully:',
          entry?.slug || 'all',
        );
        break;

      default:
        console.log('🔄 Processing unknown model webhook (fallback)...');

        try {
          newsCache.clear();
          tramitesCache.clear();
          relatedCache.clear();
          clearNavigationCache();
          console.log('✅ All caches cleared');

          revalidatePath('/');
          revalidatePath('/tramites', 'layout');
          console.log('✅ All paths revalidated');
        } catch (error) {
          console.error('❌ Error in fallback revalidation:', error);
          throw error;
        }

        console.log('✅ Fallback webhook completed successfully');
    }

    const totalTime = Date.now() - startTime;
    console.log(`🕒 Total webhook processing time: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      revalidated: true,
      model,
      entry: entry?.slug,
      processingTimeMs: totalTime,
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
