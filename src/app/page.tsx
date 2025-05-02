// src/app/noticia/[id]/page.tsx
import { getAllContent } from "../modules/article/data/content";
import { formatearFecha } from "../lib/utils";
import HeroSection from "../modules/home/components/HeroSection";
import QuickAccess from "../modules/home/components/QuickAccess";
import { Separator } from "@radix-ui/react-separator";
import ArticlesGrid from "../modules/article/components/ArticlesGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialMediaSection from "../modules/socials/SocialMediaSection";

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
            <div className="container relative mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
                  Ultimas noticias y novedades{" "}
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed">
                  Mantente informado sobre las últimas novedades, publicaciones
                  y resoluciones del Consejo General de Educación
                </p>
              </div>
            </div>
            <ArticlesGrid
              articles={news}
              buttonText="Ver noticia"
              emptyStateTitle="No se encontraron noticias"
              emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
              emptyStateButtonText="Mostrar todas las noticias"
              showUrgentBadge={true}
              basePath="/noticias"
            />
            <div className="container mx-auto px-4 pb-12">
              <div className="flex justify-center">
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-2 bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium px-6 py-3 mt-5 rounded-lg transition-colors duration-300"
                >
                  Ver todas las noticias
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <SocialMediaSection />
      </main>
    </div>
  );
}
