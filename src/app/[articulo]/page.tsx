//PAGE PRINCIPAL

import { formatearFecha } from "@lib/utils";
import { getAllContentMetadata } from "@modules/article/data/content";
import { Info } from "lucide-react";
import PageWithFAQ from "@modules/article/components/PageWithFAQ";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generación dinámica de metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ articulo: string }>;
}): Promise<Metadata> {
  // Primero debemos esperar el objeto params completo
  const resolvedParams = await params;

  const titles: Record<string, string> = {
    noticias: "Noticias",
    tramites: "Trámites",
  };

  const descriptions: Record<string, string> = {
    noticias:
      "Noticias y novedades del Consejo General de Educación (CGE) en Corrientes",
    tramites: "Información detallada sobre los trámites disponibles en el CGE",
  };

  // Ahora podemos acceder a articulo de manera segura
  const articulo = resolvedParams.articulo;

  if (!titles[articulo]) {
    return notFound();
  }

  return {
    title: titles[articulo],
    description: descriptions[articulo],
  };
}

// Generación estática de rutas
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
  // Primero esperamos el objeto params y searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const articulo = resolvedParams.articulo;

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

  const isNoticias = articulo === "noticias";



  return (
    <PageWithFAQ
      articles={data}
      basePath={`/${articulo}`}
      isNoticia={isNoticias}
      pagination={pagination}
    />
  );
}
