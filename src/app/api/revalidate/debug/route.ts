import { NextRequest, NextResponse } from 'next/server';

// Endpoint temporal para debug - captura TODO lo que recibe
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG WEBHOOK - Nueva petición recibida');

    // Capturar headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('🔍 Headers:', headers);

    // Leer el cuerpo crudo
    const rawBody = await request.text();
    console.log('🔍 Raw body:', rawBody);
    console.log('🔍 Body length:', rawBody.length);
    console.log('🔍 Content-Type:', headers['content-type']);

    let parsedBody = null;
    let parseError = null;

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
        console.log('✅ JSON parseado:', parsedBody);
      } catch (error) {
        parseError =
          error instanceof Error ? error.message : 'Error desconocido';
        console.error('❌ Error parseando JSON:', error);
      }
    }

    // Responder con toda la información de debug
    return NextResponse.json({
      success: true,
      message: 'Debug webhook - datos capturados',
      debug: {
        method: request.method,
        url: request.url,
        headers: headers,
        rawBody: rawBody,
        bodyLength: rawBody.length,
        parsedBody: parsedBody,
        parseError: parseError,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error en debug webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error en debug',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug webhook endpoint activo',
    instructions:
      'Envía un POST aquí desde Directus para ver exactamente qué datos se están enviando',
    endpoint: '/api/revalidate/debug',
    timestamp: new Date().toISOString(),
  });
}
