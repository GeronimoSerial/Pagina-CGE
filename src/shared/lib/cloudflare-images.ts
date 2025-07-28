import { STRAPI_URL } from './config';

export const cfImages = (
  url: string,
  width: number = 800,
  format: string = 'auto',
) => {
  if (!url) return '';

  // Si la URL ya es completa, extraer solo el path
  if (url.startsWith(STRAPI_URL)) {
    const path = url.replace(STRAPI_URL, '');
    return `${STRAPI_URL}/cdn-cgi/image/width=${width},format=${format}${path}`;
  }

  if (url.startsWith('/uploads/')) {
    return `${STRAPI_URL}/cdn-cgi/image/width=${width},format=${format}${url}`;
  }

  return url;
};
