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

interface ApiResponse {
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
  pagination: {
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
  };
}

function validatePageNumber(page: string): number {
  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Número de página inválido');
  }
  return pageNum;
}

function validatePageSize(pageSizeParam: string | null): number {
  if (!pageSizeParam) return 6; // Default
  
  const pageSize = parseInt(pageSizeParam, 10);
  if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
    throw new Error('Tamaño de página debe estar entre 1 y 20');
  }
  return pageSize;
}

function validateCategory(categoria: string | null): string | null {
  if (!categoria) return null;
  
  // Sanitizar categoría para prevenir inyección
  const sanitized = categoria.trim().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-_]/g, '');
  return sanitized || null;
}

function transformPortadaUrl(portada: DirectusNewsResponse['data'][0]['portada']): string | null {
  if (!portada?.id) return null;
  return `${DIRECTUS_URL}/assets/${portada.id}?width=800&height=600&fit=cover`;
}

function buildDirectusUrl(page: number, pageSize: number, categoria: string | null): string {
  const url = new URL(`${DIRECTUS_URL}/items/noticias`);
  
  // Parámetros básicos de paginación
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', pageSize.toString());
  url.searchParams.set('sort', '-fecha,-id');
  
  // Campos optimizados para listados
  url.searchParams.set('fields', 'id,titulo,resumen,fecha,categoria,esImportante,slug,portada.id,portada.filename_disk,portada.title,portada.width,portada.height');
  
  // Metadata para paginación
  url.searchParams.set('meta', 'total_count,filter_count');
  
  // Filtro por categoría si se proporciona
  if (categoria) {
    url.searchParams.set('filter[categoria][_eq]', categoria);
  }
  
  return url.toString();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
): Promise<NextResponse<ApiResponse | { error: string }>> {
  try {
    // 1. Validar parámetros
    const page = validatePageNumber(params.page);
    const { searchParams } = new URL(request.url);
    const pageSize = validatePageSize(searchParams.get('pageSize'));
    const categoria = validateCategory(searchParams.get('categoria'));
    
    // 2. Construir URL de Directus
    const directusUrl = buildDirectusUrl(page, pageSize, categoria);
    
    // 3. Tags de caché dinámicos
    const cacheTags = [
      'noticias',
      `noticias-page-${page}`,
      categoria && `noticias-categoria-${categoria}`
    ].filter(Boolean) as string[];
    
    // 4. Fetch con ISR cache
    const response = await fetch(directusUrl, {
      next: { 
        revalidate: 300, // 5 minutos
        tags: cacheTags
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Directus API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error del servidor de contenidos: ${response.status}`);
    }
    
    const directusData: DirectusNewsResponse = await response.json();
    
    // 5. Transformar datos
    const transformedData = directusData.data.map(noticia => ({
      id: noticia.id,
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      fecha: noticia.fecha,
      categoria: noticia.categoria,
      esImportante: noticia.esImportante,
      slug: noticia.slug,
      portada: noticia.portada ? {
        url: transformPortadaUrl(noticia.portada) || '',
        title: noticia.portada.title,
        width: noticia.portada.width,
        height: noticia.portada.height,
      } : undefined,
    }));
    
    // 6. Calcular metadata de paginación
    const totalItems = directusData.meta.total_count;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    const paginationMeta = {
      currentPage: page,
      totalPages,
      totalItems,
      pageSize,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
    
    // 7. Respuesta final
    const apiResponse: ApiResponse = {
      data: transformedData,
      pagination: paginationMeta,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true, // ISR siempre cachea
      },
    };
    
    return NextResponse.json(apiResponse);
    
  } catch (error) {
    console.error('Error in noticias API:', error);
    
    // Manejo específico de errores de validación
    if (error instanceof Error && 
        (error.message.includes('inválido') || error.message.includes('debe estar'))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Error genérico del servidor
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
