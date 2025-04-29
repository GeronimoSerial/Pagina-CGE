// src/app/noticia/[id]/page.tsx
import { getAllContent } from "../modules/article/data/content";
import { formatearFecha } from "../lib/utils";
import HeroSection from "../modules/home/components/HeroSection";
import QuickAccess from "../modules/home/components/QuickAccess";
import { Separator } from "@radix-ui/react-separator";
import ArticlesGrid from "../modules/article/components/ArticlesGrid";

export async function generateStaticParams() {
  return [
    { slug: [] }, // Ruta principal: "/"
  ];
}

export default function PagPrincipal() {
  const rawNews = getAllContent("noticias");
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
      categoria: item.subcategoria,
      content: item.content,
    };
  });
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroSection />
        <Separator className="my-8 bg-[#217A4B]/20" />
        {/* Quick Access Section */}
        <section className="py-12 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <QuickAccess />
          </div>
        </section>
        <Separator className="my-8 bg-[#217A4B]/20" />
        {/* News Section */}
        <section id="noticias" className="py-16 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">Noticias y Novedades</h2>
              <p className="text-gray-700 max-w-3xl">
                Mantente informado sobre las últimas novedades, publicaciones y
                resoluciones del Consejo General de Educación.
              </p>
            </div>
            <ArticlesGrid articles={news} />
          </div>
        </section>
      </main>
    </div>
  );
}
