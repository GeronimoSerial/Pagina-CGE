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
  articles?: Article[]; // Artículos paginados que vienen como prop (página actual)
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
  // No manejamos los estados de carga/error de la búsqueda aquí, se manejan en el componente principal

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
      id: article.id || article.slug, // Usar slug como fallback para ID
      description: article.description || article.resumen || "Sin descripción",
    }));
  }, [searchTerm, categoriaSeleccionada, fuse, articles]); // Dependencias correctas

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
  articles: initialArticles, // Artículos de la página actual (paginados por Next.js)
  pagination,
}: ArticlesContainerProps) {
  const isNoticia = basePath.includes("noticias");
  const router = useRouter();

  // Estado para almacenar TODOS los artículos cargados del JSON (usado para la búsqueda global)
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  // Estados de carga y error
  const [isLoadingFullList, setIsLoadingFullList] = useState(true); // Carga inicial de allArticles
  const [errorLoadingFullList, setErrorLoadingFullList] = useState<string | null>(null);
  const [isCategoryFiltering, setIsCategoryFiltering] = useState(false); // True mientras se navega a una nueva URL tras cambiar categoría

  // Usamos el hook para la lógica de búsqueda, pasándole la lista COMPLETA de artículos.
  const {
    searchTerm,
    setSearchTerm,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    categories,
    filteredResults,
  } = useArticleSearch(allArticles, isNoticia);

  // Placeholder del buscador
  const searchPlaceholder = useMemo(
    () => (isNoticia ? "Buscar noticias..." : "Buscar trámites..."),
    [isNoticia]
  );

  // Manejar cambio de categoría: actualiza URL y activa estado de carga de filtro
  const handleCategoryChange = (cat: string) => {
    setCategoriaSeleccionada(cat);
    setIsCategoryFiltering(true); // Activar indicador de carga de categoría
    const params = new URLSearchParams(window.location.search);
    if (cat && cat !== "") {
      params.set("categoria", normalizeText(cat));
    } else {
      params.delete("categoria");
    }
    // Resetear la página a 1 y navegar a la nueva URL con el filtro
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
    // isCategoryFiltering se desactiva cuando initialArticles (la nueva página) llegan
  };

  // Efecto para cargar la lista COMPLETA de artículos (index.json) para la búsqueda
  useEffect(() => {
    const tipo = isNoticia ? "noticias" : "tramites";
    setIsLoadingFullList(true); // Iniciar carga

    fetch(`/content/${tipo}/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los artículos completos");
        return res.json();
      })
      .then((data: Article[]) => {
        setAllArticles(data); // Guardar todos los artículos
        setErrorLoadingFullList(null);
      })
      .catch((err) => {
        setErrorLoadingFullList(err.message);
        setAllArticles([]); // Vaciar lista en caso de error
      })
      .finally(() => {
        setIsLoadingFullList(false); // Finalizar carga
      });
  }, [isNoticia]); // Depende de isNoticia para recargar si cambia el tipo

  // Efecto para desactivar el estado de carga de categoría cuando llegan los initialArticles de la nueva página
  useEffect(() => {
    if (initialArticles !== undefined) {
      setIsCategoryFiltering(false); // Desactivar carga de filtro de categoría
    }
  }, [initialArticles]); // Depende de initialArticles para saber cuándo la nueva página ha cargado

  // Determinar qué artículos mostrar: resultados filtrados (limitado a 4) si hay búsqueda,
  // de lo contrario, artículos paginados (initialArticles).
  const showFilteredResults = searchTerm;
  const articlesToDisplay = useMemo(() => {
    if (showFilteredResults) {
      return filteredResults.slice(0, 4).map(article => ({
        ...article,
        id: article.id ?? article.slug,
        description: article.description ?? article.resumen ?? "Sin descripción",
      }));
    } else {
      return initialArticles?.map(article => ({
        ...article,
        id: article.id ?? article.slug,
        description: article.description ?? article.resumen ?? "Sin descripción",
      })) || []; // Asegurarse de devolver array vacío
    }
  }, [showFilteredResults, filteredResults, initialArticles]); // Dependencias correctas

  // Estado de carga general para el esqueleto: True si allArticles no han cargado o initialArticles no han llegado
  const isLoading = isLoadingFullList || initialArticles === undefined;

  // Mostrar mensaje de error si falla la carga de la lista completa de artículos
  if (errorLoadingFullList) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error al cargar artículos: {errorLoadingFullList}
        </div>
      </div>
    );
  }

  // Renderizado principal: buscador, categorías y grilla de artículos
  return (
    <>
      <main className="bg-gray-50 border-t border-gray-100 z-10 relative py-8">
        {/* Mostrar buscador/categorías si hay categorías */}
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
      {/* Contenedor con altura mínima para evitar salto de layout */}
      <div className="min-h-[500px]"> {/* Altura mínima */}
        <ArticlesGrid 
          articles={articlesToDisplay}
          basePath={basePath} 
          pagination={pagination} 
          isLoading={isLoading} // Carga general para esqueleto
          isCategoryLoading={isCategoryFiltering} // Carga específica para Loader2
        />
      </div>
    </>
  );
}
