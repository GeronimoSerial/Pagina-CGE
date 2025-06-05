// Pagina principal para noticias o trámites
import { formatearFecha } from "@lib/utils";
import { getAllContentMetadata } from "@modules/article/data/content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroSection from "@modules/layout/Hero";
import Contact from "@modules/layout/Contact";
import InfoBar from "@/src/modules/layout/InfoBar";
import FAQSection from "@modules/layout/FAQSection";
import ArticlesContainer from "@/src/app/[articulo]/ArticlesContainer";

const HERO = {
  noticias: {
    title: "Noticias y Novedades",
    description:
      "Mantente informado con las últimas noticias y novedades del Consejo General de Educación.",
  },
  tramites: {
    title: "Trámites y Gestiones",
    description:
      "Portal centralizado de trámites del Consejo General de Educación. Acceda a toda la información y documentación necesaria.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ articulo: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  const titles: Record<string, string> = {
    noticias: "Noticias y Novedades",
    tramites: "Trámites y Gestiones",
  };

  const descriptions: Record<string, string> = {
    noticias:
      "Noticias y novedades del Consejo General de Educación (CGE) en Corrientes",
    tramites: "Información detallada sobre los trámites disponibles en el CGE",
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

  const data = rawData.map((item: any) => {
    const date = formatearFecha(item.date || item.fecha);
    return {
      id: item.slug,
      slug: item.slug,
      titulo: item.titulo,
      resumen: item.resumen || item.description || "",
      description: item.description || item.resumen,
      date,
      fecha: date,
      imagen:
        item.imagen ||
        (articulo === "noticias" ? "/images/news.png" : "/images/tramites.png"),
      categoria: item.subcategoria,
      esImportante: item.esImportante || false,
    };
  });

  const heroConfig = articulo === "noticias" ? HERO.noticias : HERO.tramites;

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection
        title={heroConfig.title}
        description={heroConfig.description}
      />
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
