// Pagina principal para noticias o trámites
import { getAllContentMetadata } from "@modules/article/data/content";
import { normalizeArticle } from "@lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroSection from "@modules/layout/Hero";
import Contact from "@modules/layout/Contact";
import InfoBar from "@/src/modules/layout/InfoBar";
import FAQSection from "@modules/layout/FAQSection";
import ArticlesContainer from "@/src/app/[articulo]/ArticlesContainer";
import { HERO_CONFIG } from "@/src/modules/article/data/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ articulo: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  const titles: Record<string, string> = {
    noticias: HERO_CONFIG.noticias.title,
    tramites: HERO_CONFIG.tramites.title,
  };

  const descriptions: Record<string, string> = {
    noticias: HERO_CONFIG.noticias.description,
    tramites: HERO_CONFIG.tramites.description,
  };

  const articulo = resolvedParams.articulo;

  if (!titles[articulo]) {
    return notFound();
  }

  return {
    title: titles[articulo],
    description: descriptions[articulo],
  };
}

export async function generateStaticParams() {
  return [{ articulo: "noticias" }, { articulo: "tramites" }];
}
export default async function ContenidoGrid({
  params,
  searchParams,
}: {
  params: Promise<{ articulo: string }>;
  searchParams?: Promise<{ [key: string]: string }>;
}) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const articulo = resolvedParams.articulo;

  if (articulo !== "noticias" && articulo !== "tramites") {
    return notFound();
  }

  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const limit = 4;
  const searchTerm = resolvedSearchParams?.search || "";
  const categoria = resolvedSearchParams?.categoria || "";

  const { items: rawData, pagination } = await getAllContentMetadata(
    articulo,
    page,
    limit,
    searchTerm,
    categoria
  );

  const data = rawData.map(normalizeArticle);

  const hero =
    articulo === "noticias" ? HERO_CONFIG.noticias : HERO_CONFIG.tramites;

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection title={hero.title} description={hero.description} />
      <InfoBar basePath={`/${articulo}`} />

      <ArticlesContainer
        basePath={`/${articulo}`}
        articles={data}
        pagination={pagination}
      />

      <FAQSection basePath={`/${articulo}`} />
      <Contact basePath={`/${articulo}`} />
    </main>
  );
}
