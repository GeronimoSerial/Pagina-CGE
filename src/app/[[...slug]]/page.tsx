// src/app/noticia/[id]/page.tsx
import HomePage from "../home";
import { getAllNews } from "../../modules/news/data/news";

export async function generateStaticParams() {
  return [
    { slug: [] }, // Ruta principal: "/"
  ];
}
export default function PagPrincipal() {
  const rawNews = getAllNews();
  const news = rawNews.map((item: any) => ({
    id: item.slug,
    slug: item.slug,
    title: item.title || item.titulo,
    titulo: item.titulo,
    description: item.description || item.resumen,
    resumen: item.resumen,
    date: item.date || item.fecha,
    fecha: item.fecha,
    imageUrl: item.imageUrl || item.imagen,
    imagen: item.imagen,
    categoria: item.categoria,
    content: item.content,
  }));
  return <HomePage news={news} />;
}
