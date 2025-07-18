import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  newsCache,
  tramitesCache,
  relatedCache,
} from '@/shared/lib/aggressive-cache';
import { clearNavigationCache } from '@/features/tramites/services/docs-data';

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
        console.log('🔄 Processing tramite webhook...');

        // Limpiar TODOS los caches relacionados con trámites
        try {
          tramitesCache.clear(); // Cache en memoria (30 días)
          console.log('✅ Memory cache cleared');

          clearNavigationCache(); // Cache local (5 minutos)
          console.log('✅ Local navigation cache cleared');
        } catch (error) {
          console.error('❌ Error clearing caches:', error);
        }

        // Revalidar paths con layout para forzar regeneración del sidebar
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
          throw error; // Re-throw to ensure webhook fails if revalidation fails
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
          clearNavigationCache(); // Limpiar también cache local de navegación
          console.log('✅ All caches cleared');

          revalidatePath('/');
          revalidatePath('/tramites', 'layout'); // Asegurar que el layout se revalide
          console.log('✅ All paths revalidated');
        } catch (error) {
          console.error('❌ Error in fallback revalidation:', error);
          throw error;
        }

        console.log('✅ Fallback webhook completed successfully');
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
