// src/app/noticia/[id]/page.tsx
import HomePage from "./home";
import { getAllNews } from "../modules/news/data/news";
import { formatearFecha } from "../lib/utils";

export async function generateStaticParams() {
  return [
    { slug: [] }, // Ruta principal: "/"
  ];
}
export default function PagPrincipal() {
  const rawNews = getAllNews();
  
  const news = rawNews.map((item: any) => {
    const date = formatearFecha(item.date || item.fecha);
    
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
      categoria: item.categoria,
      content: item.content,
    };
  });
  return <HomePage news={news} />;
}