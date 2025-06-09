// src/app/noticia/[id]/page.tsx
import { getAllContentMetadata } from "@modules/article/data/content";
import { normalizeArticle } from "@lib/utils";
import HeroMain from "@/src/modules/home/components/HeroMain";
import QuickAccess from "@modules/home/components/QuickAccess";
import { Separator } from "@radix-ui/react-separator";
import ArticlesGrid from "@modules/article/components/ArticlesGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialMediaSection from "@modules/socials/SocialMediaSection";

export default async function PagPrincipal() {
  const { items: rawNews } = await getAllContentMetadata("noticias", 1, 4);

  const news = rawNews.map(normalizeArticle);

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
                <h3 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r md:leading-normal lg:leading-relaxed from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
                  Últimas noticias y novedades
                </h3>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed text-balance">
                  Mantente informado sobre las últimas novedades, publicaciones
                  y resoluciones del Consejo General de Educación
                </p>
              </div>
            </div>
            <ArticlesGrid
              articles={news}
              basePath="/noticias"
              showImportantBadge={true}
            />
            <div className="container mx-auto py-6 px-4 pb-12">
              <div className="flex justify-center">
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-2 bg-[#216B1D] hover:bg-[#195016] text-white font-medium px-6 py-3 mt-5 rounded-lg transition-colors duration-300"
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
