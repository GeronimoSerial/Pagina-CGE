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

// Este hook abstrae la lógica de búsqueda y filtrado para que el componente principal permanezca limpio y enfocado en la UI.
const useArticleSearch = (articles: Article[], isNoticia: boolean) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Elegimos categorías distintas según el tipo de contenido para mejorar la experiencia de filtrado.
  const categories = useMemo(
    () =>
      isNoticia
        ? ["General", "Novedades", "Eventos", "Comunicados"]
        : ["Licencias", "Títulos", "Inscripción", "Otros"],
    [isNoticia]
  );

  // Usamos Fuse.js para permitir búsquedas tolerantes a errores de tipeo y más flexibles.
  const fuse = useMemo(() => {
    if (articles.length === 0) return null;
    return new Fuse(articles, {
      keys: ["titulo", "resumen", "subcategoria"],
      threshold: 0.3,
    });
  }, [articles]);

  // El filtrado se realiza en memoria para evitar llamadas innecesarias al backend y mejorar la velocidad de respuesta.
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
    loadingPage,
    setLoadingPage,
    error,
    setError,
    categories,
    filteredResults,
  };
};

export default function ArticlesContainer({
  basePath,
  articles: initialArticles,
  pagination,
}: ArticlesContainerProps) {
  // Determinamos el tipo de contenido para adaptar la UI y la lógica de filtrado.
  const isNoticia = basePath.includes("noticias");
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  // Centralizamos la lógica de búsqueda y filtrado en el hook para mantener el componente enfocado en el renderizado.
  const {
    searchTerm,
    setSearchTerm,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    loadingPage,
    setLoadingPage,
    error,
    setError,
    categories,
    filteredResults,
  } = useArticleSearch([...articles, ...(initialArticles || [])], isNoticia);

  // El placeholder cambia según el tipo de contenido para guiar al usuario.
  const searchPlaceholder = useMemo(
    () => (isNoticia ? "Buscar noticias..." : "Buscar trámites..."),
    [isNoticia]
  );

  // Al cambiar la categoría, actualizamos la URL para permitir compartir enlaces filtrados y reiniciamos la paginación.
  const handleCategoryChange = (cat: string) => {
    setCategoriaSeleccionada(cat);
    const params = new URLSearchParams(window.location.search);
    if (cat && cat !== "") {
      params.set("categoria", normalizeText(cat));
    } else {
      params.delete("categoria");
    }
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  // Si no hay artículos iniciales, los cargamos desde un archivo estático para mejorar la velocidad de carga y evitar llamadas innecesarias al backend.
  useEffect(() => {
    if (!initialArticles || initialArticles.length === 0) {
      const tipo = isNoticia ? "noticias" : "tramites";
      setLoadingPage(true);

      fetch(`/content/${tipo}/index.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar los artículos");
          return res.json();
        })
        .then((data: Article[]) => {
          setArticles(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setArticles([]);
        })
        .finally(() => {
          setLoadingPage(false);
        });
    }
  }, [isNoticia, initialArticles]);
  
  // Efecto para manejar el estado de carga cuando cambian los initialArticles (e.g., por paginación)
  useEffect(() => {
    if (initialArticles !== undefined) {
      setLoadingPage(true);
      // Pequeño retraso para permitir que el estado de carga se muestre antes de procesar los nuevos artículos
      const timer = setTimeout(() => {
        setLoadingPage(false);
      }, 50);
       return () => clearTimeout(timer);
    }
  }, [initialArticles]);

  // Solo mostramos resultados filtrados si el usuario está buscando activamente.
  const showFilteredResults = searchTerm;
  const displayedArticles = (showFilteredResults ? filteredResults : initialArticles)?.map((article) => ({
    ...article,
    id: article.id ?? article.slug,
    description: article.description ?? article.resumen ?? "Sin descripción",
  }));

  // Mostramos un mensaje de error si la carga de artículos falla.
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  // El layout principal prioriza la usabilidad: buscador, categorías y resultados.
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
                {/* El enlace a expedientes solo se muestra para trámites porque es relevante solo en ese contexto. */}
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
      <ArticlesGrid 
        articles={displayedArticles} 
        basePath={basePath} 
        pagination={pagination} 
        isLoading={loadingPage}
      />
    </>
  );
}
