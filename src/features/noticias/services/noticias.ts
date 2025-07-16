import { API_URL, PERFORMANCE_CONFIG, DIRECTUS_URL } from '@/shared/lib/config';
import { Noticia } from '@/shared/interfaces';
import qs from 'qs';
import { DirectusAssets } from '@/shared/lib/directus-assets';

class CategoriesCache {
  private cache: Array<{ id: number; nombre: string }> | null = null;
  private timestamp: number = 0;
  private ttl: number = 1800000;

  async get(): Promise<Array<{ id: number; nombre: string }> | null> {
    if (this.cache && (Date.now() - this.timestamp) < this.ttl) {
      return this.cache;
    }
    return null;
  }

  set(data: Array<{ id: number; nombre: string }>): void {
    this.cache = data;
    this.timestamp = Date.now();
  }

  clear(): void {
    this.cache = null;
    this.timestamp = 0;
  }
}

const categoriesCache = new CategoriesCache();

export async function getAllNoticias() {
  const query = qs.stringify(
    {
      fields: ['id', 'slug'],
      filter: {
        status: { _eq: 'published' },
      },
      limit: -1,
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


export async function getNoticiasPaginadas(
  page: number = 1,
  pageSize: number = PERFORMANCE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
  filters: Record<string, any> = {},
) {
  const directusFilters: any = {
    status: { _eq: 'published' },
  };

  if (filters.q) {
    directusFilters.titulo = { _icontains: filters.q };
  }
  
  if (filters.categoria) {
    directusFilters.categoria = { _eq: filters.categoria };
  }

  if (filters.desde) {
    directusFilters.fecha = { _gte: filters.desde };
  }

  if (filters.hasta) {
    if (directusFilters.fecha) {
      directusFilters.fecha = { _gte: filters.desde, _lte: filters.hasta };
    } else {
      directusFilters.fecha = { _lte: filters.hasta };
    }
  }

  const query = qs.stringify(
    {
      fields: [
        'id', 'titulo', 'resumen', 'fecha', 'categoria', 'esImportante', 'slug', 
        'date_created', 'portada', 'autor', 'imagenes.directus_files_id.*'
      ],
      sort: ['-date_created', '-fecha', '-id'],
      limit: Math.min(pageSize, 20),
      offset: (page - 1) * pageSize,
      filter: directusFilters,
      meta: '*',
    },
    { encodeValuesOnly: true },
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PERFORMANCE_CONFIG.API_TIMEOUT);

    const res = await fetch(`${API_URL}/noticias?${query}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': `max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}`,
        'Connection': 'keep-alive',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch paginated noticias`);
    }

    const { data, meta } = await res.json();
    
    const pagination = {
      page: page,
      pageCount: Math.ceil((meta?.total_count || 0) / pageSize),
      pageSize: pageSize,
      total: meta?.total_count || 0
    };

    return { noticias: data, pagination };

  } catch (error) {
    return {
      noticias: [],
      pagination: {
        page: page,
        pageCount: 0,
        pageSize: pageSize,
        total: 0
      }
    };
  }
}


export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const query = qs.stringify(
    {
      filter: {
        slug: { _eq: slug },
      },
      fields: '*,imagenes.directus_files_id.*',
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
    imagenes: n.imagenes || [],
    status: n.status,
    fecha: n.fecha,
    date_created: n.date_created,
    metaTitle: n.metaTitle || n.titulo,
    metaDescription: n.metaDescription || n.resumen,
  };
}


export async function getNoticiasRelacionadas(categoria: string, excludeSlug?: string) {
  const filters: any = {
    categoria: { _eq: categoria },
    status: { _eq: 'published' },
  };

  if (excludeSlug) {
    filters.slug = { _neq: excludeSlug };
  }

  const query = qs.stringify(
    {
      filter: filters,
      limit: 2,
      fields: ['id', 'titulo', 'resumen', 'fecha', 'categoria', 'slug', 'portada', 'imagenes.directus_files_id.*'],
      sort: ['-date_created', '-fecha'],
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

export function getPortada({ noticia }: any) {
  if (!noticia.portada) return null;
  return DirectusAssets.portada(noticia.portada);
}

export function getImagenes(noticia: Noticia) {
  return (
    noticia.imagenes?.map((img) => ({
      url: DirectusAssets.contenido(img.directus_files_id.id),
      alt: img.directus_files_id.title || img.directus_files_id.filename_download,
      width: img.directus_files_id.width,
      height: img.directus_files_id.height,
    })) || []
  );
}

export async function getNoticiasCategorias(): Promise<Array<{ id: number; nombre: string }>> {
  const cached = await categoriesCache.get();
  if (cached) {
    return cached;
  }

  const query = qs.stringify(
    {
      fields: ['categoria'],
      limit: -1,
      filter: {
        status: { _eq: 'published' },
        categoria: { _nnull: true },
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

  const result = (categoriasUnicas as string[]).map((categoria: string, index: number) => ({
    id: index + 1,
    nombre: categoria.charAt(0).toUpperCase() + categoria.slice(1),
  }));

  categoriesCache.set(result);
  
  return result;
}