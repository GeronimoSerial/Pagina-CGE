import { API_URL } from '@/shared/lib/config';
import { STRAPI_URL } from '@/shared/lib/config';
import { Noticia } from '@/shared/interfaces';
import qs from 'qs';

export async function getNoticias() {
  const res = await fetch(`${API_URL}/noticias?populate=*`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const { data } = await res.json();
  return data;
}

export function getNoticiaPortada({ noticia }: any) {
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
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch paginated noticias');
  }
  const { data, meta } = await res.json();
  return { noticias: data, pagination: meta.pagination };
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const res = await fetch(
    `${API_URL}/noticias?filters[slug][$eq]=${slug}&populate=*`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch noticia by slug');
  }
  const { data } = await res.json();
  if (!data || data.length === 0) return null;
  const n = data[0];
  // Devuelve solo los campos que usas
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

export async function getNoticiasRelacionadas(categoria: string) {
  const res = await fetch(
    `${API_URL}/noticias?filters[categoria][$eq]=${categoria}&pagination[limit]=2&populate=*`,
    { next: { revalidate: 60 * 60 * 24 } },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch noticias relacionadas');
  }
  const { data } = await res.json();
  return data;
}
