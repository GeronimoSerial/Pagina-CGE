"use client";
import React, { useState } from "react";
import {
  Clock,
  ArrowRight,
  HelpCircle,
  Filter,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ArticlesGrid from "../article/components/ArticlesGrid";
import HeroSubSection from "./Hero";
import {
  filtrarArticulos,
  sortByDate,
  sortByAlphabetical,
} from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";

interface FAQ {
  question: string;
  answer: string;
}

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

  //prop para el sorted
  tramite?: boolean;
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
  tramite,
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
  const sortedArticles = tramite
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
      <HeroSubSection title={heroTitle} description={heroDescription} />
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
            <div className="max-w-3xl mx-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-[#3D8B37] transition-colors" />
                  <input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="pl-12 w-full border border-gray-200 rounded-xl py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:border-transparent transition-all text-base placeholder:text-gray-400 hover:border-[#3D8B37]/30"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPagina(1);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="text-[#3D8B37] h-5 w-5" />
                    <span className="text-base font-medium text-gray-700">
                      Filtrar por categoría:
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-gray-200 hover:border-[#3D8B37]/30 hover:bg-white/50"
                      >
                        {categoriaSeleccionada || "Todas las categorías"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={() => {
                          setCategoriaSeleccionada("");
                          setPagina(1);
                        }}
                      >
                        <span>Todas</span>
                        {!categoriaSeleccionada && (
                          <Check className="h-4 w-4 text-[#3D8B37]" />
                        )}
                      </DropdownMenuItem>
                      {categorias.map((cat) => (
                        <DropdownMenuItem
                          key={cat}
                          className="flex items-center justify-between"
                          onClick={() => {
                            setCategoriaSeleccionada(cat);
                            setPagina(1);
                          }}
                        >
                          <span>{cat}</span>
                          {categoriaSeleccionada === cat && (
                            <Check className="h-4 w-4 text-[#3D8B37]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Sección principal de contenido */}
      <section>
        <div className="container h-[500px] mx-auto px-4 md:px-6">
          <div className="py-8">
            <ArticlesGrid
              articles={articlesPagina}
              buttonText={buttonText}
              emptyStateTitle={emptyStateTitle}
              emptyStateDescription={emptyStateDescription}
              emptyStateButtonText={emptyStateButtonText}
              showUrgentBadge={true}
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
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-[#2D6A27] to-[#3D8B37]">
              {faqTitle}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {faqDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#3D8B37]/20 group"
              >
                <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-start group-hover:text-[#3D8B37] transition-colors">
                  <HelpCircle className="h-6 w-6 mr-3 text-[#3D8B37] flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h4>
                <p className="text-gray-600 ml-9">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-[#3D8B37]/20"
            >
              Ver más preguntas frecuentes
              <ArrowRight className="h-5 w-5 ml-2 text-[#3D8B37]" />
            </a>
          </div>

          <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-100 hover:border-[#3D8B37]/20 transition-all duration-300">
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
                href="/contacto"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                {contactButtonText}
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
