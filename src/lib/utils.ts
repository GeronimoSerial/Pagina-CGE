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
