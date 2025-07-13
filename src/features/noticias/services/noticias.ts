import { API_URL, STRAPI_URL } from '@/shared/lib/config';
import { Noticia } from '@/shared/interfaces';
import qs from 'qs';

 
export async function getAllNoticias() {
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

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 7200, tags: ['noticias-collection'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch all noticias slugs');
  }
  const { data } = await res.json();
  return data;
}

/**
 * WRAPPER para compatibilidad con página de noticias
 * Usa la función unificada con paginación
 */
export async function getNoticiasPaginadas(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  return getNoticiasUnificadas({
    limit: pageSize,
    page,
    filters,
    withPagination: true
  });
}

/**
 * WRAPPER para compatibilidad con home page
 * Usa la función unificada sin paginación
 */
export async function getUltimasNoticias(limit: number = 6): Promise<Noticia[]> {
  return getNoticiasUnificadas({
    limit,
    withPagination: false
  });
}

 
export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const query = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        portada: {
          fields: ['url', 'alternativeText']
        },
        imagen: {
          fields: ['url', 'width', 'height', 'alternativeText']
        }
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 86400, tags: ['noticias', slug] },
  });

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

 
export async function getNoticiasRelacionadas(categoria: string) {
  const query = qs.stringify(
    {
      filters: {
        categoria: { $eq: categoria },
        
      },
      pagination: { limit: 2 },
      fields: ['titulo', 'resumen', 'fecha', 'categoria', 'slug'],
      populate: {
        portada: {
          fields: ['url', 'alternativeText']
        }
      },
      sort: ['createdAt:desc', 'fecha:desc'],
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 21600, tags: ['noticias-collection', `category:${categoria}`] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticias relacionadas');
  }
  const { data } = await res.json();
  return data;
}

 

export function getPortada({ noticia }: any) {
  const url = noticia.portada?.data?.url || noticia.portada?.url;
  if (!url) return null;
  return `${STRAPI_URL}${url}`;
}

export function getImagenes(noticia: Noticia) {
  return (
    noticia.imagen?.map((img: any) => ({
      url: `${STRAPI_URL}${img.url}`,
      alt: img.alternativeText || '',
      width: img.width,
      height: img.height,
    })) || []
  );
}

/**
 * Obtiene todas las categorías de noticias únicas.
 * Cachea el resultado durante una hora para un rendimiento óptimo.
 */
export async function getNoticiasCategorias(): Promise<Array<{ id: number; nombre: string }>> {
  
  const query = qs.stringify(
    {
      fields: ['categoria'],
      pagination: {
        limit: -1,
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 7200, tags: ['noticias-collection', 'categorias'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticias categorias');
  }

  const { data } = await res.json();

  
  const categoriasUnicas = Array.from(
    new Set(data.map((item: any) => item.categoria).filter(Boolean)),
  );

  
  return (categoriasUnicas as string[]).map((categoria: string, index: number) => ({
    id: index + 1,
    nombre: categoria,
  }));
}

/**
 * Función UNIFICADA para obtener noticias - sirve para /noticias y home
 * Reemplaza getNoticiasPaginadas y getUltimasNoticias con una sola función optimizada
 * 
 * @param options.limit - Número de noticias (6 para home, 5+ para /noticias)
 * @param options.page - Página para paginación (solo /noticias)
 * @param options.filters - Filtros de búsqueda (solo /noticias)
 * @param options.withPagination - Si incluir metadata de paginación (solo /noticias)
 */
export async function getNoticiasUnificadas({
  limit = 6,
  page = 1,
  filters = {},
  withPagination = false
}: {
  limit?: number;
  page?: number;
  filters?: Record<string, any>;
  withPagination?: boolean;
} = {}) {
  const query = qs.stringify(
    {
      fields: ['titulo', 'resumen', 'fecha', 'categoria', 'esImportante', 'slug', 'createdAt'],
      populate: {
        portada: {
          fields: ['url', 'alternativeText']
        },
        imagen: {
          fields: ['url', 'width', 'height', 'alternativeText']
        }
      },
      sort: ['createdAt:desc', 'fecha:desc', 'id:desc'],
      pagination: withPagination 
        ? { page, pageSize: limit }
        : { pageSize: limit },
      filters: {
        publicado: { $eq: true },
        ...filters,
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    // VPS-optimized: misma estrategia de cache para consistencia
    next: { 
      revalidate: 60, // 1 MINUTO - unified cache strategy
      tags: ['noticias-collection', 'noticias-unified'] 
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticias');
  }
  
  const { data, meta } = await res.json();
  
  if (withPagination) {
    return { noticias: data || [], pagination: meta.pagination };
  }
  
  return data || [];
}