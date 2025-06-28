import { API_URL } from '@/src/lib/config';
import { STRAPI_URL } from '@/src/lib/config';

export async function getNoticias() {
  const res = await fetch(`${API_URL}/noticias?populate=*`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const { data } = await res.json();
  return data;
}
export function getNoticiaPortada({ noticia }: any) {
  const url = noticia.portada.url;
  return `${STRAPI_URL}${url}`;
}
