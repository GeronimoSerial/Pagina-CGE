"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { Clock, Smartphone, FileSearch } from "lucide-react";
import ArticlesGrid from "./ArticlesGrid";
import HeroSection from "@modules/layout/Hero";
import SearchInput from "@modules/layout/SearchInput";
import FAQSection from "@modules/layout/FAQSection";
import { FAQ } from "@modules/faqs/faqs";
import { HeadlessPagination } from "@modules/documentation/components/HeadlessPagination";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { PageWithFAQProps } from "../data/types";
import { normalizeText } from "@/src/lib/utils";

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
  heroTitle,
  heroDescription,
  infoBarItems,
  articles,
  categories,
  searchPlaceholder,
  buttonText,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateButtonText,
  basePath,
  faqTitle,
  faqDescription,
  faqs,
  contactTitle,
  contactSchedule,
  contactButtonText,
  contactUrl,
  isNoticia,
  pagination,
}: PageWithFAQProps) {
  const router = useRouter();
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para la categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  // Estado para mostrar loading al cambiar de página
  const [loadingPage, setLoadingPage] = useState(false);
  // Estado con todos los artículos indexados (metadatos)
  const [allArticles, setAllArticles] = useState<any[]>([]);

  // Cuando cambia la categoría, actualizar la URL (filtrado en servidor)
  const handleCategoryChange = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setLoadingPage(true);
    const params = new URLSearchParams(window.location.search);
    if (cat && cat !== "") {
      params.set("categoria", normalizeText(cat));
    } else {
      params.delete("categoria");
    }
    params.set("page", "1"); // Siempre volver a la primera página al filtrar
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  // Cargar el index.json de metadatos al montar el componente o cambiar basePath
  useEffect(() => {
    const tipo = basePath.includes("noticia") ? "noticias" : "tramites";
    fetch(`/content/${tipo}/index.json`)
      .then((res) => res.json())
      .then((data) => setAllArticles(data))
      .catch(() => setAllArticles([]));
  }, [basePath]);

  // Instancia de Fuse.js para búsqueda difusa, solo se recrea si cambian los artículos
  const fuse = useMemo(() => {
    if (allArticles.length === 0) return null;
    return new Fuse(allArticles, {
      keys: ["titulo", "resumen", "subcategoria"],
      threshold: 0.3,
    });
  }, [allArticles]);

  // Si hay búsqueda activa, filtrar en cliente; si no, usar artículos del servidor
  const filteredArticles = useMemo(() => {
    if (searchTerm.trim() !== "" && fuse) {
      return fuse.search(searchTerm).map((r) => r.item);
    }
    return undefined;
  }, [searchTerm, fuse]);

  // Transformar los artículos para el grid
  const transformedArticles = useMemo(() => {
    if (loadingPage) return undefined;
    const source =
      filteredArticles !== undefined ? filteredArticles.slice(0, 4) : articles;
    return source.map((item) => ({
      id: item.slug,
      slug: item.slug,
      titulo: item.titulo,
      description: item.description || item.resumen,
      date: item.fecha,
      imagen: item.imagen,
      categoria: item.categoria || item.subcategoria,
      esImportante: item.esImportante,
    }));
  }, [articles, loadingPage, filteredArticles]);

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

  // Determinar categorías únicas si no se pasan por props
  const categorias =
    categories ||
    Array.from(
      new Set(articles.map((item: any) => item.categoria).filter(Boolean))
    );

  // Calcular datos de paginación
  const totalPaginas =
    searchTerm.trim() !== ""
      ? Math.ceil((filteredArticles?.length || 0) / 4)
      : pagination
      ? pagination.totalPages
      : Math.ceil(articles.length / 4);
  const currentPage = pagination ? pagination.currentPage : 1;

  // Render principal
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero principal */}
      <HeroSection title={heroTitle} description={heroDescription} />
      {/* Barra de información */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {infoBarItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon}
                <p className="text-sm font-medium text-gray-600">
                  {item.label}{" "}
                  <span className="text-gray-900">{item.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Buscador y selector de categorías */}
      {categorias.length > 1 && (
        <section className="w-full py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-3xl">
                <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6 border border-gray-100">
                  <SearchInput
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    placeholder={searchPlaceholder}
                    categories={categorias}
                    selectedCategory={categoriaSeleccionada}
                    onCategoryChange={handleCategoryChange}
                    allLabel="Todas las categorías"
                  />
                </div>
              </div>
              {/* Enlace externo solo para trámites */}
              {!isNoticia && (
                <a
                  href="https://expgob.mec.gob.ar/lup_mod/ubicar_expedWeb.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-[#3D8B37] font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-[#3D8B37]/20 hover:border-[#3D8B37]/40 text-sm"
                >
                  <FileSearch className="h-4 w-4 mr-2 text-[#3D8B37]" />
                  Consultar estado de tu expediente
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Grid de artículos y paginación */}
      <div className="container mx-auto px-4 md:px-6" id="grid-container">
        <div className="min-h-screen/2 py-8">
          <ArticlesGrid
            articles={transformedArticles}
            buttonText={buttonText}
            emptyStateTitle={emptyStateTitle}
            emptyStateDescription={emptyStateDescription}
            emptyStateButtonText={emptyStateButtonText}
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
      <FAQSection
        faqTitle={faqTitle}
        faqDescription={faqDescription}
        faqs={faqs}
      />
      {/* Sección de contacto */}
      <div className="mt-16 mb-3 bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-[#3D8B37]/10 p-4 rounded-xl mr-5">
              <Clock className="h-8 w-8 text-[#3D8B37]" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-800">
                {contactTitle}
              </h4>
              <p className="text-gray-600 text-lg">{contactSchedule}</p>
            </div>
          </div>
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            {contactButtonText}
            <Smartphone className="h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </main>
  );
}
