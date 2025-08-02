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
    // 1. Validar token de seguridad
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    
    if (!authHeader || !expectedToken) {
      console.warn('🔐 Intento de acceso sin token de autorización');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (token !== expectedToken) {
      console.warn('🔐 Intento de acceso con token inválido');
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // 2. Parsear payload
    const body: WebhookPayload = await request.json();
    
    // 3. Validar que es una noticia
    if (body.collection !== 'noticias') {
      console.log(`📝 Evento ignorado - colección: ${body.collection}`);
      return NextResponse.json(
        { message: 'Evento ignorado - no es una noticia' },
        { status: 200 }
      );
    }

    const { event, payload } = body;
    const slug = payload?.slug;
    const esImportante = payload?.esImportante;
    const titulo = payload?.titulo;
    const categoria = payload?.categoria;
    
    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];
    const errors: string[] = [];

    // 4. Función auxiliar para revalidar tags de forma segura
    const safeRevalidateTag = async (tag: string): Promise<boolean> => {
      try {
        await Promise.resolve(revalidateTag(tag));
        revalidatedTags.push(tag);
        console.log(`✅ Tag revalidado: ${tag}`);
        return true;
      } catch (error) {
        const errorMsg = `Error revalidando tag '${tag}': ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
        return false;
      }
    };

    // 5. Función auxiliar para revalidar paths de forma segura
    const safeRevalidatePath = async (path: string): Promise<boolean> => {
      try {
        await Promise.resolve(revalidatePath(path));
        revalidatedPaths.push(path);
        console.log(`✅ Ruta revalidada: ${path}`);
        return true;
      } catch (error) {
        const errorMsg = `Error revalidando ruta '${path}': ${error instanceof Error ? error.message : 'Error desconocido'}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
        return false;
      }
    };

    // 6. Revalidar según el tipo de evento de forma secuencial
    switch (event) {
      case 'create':
        console.log(`📰 Nueva noticia creada: ${titulo || 'Sin título'}`);
        console.log(`🔄 Iniciando revalidación secuencial para nueva noticia...`);
        
        try {
          // FASE 1: Revalidar tags de API primero (orden de prioridad)
          console.log(`🏷️ Fase 1: Revalidando tags base de API...`);
          await safeRevalidateTag('noticias');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-paginated');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-page-1');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // FASE 2: Tags específicos por categoría
          if (categoria) {
            console.log(`🏷️ Fase 2: Revalidando categoría '${categoria}'...`);
            await safeRevalidateTag(`noticias-categoria-${categoria}`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 3: Si es importante, revalidar featured
          if (esImportante) {
            console.log(`⭐ Fase 3: Revalidando noticias destacadas...`);
            await safeRevalidateTag('noticias-featured');
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 4: Revalidar páginas después de los tags
          console.log(`🌐 Fase 4: Revalidando páginas principales...`);
          await safeRevalidatePath('/noticias');
          await new Promise(resolve => setTimeout(resolve, 100));
          
          await safeRevalidatePath('/noticias/page/1');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // FASE 5: Si es importante, revalidar home al final
          if (esImportante) {
            console.log(`🏠 Fase 5: Revalidando página principal (home)...`);
            await safeRevalidatePath('/');
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          console.log(`✅ Revalidación para nueva noticia terminada. Total: ${revalidatedTags.length} tags, ${revalidatedPaths.length} rutas`);
          
        } catch (error) {
          console.error('❌ Error durante revalidación de noticia creada:', error);
          errors.push(`Error general en create: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
        break;

      case 'update':
        console.log(`✏️ Noticia actualizada: ${titulo || 'Sin título'} (${slug || 'sin slug'})`);
        console.log(`🔄 Iniciando revalidación completa secuencial...`);
        
        try {
          // FASE 1: Revalidar página específica primero (más crítico)
          if (slug) {
            console.log(`📄 Fase 1: Revalidando página específica...`);
            await safeRevalidatePath(`/noticias/${slug}`);
            // Pequeña pausa para evitar sobrecarga
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // FASE 2: Revalidar tags de API base (orden de prioridad)
          console.log(`🏷️ Fase 2: Revalidando tags base de API...`);
          await safeRevalidateTag('noticias');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-paginated');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-page-1');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // FASE 3: Revalidar múltiples páginas de paginación secuencialmente
          console.log(`📊 Fase 3: Revalidando páginas de paginación...`);
          for (let i = 2; i <= 5; i++) {
            await safeRevalidateTag(`noticias-page-${i}`);
            await new Promise(resolve => setTimeout(resolve, 30));
          }
          
          // FASE 4: Tags específicos por categoría
          if (categoria) {
            console.log(`🏷️ Fase 4: Revalidando categoría '${categoria}'...`);
            await safeRevalidateTag(`noticias-categoria-${categoria}`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 5: Revalidar featured si es importante
          if (esImportante) {
            console.log(`⭐ Fase 5: Revalidando noticias destacadas...`);
            await safeRevalidateTag('noticias-featured');
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 6: Revalidar todas las páginas principales secuencialmente
          console.log(`🌐 Fase 6: Revalidando páginas principales...`);
          await safeRevalidatePath('/noticias');
          await new Promise(resolve => setTimeout(resolve, 100));
          
          await safeRevalidatePath('/noticias/page/1');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Revalidar múltiples páginas de listado si es necesario
          for (let i = 2; i <= 3; i++) {
            await safeRevalidatePath(`/noticias/page/${i}`);
            await new Promise(resolve => setTimeout(resolve, 30));
          }
          
          // FASE 7: Revalidar home si es noticia importante (al final)
          if (esImportante) {
            console.log(`🏠 Fase 7: Revalidando página principal (home)...`);
            await safeRevalidatePath('/');
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          console.log(`✅ Revalidación completa terminada. Total: ${revalidatedTags.length} tags, ${revalidatedPaths.length} rutas`);
          
        } catch (error) {
          console.error('❌ Error durante revalidación de noticia actualizada:', error);
          errors.push(`Error general en update: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
        break;

      case 'delete':
        console.log(`🗑️ Noticia eliminada: ${titulo || 'Sin título'}`);
        console.log(`🔄 Iniciando revalidación completa por eliminación...`);
        
        try {
          // FASE 1: Revalidar tags base críticos
          console.log(`🏷️ Fase 1: Revalidando tags base críticos...`);
          await safeRevalidateTag('noticias');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-paginated');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          await safeRevalidateTag('noticias-featured');
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // FASE 2: Revalidar múltiples páginas de paginación secuencialmente
          console.log(`📊 Fase 2: Revalidando páginas de paginación...`);
          for (let i = 1; i <= 5; i++) {
            await safeRevalidateTag(`noticias-page-${i}`);
            await new Promise(resolve => setTimeout(resolve, 30));
          }
          
          // FASE 3: Tags específicos por categoría
          if (categoria) {
            console.log(`🏷️ Fase 3: Revalidando categoría '${categoria}'...`);
            await safeRevalidateTag(`noticias-categoria-${categoria}`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 4: Revalidar páginas principales secuencialmente
          console.log(`🌐 Fase 4: Revalidando páginas principales...`);
          await safeRevalidatePath('/noticias');
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Revalidar múltiples páginas de paginación
          for (let i = 1; i <= 3; i++) {
            await safeRevalidatePath(`/noticias/page/${i}`);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // FASE 5: Revalidar home al final
          console.log(`🏠 Fase 5: Revalidando página principal (home)...`);
          await safeRevalidatePath('/');
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log(`✅ Revalidación completa por eliminación terminada. Total: ${revalidatedTags.length} tags, ${revalidatedPaths.length} rutas`);
          
        } catch (error) {
          console.error('❌ Error durante revalidación de noticia eliminada:', error);
          errors.push(`Error general en delete: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
        break;

      default:
        console.warn(`❓ Evento no soportado: ${event}`);
        return NextResponse.json(
          { error: `Evento no soportado: ${event}` },
          { status: 400 }
        );
    }

    // 7. Log para monitoreo con manejo de errores
    const hasErrors = errors.length > 0;
    const logData = {
      event,
      slug,
      esImportante,
      categoria,
      paths: revalidatedPaths,
      tags: revalidatedTags,
      errors: hasErrors ? errors : undefined,
      timestamp: new Date().toISOString(),
      success: !hasErrors
    };

    if (hasErrors) {
      console.warn(`⚠️ Webhook revalidación completada con errores:`, logData);
    } else {
      console.log(`🔄 Webhook revalidación exitosa:`, logData);
    }

    // Registrar en el sistema de logging
    logWebhookEvent(
      event,
      slug,
      [...revalidatedPaths, ...revalidatedTags.map(tag => `tag:${tag}`)],
      !hasErrors,
      hasErrors ? errors.join('; ') : undefined
    );

    // 8. Respuesta con información detallada
    const responseData = {
      success: !hasErrors,
      message: hasErrors 
        ? `Revalidación completada con ${errors.length} errores para evento: ${event}`
        : `Revalidación exitosa para evento: ${event}`,
      revalidatedPaths,
      revalidatedTags,
      errors: hasErrors ? errors : undefined,
      details: {
        slug,
        esImportante,
        titulo,
        categoria
      },
      timestamp: new Date().toISOString(),
      stats: {
        totalPaths: revalidatedPaths.length,
        totalTags: revalidatedTags.length,
        totalErrors: errors.length
      }
    };

    // Si hay errores pero se revalidó algo, devolver 207 (Multi-Status)
    // Si hay errores totales, devolver 500
    // Si todo está bien, devolver 200
    const statusCode = hasErrors 
      ? (revalidatedPaths.length > 0 || revalidatedTags.length > 0 ? 207 : 500)
      : 200;

    return NextResponse.json(responseData, { status: statusCode });

  } catch (error) {
    console.error('❌ Error crítico en webhook de revalidación:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Método GET para testing/debuging
export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json({
    status: 'Webhook de revalidación activo',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    supportedEvents: ['create', 'update', 'delete'],
    collection: 'noticias',
    ...(isProduction ? {} : {
      debug: {
        hasToken: !!process.env.REVALIDATE_SECRET_TOKEN,
        tokenLength: process.env.REVALIDATE_SECRET_TOKEN?.length || 0
      }
    })
  });
}
