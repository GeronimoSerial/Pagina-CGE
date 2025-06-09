// Contenedor del articlesgrid y el buscador que requieren Client side
"use client";
import React, { useMemo, useEffect } from "react";
import { FileSearch } from "lucide-react";
import SearchInput from "@modules/layout/SearchInput";
import ArticlesGrid from "@modules/article/components/ArticlesGrid";
import { Article } from "@/src/interfaces";
import { useArticleSearch } from "@/src/hooks/articles/useArticleSearch";
import { useArticlesData } from "@/src/hooks/articles/useArticlesData";
import { useArticleCategories } from "@/src/hooks/articles/useArticleCategories";
import { normalizeArticle } from "@lib/utils";

interface ArticlesContainerProps {
  basePath: string;
  articles?: Article[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export default function ArticlesContainer({
  basePath,
  articles: initialArticles,
  pagination,
}: ArticlesContainerProps) {
  const isNoticia = basePath.includes("noticias");

  const {
    allArticles,
    isLoadingFullList,
    errorLoadingFullList,
    isCategoryFiltering,
    setIsCategoryFiltering,
  } = useArticlesData(isNoticia);

  const {
    searchTerm,
    setSearchTerm,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    categories,
    filteredResults,
  } = useArticleSearch(allArticles, isNoticia);

  const searchPlaceholder = useMemo(
    () => (isNoticia ? "Buscar noticias..." : "Buscar trámites..."),
    [isNoticia]
  );
  const { handleCategoryChange } = useArticleCategories({
    basePath,
    setCategoriaSeleccionada,
    setIsCategoryFiltering,
  });

  useEffect(() => {
    if (initialArticles !== undefined) {
      setIsCategoryFiltering(false);
    }
  }, [initialArticles]);

  const showFilteredResults = searchTerm;
  const articlesToDisplay = useMemo(() => {
    if (showFilteredResults) {
      return filteredResults.slice(0, 4).map(normalizeArticle);
    } else {
      return initialArticles?.map(normalizeArticle) || [];
    }
  }, [showFilteredResults, filteredResults, initialArticles]);

  const isLoading = isLoadingFullList || initialArticles === undefined;

  if (errorLoadingFullList) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error al cargar artículos: {errorLoadingFullList}
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-gray-50 border-t border-gray-100 z-10 relative py-8">
        {categories.length > 1 && (
          <section className="w-full">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-2xl">
                  <div className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6 border border-gray-100">
                    <SearchInput
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={searchPlaceholder}
                      categories={categories}
                      selectedCategory={categoriaSeleccionada}
                      onCategoryChange={handleCategoryChange}
                      allLabel="Todas las categorías"
                    />
                  </div>
                </div>
                {/* Expedientes Button */}
                {!isNoticia && (
                  <a
                    href="https://expgob.mec.gob.ar/lup_mod/ubicar_expedWeb.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-[#2B682B] font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 border border-[#2B682B]/30 hover:border-[#2B682B]/50 text-sm"
                  >
                    <FileSearch className="h-4 w-4 mr-2 text-[#2B682B]" />
                    Consultar estado de tu expediente
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      <div className="mt-6 min-h-[500px]">
        <ArticlesGrid
          articles={articlesToDisplay}
          basePath={basePath}
          pagination={pagination}
          isLoading={isLoading}
          isCategoryLoading={isCategoryFiltering}
          showImportantBadge={true}
          />
      </div>
          </main>
    </>
  );
}
