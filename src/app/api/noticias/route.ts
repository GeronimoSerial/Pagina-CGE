import { NextRequest, NextResponse } from 'next/server';
import { DIRECTUS_URL } from '@/shared/lib/config';

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

interface UnifiedNewsResponse {
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
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    timestamp: string;
    cached: boolean;
    query_type: 'featured' | 'paginated' | 'all';
    total_featured?: number;
  };
}

function validateParameters(searchParams: URLSearchParams) {
  const type = searchParams.get('type') || 'paginated';

  // Validar tipo de consulta
  if (!['featured', 'paginated', 'all'].includes(type)) {
    throw new Error('Tipo de consulta debe ser: featured, paginated o all');
  }

  // Validar parámetros específicos según el tipo
  let page = 1;
  let pageSize = 6;
  let limit = 3;
  let categoria = null;

  if (type === 'paginated' || type === 'all') {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      page = parseInt(pageParam, 10);
      if (isNaN(page) || page < 1) {
        throw new Error('Número de página inválido');
      }
    }

    const pageSizeParam = searchParams.get('pageSize');
    if (pageSizeParam) {
      pageSize = parseInt(pageSizeParam, 10);
      if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
        throw new Error('Tamaño de página debe estar entre 1 y 20');
      }
    }
  }

  if (type === 'featured') {
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      limit = parseInt(limitParam, 10);
      if (isNaN(limit) || limit < 1 || limit > 10) {
        throw new Error('Límite debe estar entre 1 y 10');
      }
    }
  }

  // Validar categoría
  const categoriaParam = searchParams.get('categoria');
  if (categoriaParam) {
    categoria = categoriaParam.trim().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-_]/g, '');
    if (!categoria) categoria = null;
  }

  return { type, page, pageSize, limit, categoria };
}

function transformPortadaUrl(
  portada: DirectusNewsResponse['data'][0]['portada'],
): string | null {
  if (!portada?.id) return null;
  return `${DIRECTUS_URL}/assets/${portada.id}?width=1200&height=630&fit=cover`;
}

function buildDirectusUrl(
  type: string,
  page: number,
  pageSize: number,
  limit: number,
  categoria: string | null,
): string {
  const url = new URL(`${DIRECTUS_URL}/items/noticias`);

  // Configuración por tipo de consulta
  if (type === 'featured') {
    url.searchParams.set('filter[esImportante][_eq]', 'true');
    url.searchParams.set('limit', limit.toString());
  } else if (type === 'paginated') {
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', pageSize.toString());
  } else if (type === 'all') {
    // No aplicar filtros específicos, solo paginación si es necesaria
    if (page > 1 || pageSize !== 6) {
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', pageSize.toString());
    }
  }

  // Ordenamiento siempre por fecha más reciente
  url.searchParams.set('sort', '-fecha,-id');

  // Campos optimizados
  url.searchParams.set(
    'fields',
    'id,titulo,resumen,fecha,categoria,esImportante,slug,portada.id,portada.filename_disk,portada.title,portada.width,portada.height',
  );

  // Metadata para paginación y conteo
  url.searchParams.set('meta', 'total_count,filter_count');

  // Filtro por categoría si se proporciona
  if (categoria) {
    const existingFilter = url.searchParams.get('filter');
    if (existingFilter) {
      // Si ya hay filtros, agregar AND
      url.searchParams.set('filter[categoria][_eq]', categoria);
    } else {
      url.searchParams.set('filter[categoria][_eq]', categoria);
    }
  }

  return url.toString();
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<UnifiedNewsResponse | { error: string }>> {
  try {
    // 1. Validar y extraer parámetros
    const { searchParams } = new URL(request.url);
    const { type, page, pageSize, limit, categoria } =
      validateParameters(searchParams);

    // 2. Construir URL de Directus
    const directusUrl = buildDirectusUrl(
      type,
      page,
      pageSize,
      limit,
      categoria,
    );

    // 3. Tags de caché dinámicos
    const cacheTags = [
      'noticias',
      `noticias-${type}`,
      type === 'paginated' && `noticias-page-${page}`,
      categoria && `noticias-categoria-${categoria}`,
    ].filter(Boolean) as string[];

    // 4. Tiempo de revalidación - Sin caché para consultas inmediatas
    
    // 5. Fetch con ISR cache
    const response = await fetch(directusUrl, {
      next: {
        revalidate: 0, // Sin caché del navegador
        tags: cacheTags,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Directus API error: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Error del servidor de contenidos: ${response.status}`);
    }

    const directusData: DirectusNewsResponse = await response.json();

    // 6. Transformar datos
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

    // 7. Calcular metadata de paginación (solo para paginated y all)
    let paginationMeta = undefined;
    if (type === 'paginated' || type === 'all') {
      const totalItems = directusData.meta.total_count;
      const totalPages = Math.ceil(totalItems / pageSize);

      paginationMeta = {
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    }

    // 8. Respuesta final
    const apiResponse: UnifiedNewsResponse = {
      data: transformedData,
      ...(paginationMeta && { pagination: paginationMeta }),
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
        query_type: type as 'featured' | 'paginated' | 'all',
        ...(type === 'featured' && {
          total_featured: directusData.meta.total_count,
        }),
      },
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error in unified news API:', error);

    // Manejo específico de errores de validación
    if (
      error instanceof Error &&
      (error.message.includes('inválido') ||
        error.message.includes('debe estar') ||
        error.message.includes('debe ser'))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Error genérico del servidor
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
