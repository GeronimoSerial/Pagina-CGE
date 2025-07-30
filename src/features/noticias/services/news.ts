import { API_URL, PERFORMANCE_CONFIG, STRAPI_URL } from '@/shared/lib/config';
import { NewsItem } from '@/shared/interfaces';
import qs from 'qs';
import { cfImages } from '@/shared/lib/cloudflare-images';
import {
  newsPagesCache,
  featuredNewsCache,
} from '@/shared/lib/aggressive-cache';
import { resilientFetch } from '@/shared/lib/resilient-api';

function createCacheKey(
  page: number,
  pageSize: number,
  filters: Record<string, any>,
): string {
  const hasFilters = Object.keys(filters).length > 0;
  const bucket = Math.floor(page / 3);

  if (!hasFilters) {
    return `noticias-clean-${bucket}-${pageSize}`;
  }

  const filterHash = Object.keys(filters).sort().join('-');
  return `noticias-filtered-${bucket}-${pageSize}-${filterHash}`;
}

export async function getAllNews() {
  const query = qs.stringify(
    {
      fields: ['slug'],
      filters: {
        publicado: { $eq: true },
      },
      pagination: {
        limit: -1,
      },
    },
    { encodeValuesOnly: true },
  );

  const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
    cacheKey: 'all-news-slugs',
    fallbackData: [],
    timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
  });

  if (response.status === 'error') {
    throw new Error('Failed to fetch all noticias slugs');
  }

  return response.data?.data || [];
}

export async function getPaginatedNews(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
 
  const shouldCache = (page <= 10 && Object.keys(filters).length === 0) || page <= 3;
  const cacheKey = shouldCache ? `page-${page}-${pageSize}` : null;

  if (cacheKey) {
    const cached = newsPagesCache.get(cacheKey);
    if (cached) return cached;
  }

  let actualPageSize = pageSize;
  if (page === 1 && Object.keys(filters).length === 0) {
    try {
      const countQuery = qs.stringify(
        {
          fields: ['id'],
          filters: { publicado: { $eq: true } },
          pagination: { limit: 1 },
        },
        { encodeValuesOnly: true },
      );

      const countResponse = await resilientFetch(
        `${API_URL}/noticias?${countQuery}`,
        {
          cacheKey: 'news-count',
          fallbackData: { meta: { pagination: { total: pageSize + 3 } } },
          timeout: PERFORMANCE_CONFIG.CRITICAL_API_TIMEOUT,
        },
      );

      if (countResponse.status === 'success' && countResponse.data?.meta) {
        const totalNews = countResponse.data.meta.pagination.total;

        if (totalNews <= pageSize + 3) {
          // Pequeño margen para evitar páginas con muy pocas noticias
          actualPageSize = Math.max(totalNews, pageSize);
          console.log(
            `DEBUG: Total news=${totalNews}, adjusting pageSize from ${pageSize} to ${actualPageSize}`,
          );
        }
      }
    } catch (error) {
      console.warn('Could not get total count, using default pageSize:', error);
    }
  }

  const query = qs.stringify(
    {
      fields: [
        'titulo',
        'resumen',
        'fecha',
        'categoria',
        'esImportante',
        'slug',
        'createdAt',
      ],
      populate: {
        portada: {
          fields: ['url', 'alternativeText'],
        },
        imagen: {
          fields: ['url', 'width', 'height', 'alternativeText'],
        },
      },
      sort: ['createdAt:desc', 'fecha:desc', 'id:desc'],
      pagination: { page, pageSize: Math.min(actualPageSize, 20) },
      filters: {
        publicado: { $eq: true },
        ...filters,
      },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
      cacheKey: cacheKey || undefined,
      fallbackData: {
        data: [],
        meta: {
          pagination: {
            page: page,
            pageCount: 0,
            pageSize: pageSize,
            total: 0,
          },
        },
      },
      timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
      retries: 2,
    });

    let result;
    if (response.status === 'error') {
      result = {
        noticias: [],
        pagination: {
          page: page,
          pageCount: 0,
          pageSize: pageSize,
          total: 0,
        },
      };
    } else {
      const { data, meta } = response.data;
      result = { noticias: data, pagination: meta.pagination };
    }

    // Caché más agresivo para páginas frecuentes con TTL diferenciado
    if (cacheKey && shouldCache && response.status === 'success') {
      // TTL diferenciado: páginas 1-3 más frecuentes (1h), páginas 4-10 menos frecuentes (2h)
      const ttl = page <= 3 ? 3600000 : 7200000; // 1h vs 2h
      newsPagesCache.set(cacheKey, result, ttl);
    }

    return result;
  } catch (error) {
    console.error('Error in getPaginatedNews:', error);

    return {
      noticias: [],
      pagination: {
        page: page,
        pageCount: 0,
        pageSize: pageSize,
        total: 0,
      },
    };
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const query = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        portada: {
          fields: ['url', 'alternativeText'],
        },
        imagen: {
          fields: ['url', 'width', 'height', 'alternativeText'],
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
    cacheKey: `news-by-slug-${slug}`,
    fallbackData: { data: [] },
    timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
  });

  if (response.status === 'error') {
    throw new Error('Failed to fetch noticia by slug');
  }

  const data = response.data?.data || [];
  if (!data || data.length === 0) return null;

  const n = data[0];
  return {
    id: n.id,
    autor: n.autor || 'Redacción CGE',
    titulo: n.titulo,
    resumen: n.resumen,
    categoria: n.categoria,
    esImportante: n.esImportante,
    portada: n.portada,
    slug: n.slug,
    contenido: n.contenido,
    imagen: n.imagen,
    publicado: n.publicado,
    fecha: n.fecha,
    createdAt: n.createdAt,
    metaTitle: n.metaTitle || n.titulo,
    metaDescription: n.metaDescription || n.resumen,
  };
}

