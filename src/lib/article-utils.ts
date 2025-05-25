import { formatearFecha } from "./utils";

export const ARTICLES_PER_PAGE = 4;

export function normalizeArticle(item: any) {
  const date = formatearFecha(item.date || item.fecha || "");
  
  return {
    id: item.slug,
    slug: item.slug,
    title: item.title || item.titulo,
    titulo: item.titulo,
    description: item.description || item.resumen,
    resumen: item.resumen,
    date,
    fecha: date,
    imageUrl: item.imageUrl || item.imagen,
    imagen: item.imagen,
    categoria: item.subcategoria,
    content: item.content,
    esImportante: item.esImportante || false,
  };
}
