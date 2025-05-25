"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import ArticlesGrid from "./ArticlesGrid";
import HeroSection from "@modules/layout/Hero";
import FAQSection from "@modules/layout/FAQSection";
import SearchSection from "./SearchSection";
import { HeadlessPagination } from "@modules/documentation/components/HeadlessPagination";
import { useRouter } from "next/navigation";
import { PageWithFAQProps } from "../data/types";
import Contact from "../../layout/Contact";
import InfoBar from "./InfoBar";
// Componente principal de página con FAQ, buscador y grid de artículos
export default function PageWithFAQWrapper(props: PageWithFAQProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-gray-600">Cargando...</div>
        </div>
      }
    >
      <PageWithFAQContent {...props} />
    </Suspense>
  );
}

// Contenido principal de la página con lógica de búsqueda y filtrado
function PageWithFAQContent({
  articles,
  basePath,
  pagination,
}: PageWithFAQProps) {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(false);

  // Cambiar de página (solo para paginación del servidor)
  const handlePageChange = (page: number) => {
    if (pagination) {
      setLoadingPage(true);
      const params = new URLSearchParams(window.location.search);
      params.set("page", page.toString());
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    }
  };

  // Quitar loading cuando los artículos cambian
  useEffect(() => {
    setLoadingPage(false);
  }, [articles]);

  // Calcular datos de paginación
  const totalPaginas = pagination
    ? pagination.totalPages
    : Math.ceil(articles.length / 4);
  const currentPage = pagination ? pagination.currentPage : 1;

  const isNoticia = basePath.includes("noticias");
  const heroTitle = isNoticia ? "Noticias" : "Trámites";
  const heroDescription = isNoticia
    ? "Mantente informado con las últimas noticias y novedades del Consejo General de Educación."
    : "Portal centralizado de trámites del Consejo General de Educación. Acceda a toda la información y documentación necesaria.";

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero principal */}
      <HeroSection
        title={heroTitle}
        description={heroDescription}
        ctaText="Explorar"
      />

      {/* Barra de información */}
      <InfoBar basePath={basePath} />

      {/* Sección de búsqueda */}
      <SearchSection basePath={basePath} />

      {/* Grid de artículos y paginación */}
      <div className="container mx-auto px-4 md:px-6" id="grid-container">
        <div className="min-h-screen/2 py-8">
          <ArticlesGrid
            articles={articles}
            showImportantBadge={true}
            basePath={basePath}
          />
        </div>

        {totalPaginas > 1 && (
          <div className="py-6 border-t border-gray-100">
            <HeadlessPagination
              currentPage={currentPage}
              totalPages={totalPaginas}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Sección de preguntas frecuentes */}
      <FAQSection basePath={basePath} />

      {/* Sección de contacto */}
      <Contact basePath={basePath} />
    </main>
  );
}
