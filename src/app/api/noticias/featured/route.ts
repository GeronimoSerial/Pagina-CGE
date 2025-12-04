import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import { DIRECTUS_URL } from '@/shared/lib/config';
import { safeFetchJson } from '@/shared/lib/safe-fetch';

interface DirectusNewsResponse {
  data: Array<{
    id: number;
    titulo: string;
    resumen: string;
    fecha: string;
    categoria: string;
    esImportante: boolean;
    slug: string;
    portada?: {
      id: string;
      filename_disk: string;
      title?: string;
      width?: number;
      height?: number;
    };
  }>;
  meta: {
    total_count: number;
    filter_count: number;
  };
}

interface FeaturedNewsResponse {
  data: Array<{
    id: number;
    titulo: string;
    resumen: string;
    fecha: string;
    categoria: string;
    esImportante: boolean;
    slug: string;
    portada?: {
      url: string;
      title?: string;
      width?: number;
      height?: number;
    };
  }>;
  meta: {
    timestamp: string;
    cached: boolean;
    total_featured: number;
  };
}

function validateLimit(limitParam: string | null): number {
  if (!limitParam) return 3; // Default para carousel

  const limit = parseInt(limitParam, 10);
  if (isNaN(limit) || limit < 1 || limit > 10) {
    throw new Error('Límite debe estar entre 1 y 10');
  }
  return limit;
}

function transformPortadaUrl(
  portada: DirectusNewsResponse['data'][0]['portada'],
): string | null {
  if (!portada?.id) return null;
  return `${DIRECTUS_URL}/assets/${portada.id}?width=1200&height=630&fit=cover`;
}

function buildDirectusUrl(limit: number): string {
  const url = new URL(`${DIRECTUS_URL}/items/noticias`);

  url.searchParams.set('filter[esImportante][_eq]', 'true');

  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sort', '-fecha,-id');

  url.searchParams.set(
    'fields',
    'id,titulo,resumen,fecha,categoria,esImportante,slug,portada.id,portada.filename_disk,portada.title,portada.width,portada.height',
  );

  url.searchParams.set('meta', 'total_count,filter_count');

  return url.toString();
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<FeaturedNewsResponse | { error: string }>> {
  // Signal that this route needs dynamic rendering (must be before try block)
  await connection();

  try {
    // 1. Validar parámetros
    const { searchParams } = new URL(request.url);
    const limit = validateLimit(searchParams.get('limit'));

    const directusUrl = buildDirectusUrl(limit);

    // 3. Fetch con ISR cache optimizado para featured news
    const directusData = await safeFetchJson<DirectusNewsResponse>(
      directusUrl,
      {
        next: {
          revalidate: false,
          tags: ['noticias', 'noticias-featured'],
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );

    const transformedData = directusData.data.map((noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      fecha: noticia.fecha,
      categoria: noticia.categoria,
      esImportante: noticia.esImportante,
      slug: noticia.slug,
      portada: noticia.portada
        ? {
            url: transformPortadaUrl(noticia.portada) || '',
            title: noticia.portada.title,
            width: noticia.portada.width,
            height: noticia.portada.height,
          }
        : undefined,
    }));

    // 5. Respuesta final
    const apiResponse: FeaturedNewsResponse = {
      data: transformedData,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
        total_featured: directusData.meta.total_count,
      },
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error in featured news API:', error);

    // Manejo específico de errores de validación
    if (error instanceof Error && error.message.includes('debe estar')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error) {
      const isTimeout =
        error.name === 'AbortError' || error.message.includes('Timeout');
      const isHttp = error.message.startsWith('HTTP');
      if (isTimeout || isHttp) {
        return NextResponse.json(
          { error: 'Servicio de contenidos no disponible' },
          { status: 502 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
