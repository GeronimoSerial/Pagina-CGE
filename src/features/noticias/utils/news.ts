import { Noticia } from '@/shared/interfaces';

export const separarNoticias = (noticias: Noticia[]) => {
  const destacadas = noticias.filter((noticia) => noticia.esImportante);
  const regulares = noticias.filter((noticia) => !noticia.esImportante);
  return { destacadas, regulares };
};