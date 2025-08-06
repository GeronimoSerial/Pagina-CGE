import { NextRequest, NextResponse } from 'next/server';
import { DIRECTUS_URL } from '@/shared/lib/config';

interface SearchParams {
  q?: string;
  categoria?: string;
  desde?: string;
  hasta?: string;
  page?: string;
  pageSize?: string;
}

interface DirectusNewsItem {
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
}

// Rate limiting básico
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30; // 30 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Nuevo usuario o ventana expirada
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime };
  }

  userLimit.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - userLimit.count,
    resetTime: userLimit.resetTime,
  };
}

function validateSearchParams(searchParams: URLSearchParams): SearchParams {
  const q = searchParams.get('q');
  const categoria = searchParams.get('categoria');
  const desde = searchParams.get('desde');
  const hasta = searchParams.get('hasta');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');

  // Validar y sanitizar query de texto
  const sanitizedQ = q ? q.trim().substring(0, 100) : undefined;

  // Validar categoría
  const sanitizedCategoria = categoria
    ? categoria.trim().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-_]/g, '')
    : undefined;

  // Validar fechas
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const validDesde = desde && dateRegex.test(desde) ? desde : undefined;
  const validHasta = hasta && dateRegex.test(hasta) ? hasta : undefined;

  // Validar paginación
  const pageNum = page
    ? Math.max(1, Math.min(100, parseInt(page, 10) || 1))
    : 1;
  const pageSizeNum = pageSize
    ? Math.max(1, Math.min(20, parseInt(pageSize, 10) || 6))
    : 6;

  return {
    q: sanitizedQ,
    categoria: sanitizedCategoria,
    desde: validDesde,
    hasta: validHasta,
    page: pageNum.toString(),
    pageSize: pageSizeNum.toString(),
  };
}

function buildDirectusUrl(params: SearchParams): string {
  const url = new URL(`${DIRECTUS_URL}/items/noticias`);

  // Paginación
  const page = parseInt(params.page || '1', 10);
  const pageSize = parseInt(params.pageSize || '6', 10);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', pageSize.toString());
  url.searchParams.set('sort', '-fecha,-id');

  // Campos optimizados
  url.searchParams.set(
    'fields',
    'id,titulo,resumen,fecha,categoria,esImportante,slug,portada.id,portada.filename_disk,portada.title,portada.width,portada.height',
  );

  // Metadata para contar resultados
  url.searchParams.set('meta', 'total_count,filter_count');

  // Filtros
  let filterIndex = 0;

  // Filtro por título (búsqueda de texto)
  if (params.q) {
    url.searchParams.set(`filter[titulo][_icontains]`, params.q);
    filterIndex++;
  }

  // Filtro por categoría
  if (params.categoria) {
    url.searchParams.set(`filter[categoria][_eq]`, params.categoria);
    filterIndex++;
  }

  // Filtro por rango de fechas
  if (params.desde && params.hasta) {
    url.searchParams.set(
      `filter[fecha][_between]`,
      `${params.desde},${params.hasta}`,
    );
  } else if (params.desde) {
    url.searchParams.set(`filter[fecha][_gte]`, params.desde);
  } else if (params.hasta) {
    url.searchParams.set(`filter[fecha][_lte]`, params.hasta);
  }

  return url.toString();
}


export async function GET(request: NextRequest) {
  try {
    // Obtener IP para rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message:
            'Por favor, espera un momento antes de realizar otra búsqueda.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    // Validar parámetros
    const params = validateSearchParams(request.nextUrl.searchParams);

    // Si no hay parámetros de búsqueda, devolver error
    if (!params.q && !params.categoria && !params.desde && !params.hasta) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Al menos un parámetro de búsqueda es requerido.',
        },
        { status: 400 },
      );
    }

    // Construir URL para Directus
    const directusUrl = buildDirectusUrl(params);
    const page = parseInt(params.page || '1', 10);
    const pageSize = parseInt(params.pageSize || '6', 10);

    // Realizar consulta a Directus con fetch
    let fetchResponse: Response;
    let directusData: any;

    try {
      fetchResponse = await fetch(directusUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 60, // Cache de 60 segundos
        },
      });

      if (!fetchResponse.ok) {
        throw new Error(
          `Directus responded with ${fetchResponse.status}: ${fetchResponse.statusText}`,
        );
      }

      directusData = await fetchResponse.json();
    } catch (directusError) {
      console.error('Error en consulta Directus:', directusError);
      return NextResponse.json(
        {
          error: 'Service Unavailable',
          message: 'Error al buscar noticias. Inténtalo de nuevo.',
        },
        { status: 502 },
      );
    }

    // Extraer datos y metadata
    const noticias: DirectusNewsItem[] = directusData.data || [];
    const totalCount = directusData.meta?.total_count || noticias.length;

    // Transformar datos para el frontend
    const transformedNoticias = noticias.map((noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      fecha: noticia.fecha,
      categoria: noticia.categoria,
      esImportante: noticia.esImportante,
      slug: noticia.slug,
      portada: noticia.portada 
        ? {
        url: `${DIRECTUS_URL}/assets/${noticia.portada.id}`,
        filename: noticia.portada.filename_disk,
        title: noticia.portada.title || '',
        width: noticia.portada.width || 0,
        height: noticia.portada.height || 0,
      }
        : { url: '/images/header-noticias.webp', filename: '', title: '', width: 0, height: 0 },
    }));

    // Calcular paginación
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Preparar respuesta
    const responseData = {
      data: transformedNoticias,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        pageSize,
        hasNextPage,
        hasPrevPage,
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        searchParams: params,
      },
    };

    // Headers de cache y optimización
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
    });

    return NextResponse.json(responseData, { headers });
  } catch (error) {
    console.error('Error general en /api/noticias/search:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Error interno del servidor.',
      },
      { status: 500 },
    );
  }
}

// Configuración de Next.js para el endpoint
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60;
