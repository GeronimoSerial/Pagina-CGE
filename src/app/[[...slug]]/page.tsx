// src/app/noticia/[id]/page.tsx
import HomePage from "../home";
import { getAllNews } from "../../modules/news/data/news";

export default function Page() {
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
    category: item.category,
    content: item.content,
  }));
  return <HomePage news={news} />;
}

export async function generateStaticParams() {
  return [
    { slug: [] }, // Ruta principal: "/"
  ];
}