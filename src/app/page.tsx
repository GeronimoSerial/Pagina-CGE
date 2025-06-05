// src/app/noticia/[id]/page.tsx
import { getAllContent } from "@modules/article/data/content";
import { ARTICLES_PER_PAGE } from "@/src/modules/article/data/article-utils";
import HeroMain from "@modules/home/components/HeroSection";
import QuickAccess from "@modules/home/components/QuickAccess";
import { Separator } from "@radix-ui/react-separator";
import ArticlesGrid from "@modules/article/components/ArticlesGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialMediaSection from "@modules/socials/SocialMediaSection";

export default async function PagPrincipal() {
  const rawNews = await getAllContent("noticias");

  const newsArray = Array.isArray(rawNews) ? rawNews : [];

  // PASARLO AL LAYOUT ------------------------------------------------------------------
  const news = newsArray
    .filter((item) => item && (item.date || item.fecha))
    .sort((a, b) => {
      const dateA = new Date(a.date || a.fecha || "");
      const dateB = new Date(b.date || b.fecha || "");
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, ARTICLES_PER_PAGE)
    .map((item) => ({
      id: item.slug || "",
      slug: item.slug || "",
      title: item.title || item.titulo || "",
      titulo: item.titulo || item.title || "",
      description: item.description || item.resumen || "",
      resumen: item.resumen || item.description || "",
      date: item.date || item.fecha || "",
      fecha: item.fecha || item.date || "",
      imageUrl: item.imageUrl || item.imagen || "/images/news.png",
      imagen: item.imagen || item.imageUrl || "/images/news.png",
      categoria: item.subcategoria || "",
      content: item.content || "",
      esImportante: item.esImportante || false,
    }));
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroMain />
        <Separator className="my-8 " />
        {/* Quick Access Section */}
        <section className=" bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <QuickAccess />
          </div>
        </section>
        <Separator className="my-8" />
        {/* News Section */}
        <section id="noticias" className="bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="container relative mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h3 className="text-5xl font-bold mb-6 leading-relaxed bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
                  Últimas noticias y novedades
                </h3>
                <p className="text-gray-600 text-xl leading-relaxed text-balance">
                  Mantente informado sobre las últimas novedades, publicaciones
                  y resoluciones del Consejo General de Educación
                </p>
              </div>
            </div>
            <ArticlesGrid articles={news} basePath="/noticias" />
            <div className="container mx-auto py-6 px-4 pb-12">
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
        <Separator className="my-8 bg-[#217A4B]/20" />
        <SocialMediaSection />
      </main>
    </div>
  );
}
