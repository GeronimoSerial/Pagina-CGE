import { Article } from "@/src/interfaces";
export const ARTICLES_PER_PAGE = 4;

export function normalizeArticle(item: any) {
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title || item.titulo,
    titulo: item.titulo,
    description: item.description || item.resumen,
    resumen: item.resumen,
    date: item.fecha ? new Date(item.fecha).toISOString() : new Date().toISOString(),
    imageUrl: item.imageUrl || item.imagen,
    imagen: item.imagen,
    categoria: item.subcategoria,
    content: item.content,
    esImportante: item.esImportante || false,
  };
}
