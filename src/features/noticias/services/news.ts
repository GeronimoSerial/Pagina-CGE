import { API_URL, PERFORMANCE_CONFIG } from '@/shared/lib/config';
import { NewsItem } from '@/shared/interfaces';
import qs from 'qs';
import { cfImages } from '@/shared/lib/cloudflare-images';
import {
  newsPagesCache,
  featuredNewsCache,
} from '@/shared/lib/aggressive-cache';

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

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch all noticias slugs');
  }
  const { data } = await res.json();
  return data;
}

export async function getPaginatedNews(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  // Solo cachear páginas 1-5 sin filtros
  const shouldCache = page <= 5 && Object.keys(filters).length === 0;
  const cacheKey = shouldCache ? `page-${page}-${pageSize}` : null;

  if (cacheKey) {
    const cached = newsPagesCache.get(cacheKey);
    if (cached) return cached;
  }

  // SMART PAGINATION: Para página 1, primero verificar total de noticias
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

      const countRes = await fetch(`${API_URL}/noticias?${countQuery}`);
      if (countRes.ok) {
        const { meta } = await countRes.json();
        const totalNews = meta.pagination.total;

        // Si el total es pequeño (ej: 11 noticias), obtener TODAS en página 1
        // para evitar fragmentación innecesaria
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
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      PERFORMANCE_CONFIG.API_TIMEOUT,
    );

    const res = await fetch(`${API_URL}/noticias?${query}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': `max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}`,
        Connection: 'keep-alive',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `API Error: ${res.status} ${res.statusText} for ${API_URL}/noticias`,
      );
      throw new Error(`HTTP ${res.status}: Failed to fetch paginated noticias`);
    }

    const { data, meta } = await res.json();
    const result = { noticias: data, pagination: meta.pagination };

    // Guardar en cache solo si corresponde
    if (cacheKey && shouldCache) {
      newsPagesCache.set(cacheKey, result);
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

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch noticia by slug');
  }
  const { data } = await res.json();
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

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch noticias relacionadas');
  }
  const { data } = await res.json();
  return data;
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
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      PERFORMANCE_CONFIG.API_TIMEOUT,
    );

    const res = await fetch(`${API_URL}/noticias?${query}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': `max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}`,
        Connection: 'keep-alive',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(
        `API Error: ${res.status} ${res.statusText} for featured news`,
      );
      throw new Error(`HTTP ${res.status}: Failed to fetch featured news`);
    }

    const { data } = await res.json();

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

    // Guardar resultado en cache
    featuredNewsCache.set(cacheKey, result);
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

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch noticias categorias');
  }

  const { data } = await res.json();

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
