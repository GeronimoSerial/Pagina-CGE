"use client";
import React, { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  FileSearch,
} from "lucide-react";
import ArticlesGrid from "./ArticlesGrid";
import HeroSection from "../../layout/Hero";
import {
  filtrarArticulos,
  sortByDate,
  sortByAlphabetical,
} from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import SearchInput from "../../layout/SearchInput";
import FAQSection from "../../layout/FAQSection";
import { FAQ } from "../../faqs/faqs";

interface InfoBarItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface PageWithFAQProps {
  // Props para la sección Hero
  heroTitle: string;
  heroDescription: string;

  // Props para la barra de información
  infoBarItems: InfoBarItem[];

  // Props para el grid de artículos
  articles: any[];
  categories?: string[];
  searchPlaceholder: string;
  buttonText: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateButtonText: string;
  basePath: string;

  // Props para la sección FAQ
  faqTitle: string;
  faqDescription: string;
  faqs: FAQ[];

  // Props para la sección de contacto
  contactTitle: string;
  contactSchedule: string;
  contactButtonText: string;
  contactUrl?: string;

  //prop para el sorted
  isNoticia?: boolean;
}

export default function PageWithFAQ({
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
}: PageWithFAQProps) {
  // Estado de paginación
  const PAGE_SIZE = 4;
  const [pagina, setPagina] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Nueva función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPaginas) {
      setPagina(page);
    }
  };

  // Determinar categorías únicas si no se pasan por props
  const categorias =
    categories ||
    Array.from(
      new Set(articles.map((item: any) => item.categoria).filter(Boolean))
    );

  // Filtrar artículos por búsqueda y categoría antes de la paginación
  const articulosFiltrados = filtrarArticulos(
    articles,
    searchTerm,
    categoriaSeleccionada
  );

  // Ordenar artículos filtrados
  // Si el tipo es "tramites", ordenar alfabéticamente, de lo contrario, por fecha
  const sortedArticles = !isNoticia
    ? sortByAlphabetical(articulosFiltrados)
    : sortByDate(articulosFiltrados, false);

  // Calcular total de páginas basado en los artículos filtrados
  const totalPaginas = Math.ceil(sortedArticles.length / PAGE_SIZE);

  // Aplicar paginación después de filtrar y ordenar
  const articlesPagina = sortedArticles.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection title={heroTitle} description={heroDescription} />
      {/* Sección de información importante */}
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
      {/* Barra de búsqueda y filtros */}
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
                      setPagina(1);
                    }}
                    placeholder={searchPlaceholder}
                    categories={categorias}
                    selectedCategory={categoriaSeleccionada}
                    onCategoryChange={(cat) => {
                      setCategoriaSeleccionada(cat);
                      setPagina(1);
                    }}
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
      {/* Sección principal de contenido */}
      <section>
        <div className="container mx-auto px-4 md:px-6">
          <div className="py-8">
            <ArticlesGrid
              articles={articlesPagina}
              buttonText={buttonText}
              emptyStateTitle={emptyStateTitle}
              emptyStateDescription={emptyStateDescription}
              emptyStateButtonText={emptyStateButtonText}
              showImportantBadge={true}
              basePath={basePath}
            />
            {/* Controles de paginación */}
          </div>
        </div>
        {totalPaginas > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagina - 1)}
              disabled={pagina === 1}
              className="w-9 h-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={pagina === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 p-0 ${
                    pagina === page ? "bg-[#3D8B37] hover:bg-[#2D6A27]" : ""
                  }`}
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="w-9 h-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

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