export async function getRelatedNews(categoria: string, excludeSlug?: string) {
  const filters: any = {
    categoria: { $eq: categoria },
    publicado: { $eq: true },
  };

  if (excludeSlug) {
    filters.slug = { $ne: excludeSlug };
  }

  const query = qs.stringify(
    {
      filters,
      pagination: { limit: 2 },
      fields: ['titulo', 'resumen', 'fecha', 'categoria', 'slug'],
      populate: {
        portada: {
          fields: ['url', 'alternativeText'],
        },
      },
      sort: ['createdAt:desc', 'fecha:desc'],
    },
    { encodeValuesOnly: true },
  );

  const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
    cacheKey: `related-news-${categoria}-${excludeSlug || 'all'}`,
    fallbackData: { data: [] },
    timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
  });

  if (response.status === 'error') {
    throw new Error('Failed to fetch noticias relacionadas');
  }

  return response.data?.data || [];
}

export function getCover({ noticia }: any) {
  const url = noticia.portada?.data?.url || noticia.portada?.url;

  if (!url) return null;
  return cfImages(url, 1200, 'auto');
}

export function getImages(noticia: NewsItem) {
  return (
    noticia.imagen?.map((img: any) => ({
      url: cfImages(img.url, 800, 'auto'),
      alt: img.alternativeText || '',
      width: img.width,
      height: img.height,
    })) || []
  );
}

export async function getFeaturedNews(limit: number = 5): Promise<NewsItem[]> {
  const cacheKey = `featured-${limit}`;

  const cached = featuredNewsCache.get(cacheKey);
  if (cached) return cached;

  const query = qs.stringify(
    {
      fields: [
        'titulo',
        'resumen',
        'slug',
        'fecha',
        'categoria',
        'autor',
        'esImportante',
      ],
      filters: {
        publicado: { $eq: true },
        esImportante: { $eq: true },
      },
      populate: {
        portada: {
          fields: ['url', 'alternativeText'],
        },
      },
      sort: ['fecha:desc'],
      pagination: {
        limit,
      },
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
      cacheKey,
      fallbackData: { data: [] },
      timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
      retries: 2,
    });

    if (response.status === 'error') {
      console.error('Error fetching featured news, returning empty array');
      return [];
    }

    const data = response.data?.data || [];
    const result = data.map((n: any) => ({
      id: n.id,
      titulo: n.titulo,
      resumen: n.resumen,
      slug: n.slug,
      fecha: n.fecha,
      categoria: n.categoria,
      autor: n.autor,
      esImportante: n.esImportante,
      portada: n.portada,
    }));

    // Guardar resultado en cache solo si fue exitoso
    if (response.status === 'success') {
      featuredNewsCache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Error in getFeaturedNews:', error);
    return [];
  }
}

