import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRevalidationPathsForCollection } from '@/shared/lib/revalidation-utils';

// Interfaces para Directus Webhook
interface DirectusWebhookPayload {
  event: string;
  accountability: {
    user: string;
    role: string;
  };
  collection: string;
  item: any;
  action: 'create' | 'update' | 'delete';
}

export async function POST(request: NextRequest) {
  try {
    // Log detallado para debugging
    const authHeader = request.headers.get('authorization');
    const userAgent = request.headers.get('user-agent');
    const directusSignature = request.headers.get('directus-webhook-signature');
    
    let body: DirectusWebhookPayload;
    try {
      body = await request.json();
    } catch (error) {
      console.log('❌ Invalid JSON in webhook body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    console.log('🔔 Directus Webhook received:', {
      timestamp: new Date().toISOString(),
      authHeader: authHeader ? 'Present' : 'Missing',
      directusSignature: directusSignature ? 'Present' : 'Missing',
      userAgent,
      event: body.event,
      collection: body.collection,
      action: body.action,
      itemId: body.item?.id
    });

    // Verificar token de autorización
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      console.log('❌ Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar que es un evento válido de Directus
    if (!body.event || !body.collection) {
      console.log('❌ Invalid Directus webhook payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { collection, item, action } = body;

    // Verificar que es una colección que revalidamos (solo Trámites y Noticias)
    if (!['noticias', 'tramites'].includes(collection)) {
      console.log(`ℹ️ Collection '${collection}' no requiere revalidación (contenido estático)`);
      return NextResponse.json({ 
        success: true,
        revalidated: false,
        reason: 'Collection has static content',
        collection,
        timestamp: new Date().toISOString()
      });
    }

    // Obtener rutas que necesitan revalidación para esta colección
    const pathsToRevalidate = getRevalidationPathsForCollection(collection, item?.slug);
    
    // Revalidar todas las rutas de forma optimizada
    const revalidatePromises = pathsToRevalidate.map(path => revalidatePath(path));
    await Promise.allSettled(revalidatePromises);
    
    console.log('✅ Revalidated paths:', pathsToRevalidate.join(', '));
    console.log(`📝 Collection: ${collection}, Action: ${action}, Item: ${item?.slug || item?.id || 'unknown'}`);

    return NextResponse.json({ 
      success: true,
      revalidated: true, 
      collection,
      action,
      pathsRevalidated: pathsToRevalidate,
      item: item?.slug || item?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
