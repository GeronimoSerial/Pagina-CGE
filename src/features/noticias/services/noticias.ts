import { API_URL } from '@/shared/lib/config';
import { Noticia } from '@/shared/interfaces';
import qs from 'qs';
import { cfImages } from '@/shared/lib/cloudflare-images';

// Simplified cache strategy: Fewer unique keys = better cache hits
function createCacheKey(page: number, pageSize: number, filters: Record<string, any>): string {
  // Reduce granularity for better cache efficiency under load
  const hasFilters = Object.keys(filters).length > 0;
  const bucket = Math.floor(page / 5); // Group pages in buckets of 5
  
  if (!hasFilters) {
    return `noticias-clean-${bucket}-${pageSize}`;
  }
  
  // Simple hash for filters to reduce unique keys
  const filterHash = Object.keys(filters).sort().join('-');
  return `noticias-filtered-${bucket}-${pageSize}-${filterHash}`;
}
 
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

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch all noticias slugs');
  }
  const { data } = await res.json();
  return data;
}

 
export async function getNoticiasPaginadas(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  // Create cache tag for better cache invalidation
  const cacheKey = createCacheKey(page, pageSize, filters);
  
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
      pagination: { page, pageSize },
      filters: {
        publicado: { $eq: true },
        ...filters,
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`);

  if (!res.ok) {
    throw new Error('Failed to fetch paginated noticias');
  }
  const { data, meta } = await res.json();
  return { noticias: data, pagination: meta.pagination };
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

 
export async function getNoticiasRelacionadas(categoria: string, excludeSlug?: string) {
  const filters: any = {
    categoria: { $eq: categoria },
    publicado: { $eq: true },
  };

  // Excluir la noticia actual si se proporciona el slug
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
          fields: ['url', 'alternativeText']
        }
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

export function getPortada({ noticia }: any) {
  const url = noticia.portada?.data?.url || noticia.portada?.url;

  if (!url) return null;
  return cfImages(url, 1200, 'auto');
}

export function getImagenes(noticia: Noticia) {
  return (
    noticia.imagen?.map((img: any) => ({
      url: cfImages(img.url, 800, 'auto'),
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

  const res = await fetch(`${API_URL}/noticias?${query}`);

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