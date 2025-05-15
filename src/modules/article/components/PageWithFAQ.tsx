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

  // Props para la paginación del servidor
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);

  // Optimización: Memoizar la transformación de artículos
  const transformedArticles = useMemo(() => {
    // Si está cargando una nueva página, devolver undefined para mostrar el skeleton
    if (loadingPage) return undefined;

    return articles.map((item) => ({
      id: item.slug,
      slug: item.slug,
      titulo: item.titulo,
      description: item.description,
      date: item.fecha,
      imagen: item.imagen,
      categoria: item.categoria,
      esImportante: item.esImportante,
    }));
  }, [articles, loadingPage]);

  const handlePageChange = (page: number) => {
    if (pagination) {
      setLoadingPage(true);
      const params = new URLSearchParams(window.location.search);
      params.set("page", page.toString());
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    }
  };

  // Efecto para quitar el loading cuando los artículos cambian
  useEffect(() => {
    setLoadingPage(false);
  }, [articles]);

  // Determinar categorías únicas si no se pasan por props
  const categorias =
    categories ||
    Array.from(
      new Set(articles.map((item: any) => item.categoria).filter(Boolean))
    );

  // La paginación, filtrado y ordenamiento ahora se hace en el servidor
  const totalPaginas = pagination
    ? pagination.totalPages
    : Math.ceil(articles.length / 4);
  const currentPage = pagination ? pagination.currentPage : 1;

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
                      if (pagination) {
                        setLoadingPage(true);
                        const params = new URLSearchParams(
                          window.location.search
                        );
                        params.delete("page");
                        if (e.target.value) {
                          params.set("search", e.target.value);
                        } else {
                          params.delete("search");
                        }
                        router.push(`${basePath}?${params.toString()}`, {
                          scroll: false,
                        });
                      }
                    }}
                    placeholder={searchPlaceholder}
                    categories={categorias}
                    selectedCategory={categoriaSeleccionada}
                    onCategoryChange={(cat) => {
                      setCategoriaSeleccionada(cat);
                      if (pagination) {
                        setLoadingPage(true);
                        const params = new URLSearchParams(
                          window.location.search
                        );
                        params.delete("page");
                        if (cat) {
                          params.set("categoria", cat);
                        } else {
                          params.delete("categoria");
                        }
                        router.push(`${basePath}?${params.toString()}`, {
                          scroll: false,
                        });
                      }
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

      {/* Contenedor del grid y paginación */}
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
