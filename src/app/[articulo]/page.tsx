// Importaciones de utilidades, módulos y componentes
import { formatearFecha } from "@lib/utils";
import { getAllContentMetadata } from "@modules/article/data/content";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import HeroSection from "@modules/layout/Hero";
import Contact from "@modules/layout/Contact";
import InfoBar from "@/src/modules/layout/InfoBar";
import FAQSection from "@modules/layout/FAQSection";
import ArticlesContainer from "@/src/app/[articulo]/ArticlesContainer";

// Constantes para textos del hero
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

// Generación dinámica de metadata para SEO y redes sociales
export async function generateMetadata({
  params,
}: {
  params: Promise<{ articulo: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  // Diccionarios para títulos y descripciones según el tipo de artículo
  const titles: Record<string, string> = {
    noticias: "Noticias y Novedades",
    tramites: "Trámites y Gestiones",
  };

  const descriptions: Record<string, string> = {
    noticias:
      "Noticias y novedades del Consejo General de Educación (CGE) en Corrientes",
    tramites: "Información detallada sobre los trámites disponibles en el CGE",
  };

  // Extraemos el parámetro 'articulo' de la URL
  const articulo = resolvedParams.articulo;

  // Si el artículo no es válido, mostramos página 404
  if (!titles[articulo]) {
    return notFound();
  }

  // Retornamos los metadatos correspondientes
  return {
    title: titles[articulo],
    description: descriptions[articulo],
  };
}

// Generación estática de rutas para SSG
export async function generateStaticParams() {
  return [{ articulo: "noticias" }, { articulo: "tramites" }];
}

// Componente principal de la página de artículos
export default async function ContenidoGrid({
  params,
  searchParams,
}: {
  params: Promise<{ articulo: string }>;
  searchParams?: Promise<{ [key: string]: string }>;
}) {
  // Esperamos los parámetros de la URL y de búsqueda
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  // Extraemos el tipo de artículo
  const articulo = resolvedParams.articulo;

  // Validamos el tipo de artículo permitido
  if (articulo !== "noticias" && articulo !== "tramites") {
    return notFound();
  }

  // Obtener página actual de los parámetros de búsqueda
  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const limit = 4; // Fijamos el límite a 4 artículos por página
  const searchTerm = resolvedSearchParams?.search || "";
  const categoria = resolvedSearchParams?.categoria || "";

  // Obtenemos los metadatos de los artículos según filtros
  const { items: rawData, pagination } = await getAllContentMetadata(
    articulo,
    page,
    limit,
    searchTerm,
    categoria
  );

  // Formateamos los datos para el componente
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

  // Determinar tipo de contenido y textos del hero
  const heroConfig = articulo === "noticias" ? HERO.noticias : HERO.tramites;

  // Renderizado del layout principal
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero e InfoBar */}
      <HeroSection
        title={heroConfig.title}
        description={heroConfig.description}
      />
      <InfoBar basePath={`/${articulo}`} />

      {/* Contenedor de artículos y buscador */}
      <ArticlesContainer
        basePath={`/${articulo}`}
        articles={data}
        pagination={pagination}
      />

      {/* Sección de Preguntas Frecuentes y contacto */}
      <FAQSection basePath={`/${articulo}`} />
      <Contact basePath={`/${articulo}`} />
    </main>
  );
}
