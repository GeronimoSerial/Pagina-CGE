import { DIRECTUS_URL } from './config';

export const cfImages = (
  url: string,
  width: number = 1200,
  format: string = 'auto',
) => {
  if (!url) return '';

  // Si la URL ya es completa, extraer solo el path
  if (url.startsWith(DIRECTUS_URL)) {
    const path = url.replace(DIRECTUS_URL, '');
    return `${DIRECTUS_URL}/cdn-cgi/image/width=${width},format=${format}${path}`;
  }

  if (url.startsWith('/uploads/')) {
    return `${DIRECTUS_URL}/cdn-cgi/image/width=${width},format=${format}${url}`;
  }

  return url;
};
