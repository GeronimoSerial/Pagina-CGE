import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { articlesItem } from "../interfaces";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearFecha(fechaStr: string | Date) {
  if (!fechaStr) return "";

  const date = new Date(fechaStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export interface ArticlesGridProp
 {
  articles?: articlesItem[];
  title?: string;
  subtitle?: string;
}

// Filtra articulos por término de búsqueda y categoría
export function filtrarArticulos(article: any[], searchTerm: string, categoriaSeleccionada: string) {
  return article.filter((item) => {
    const coincideCategoria =
      !categoriaSeleccionada || item.categoria === categoriaSeleccionada;
    const coincideBusqueda =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resumen?.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}



export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};
