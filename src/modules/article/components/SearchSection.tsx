"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { FileSearch } from "lucide-react";
import SearchInput from "@modules/layout/SearchInput";
import { normalizeText } from "@/src/lib/utils";

interface SearchSectionProps {
  categories?: string[];
  searchPlaceholder?: string;
  basePath: string;
  isNoticia?: boolean;
}

interface Article {
  slug: string;
  titulo: string;
  resumen: string;
  subcategoria?: string;
  fecha?: string;
  imagen?: string;
  id?: string;
  categoria?: string;
  description?: string;
  esImportante?: boolean;
}

export default function SearchSection({ basePath }: SearchSectionProps) {
  const isNoticia = basePath.includes("noticias");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const categories = isNoticia
    ? ["General", "Novedades", "Eventos", "Comunicados"]
    : ["Licencias", "Títulos", "Inscripción", "Otros"];

  const searchPlaceholder = isNoticia
    ? "Buscar noticias..."
    : "Buscar trámites...";

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

  //cargar el index.json de metadatos al montar el componente
  useEffect(() => {
    const tipo = isNoticia ? "noticias" : "tramites";
    fetch(`/content/${tipo}/index.json`)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch(() => setArticles([]));
  }, [isNoticia]);

  //instancia de fuse.js para busqueda difusa.
  const fuse = useMemo(() => {
    if (articles.length === 0) return null;
    return new Fuse(articles, {
      keys: ["titulo", "resumen", "subcategoria"],
      threshold: 0.3,
    });
  }, [articles]);

  //si hay una busqueda activa,filtrar en cliente; si no, usar los articulos del servidor
  const filteredArticles = useMemo(() => {
    if (searchTerm.trim() !== "" && fuse) {
      return fuse.search(searchTerm).map((r) => r.item);
    }
    return undefined;
  }, [searchTerm, fuse]);

  //transformar los articulos para el grid
  const transformedArticles = useMemo((): Article[] | undefined => {
    if (loadingPage) return [];
    const source =
      filteredArticles !== undefined ? filteredArticles.slice(0, 4) : articles;
    return source.map((item: Article) => ({
      id: item.slug,
      slug: item.slug,
      titulo: item.titulo,
      resumen: item.resumen,
      description: item.resumen,
      fecha: item.fecha,
      imagen: item.imagen,
      categoria: item.categoria || item.subcategoria,
      esImportante: item.esImportante,
      subcategoria: item.subcategoria,
    }));
  }, [articles, loadingPage, filteredArticles]);

  return (
    <main className="bg-gray-50 border-t border-gray-100 z-10 relative py-8">
      {/* Buscador y selector de categorías */}
      {categories.length > 1 && (
        <section className="w-full ">
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
                    categories={categories}
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
    </main>
  );
}