export async function getNewsCategories(): Promise<
  Array<{ id: number; nombre: string }>
> {
  const query = qs.stringify(
    {
      fields: ['categoria'],
      pagination: {
        limit: -1,
      },
    },
    { encodeValuesOnly: true },
  );

  const response = await resilientFetch(`${API_URL}/noticias?${query}`, {
    cacheKey: 'news-categories',
    fallbackData: { data: [] },
    timeout: PERFORMANCE_CONFIG.API_TIMEOUT,
  });

  if (response.status === 'error') {
    throw new Error('Failed to fetch noticias categorias');
  }

  const data = response.data?.data || [];
  const categoriasUnicas = Array.from(
    new Set(data.map((item: any) => item.categoria).filter(Boolean)),
  );

  return (categoriasUnicas as string[]).map(
    (categoria: string, index: number) => ({
      id: index + 1,
      nombre: categoria,
    }),
  );
}

interface FetchNewsParams {
  currentPage: number;
  debouncedQ: string;
  categoria: string;
  desde: string;
  hasta: string;
  cacheBuster: string;
  setLoading: (msg: string) => void;
  handleApiResponse: (resp: any, url: string) => any;
}

export async function fetchNewsService({
  currentPage,
  debouncedQ,
  categoria,
  desde,
  hasta,
  cacheBuster,
  setLoading,
  handleApiResponse,
}: FetchNewsParams): Promise<{ news: NewsItem[]; totalPages: number }> {
  setLoading('Filtrando noticias...');
  try {
    const params = new URLSearchParams({
      'pagination[page]': String(currentPage),
      'pagination[pageSize]': '6',
      'sort[0]': 'createdAt:desc',
      'sort[1]': 'fecha:desc',
      'populate[portada][fields][0]': 'url',
      'populate[portada][fields][1]': 'alternativeText',
      'filters[publicado][$eq]': 'true',
      ...(debouncedQ && { 'filters[titulo][$containsi]': debouncedQ }),
      ...(categoria && { 'filters[categoria][$eq]': categoria }),
      ...(desde && { 'filters[fecha][$gte]': desde }),
      ...(hasta && { 'filters[fecha][$lte]': hasta }),
    });

    const url = `${STRAPI_URL}/api/noticias?${params.toString()}`;
    const response = await resilientFetch(url, {
      cacheKey: `dynamic-news-${cacheBuster}-${currentPage}`,
      fallbackData: {
        data: [],
        meta: { pagination: { pageCount: 1 } },
      },
      timeout: 8000,
      retries: 3,
    });

    const result = handleApiResponse(response, url);

    if (result) {
      const news: NewsItem[] = result.data.map((noticia: any) => ({
        id: noticia.id,
        autor: noticia.autor || 'Redacción CGE',
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        fecha: noticia.fecha,
        categoria: noticia.categoria,
        esImportante: noticia.esImportante || false,
        slug: noticia.slug,
        portada: noticia.portada,
        imagen: noticia.imagen,
      }));

      return {
        news,
        totalPages: result.meta?.pagination?.pageCount || 1,
      };
    } else {
      return {
        news: [],
        totalPages: 1,
      };
    }
  } catch (error: any) {
    console.error('Error fetching noticias:', error);
    return {
      news: [],
      totalPages: 1,
    };
  }
}
