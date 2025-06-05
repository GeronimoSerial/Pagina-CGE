"use client";
// Importaciones principales de React y librerías externas
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { FileSearch } from "lucide-react";
import SearchInput from "@modules/layout/SearchInput";
import { normalizeText } from "@/src/lib/utils";
import ArticlesGrid from "../../modules/article/components/ArticlesGrid";
import { Article } from "@/src/interfaces";

interface ArticlesContainerProps {
  basePath: string;
  articles?: Article[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const useArticleSearch = (articles: Article[], isNoticia: boolean) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const categories = useMemo(
    () =>
      isNoticia
        ? ["General", "Novedades", "Eventos", "Comunicados"]
        : ["Licencias", "Títulos", "Inscripción", "Otros"],
    [isNoticia]
  );

  const fuse = useMemo(() => {
    if (articles.length === 0) return null;
    return new Fuse(articles, {
      keys: ["titulo", "resumen", "subcategoria"],
      threshold: 0.3,
    });
  }, [articles]);

  const filteredResults = useMemo(() => {
    if (!articles || articles.length === 0) return [];

    let results = [...articles];

    if (categoriaSeleccionada) {
      results = results.filter(
        (article) =>
          article.categoria?.toLowerCase() ===
          categoriaSeleccionada.toLowerCase()
      );
    }

    if (searchTerm && fuse) {
      const searchResults = fuse.search(searchTerm);
      results = searchResults.map((result) => result.item);
    }

    return results.map((article) => ({
      ...article,
      id: article.id || article.slug,
      description: article.description || article.resumen || "Sin descripción",
    }));
  }, [searchTerm, categoriaSeleccionada, fuse, articles]);
  return {
    searchTerm,
    setSearchTerm,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    categories,
    filteredResults,
  };
};

export default function ArticlesContainer({
  basePath,
  articles: initialArticles,
  pagination,
}: ArticlesContainerProps) {
  const isNoticia = basePath.includes("noticias");
  const router = useRouter();

  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const [isLoadingFullList, setIsLoadingFullList] = useState(true);
  const [errorLoadingFullList, setErrorLoadingFullList] = useState<
    string | null
  >(null);
  const [isCategoryFiltering, setIsCategoryFiltering] = useState(false);

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

  const handleCategoryChange = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setIsCategoryFiltering(true);
    const params = new URLSearchParams(window.location.search);
    if (cat && cat !== "") {
      params.set("categoria", normalizeText(cat));
    } else {
      params.delete("categoria");
    }

    params.delete("page");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const tipo = isNoticia ? "noticias" : "tramites";
    setIsLoadingFullList(true);

    fetch(`/content/${tipo}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los artículos completos");
        return res.json();
      })
      .then((data: Article[]) => {
        setAllArticles(data);
        setErrorLoadingFullList(null);
      })
      .catch((err) => {
        setErrorLoadingFullList(err.message);
        setAllArticles([]);
      })
      .finally(() => {
        setIsLoadingFullList(false);
      });
  }, [isNoticia]);

  useEffect(() => {
    if (initialArticles !== undefined) {
      setIsCategoryFiltering(false);
    }
  }, [initialArticles]);

  const showFilteredResults = searchTerm;
  const articlesToDisplay = useMemo(() => {
    if (showFilteredResults) {
      return filteredResults.slice(0, 4).map((article) => ({
        ...article,
        id: article.id ?? article.slug,
        description:
          article.description ?? article.resumen ?? "Sin descripción",
      }));
    } else {
      return (
        initialArticles?.map((article) => ({
          ...article,
          id: article.id ?? article.slug,
          description:
            article.description ?? article.resumen ?? "Sin descripción",
        })) || []
      );
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
                <div className="w-full max-w-3xl">
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
      </main>
      <div className="min-h-[500px]">
        <ArticlesGrid
          articles={articlesToDisplay}
          basePath={basePath}
          pagination={pagination}
          isLoading={isLoading}
          isCategoryLoading={isCategoryFiltering}
        />
      </div>
    </>
  );
}
