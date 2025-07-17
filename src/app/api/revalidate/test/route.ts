import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para probar la configuración del webhook sin revalidar realmente
 * Útil para debugging y verificar que Directus esté enviando los datos correctos
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type');
    const userAgent = request.headers.get('user-agent');
    const directusSignature = request.headers.get('directus-webhook-signature');
    
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid JSON',
        details: 'El body del webhook no es un JSON válido'
      }, { status: 400 });
    }

    // Verificar token
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;
    const isAuthorized = expectedToken && authHeader === `Bearer ${expectedToken}`;

    // Log completo para debugging
    const debugInfo = {
      timestamp: new Date().toISOString(),
      headers: {
        authorization: authHeader ? 'Present' : 'Missing',
        contentType,
        userAgent,
        directusSignature: directusSignature ? 'Present' : 'Missing',
      },
      authorization: {
        provided: authHeader ? 'Yes' : 'No',
        format: authHeader?.startsWith('Bearer ') ? 'Correct' : 'Incorrect',
        valid: isAuthorized ? 'Valid' : 'Invalid'
      },
      payload: {
        hasEvent: !!body.event,
        hasCollection: !!body.collection,
        hasItem: !!body.item,
        event: body.event,
        collection: body.collection,
        action: body.action,
        itemId: body.item?.id,
        itemSlug: body.item?.slug,
      },
      recommendations: [] as string[]
    };

    // Generar recomendaciones basadas en el análisis
    if (!authHeader) {
      debugInfo.recommendations.push('Agregar header Authorization en el webhook de Directus');
    } else if (!authHeader.startsWith('Bearer ')) {
      debugInfo.recommendations.push('El header Authorization debe tener el formato: Bearer tu_token');
    } else if (!isAuthorized) {
      debugInfo.recommendations.push('Verificar que el token en Authorization coincida con REVALIDATE_SECRET_TOKEN');
    }

    if (!body.event) {
      debugInfo.recommendations.push('El payload debe incluir el campo "event"');
    }

    if (!body.collection) {
      debugInfo.recommendations.push('El payload debe incluir el campo "collection"');
    }

    if (contentType !== 'application/json') {
      debugInfo.recommendations.push('Configurar Content-Type: application/json en el webhook');
    }

    console.log('🧪 Test webhook received:', debugInfo);

    return NextResponse.json({
      success: true,
      message: 'Webhook test completado exitosamente',
      debug: debugInfo,
      wouldRevalidate: isAuthorized && ['noticias', 'tramites'].includes(body.collection),
      revalidationInfo: {
        supportedCollections: ['noticias', 'tramites'],
        staticCollections: ['escuelas', 'documentacion', 'institucional'],
        requestedCollection: body.collection,
        isSupported: ['noticias', 'tramites'].includes(body.collection)
      },
      environment: process.env.NODE_ENV || 'unknown'
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de testing para webhooks de Directus',
    usage: 'Envía un POST con el mismo formato que usarías en el webhook real',
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString()
  });
}
