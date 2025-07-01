import { API_URL, STRAPI_URL } from '@/shared/lib/config';
import { Noticia } from '@/shared/interfaces';
import qs from 'qs';

/**
 * Obtiene los slugs de todas las noticias publicadas.
 * Optimizado para `generateStaticParams` al solicitar solo el campo `slug`.
 * Cachea el resultado durante una hora.
 */
export async function getAllNoticias() {
  const query = qs.stringify(
    {
      fields: ['slug'],
      filters: {
        publicado: { $eq: true },
      },
      pagination: {
        limit: -1, // Strapi v4: -1 para obtener todos los registros
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 3600, tags: ['noticias-collection'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch all noticias slugs');
  }
  const { data } = await res.json();
  return data;
}

/**
 * Obtiene las noticias para una página específica, con filtros opcionales.
 * Utiliza ISR con una revalidación de 5 minutos y una etiqueta de caché.
 */
export async function getNoticiasPaginadas(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  const query = qs.stringify(
    {
      populate: '*',
      sort: ['fecha:desc'],
      pagination: { page, pageSize },
      filters,
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 300, tags: ['noticias-collection'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch paginated noticias');
  }
  const { data, meta } = await res.json();
  return { noticias: data, pagination: meta.pagination };
}

/**
 * Obtiene una noticia específica por su slug.
 * Utiliza ISR con una revalidación de 1 hora y etiquetas de caché específicas.
 */
export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const query = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: '*',
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 3600, tags: ['noticias', slug] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticia by slug');
  }
  const { data } = await res.json();
  if (!data || data.length === 0) return null;

  const n = data[0];
  return {
    id: n.id,
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
    metaTitle: n.metaTitle,
    metaDescription: n.metaDescription,
  };
}

/**
 * Obtiene noticias relacionadas por categoría.
 * Utiliza ISR con una revalidación de 5 minutos y etiquetas de caché.
 */
export async function getNoticiasRelacionadas(categoria: string) {
  const query = qs.stringify(
    {
      filters: {
        categoria: { $eq: categoria },
        // Opcional: excluir la noticia actual si tienes el slug o id
      },
      pagination: { limit: 2 },
      populate: '*',
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 300, tags: ['noticias-collection', `category:${categoria}`] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticias relacionadas');
  }
  const { data } = await res.json();
  return data;
}

// --- Funciones de utilidad (sin cambios) ---

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
export async function getNoticiasCategorias(): Promise<string[]> {
  // Primero, obtenemos todas las noticias, pero solo el campo 'categoria'.
  const query = qs.stringify(
    {
      fields: ['categoria'],
      pagination: {
        limit: -1, // Traer todas las noticias
      },
    },
    { encodeValuesOnly: true },
  );

  const res = await fetch(`${API_URL}/noticias?${query}`, {
    next: { revalidate: 3600, tags: ['noticias-collection', 'categorias'] },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch noticias categorias');
  }

  const { data } = await res.json();

  // Usamos un Set para obtener valores únicos y luego lo convertimos a un array.
  const categoriasUnicas = Array.from(
    new Set(data.map((item: any) => item.categoria).filter(Boolean)),
  );

  return categoriasUnicas as string[];
}