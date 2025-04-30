"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Search,
  Filter,
  FileText,
  ChevronRight,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
import {
  ArticlesGridProp,
  filtrarArticulos,
  sortByDate,
} from "../../../lib/utils";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";

interface ArticlesGridProps extends ArticlesGridProp {
  searchPlaceholder?: string;
  buttonText?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateButtonText?: string;
  showUrgentBadge?: boolean;
  basePath?: string;
  categories?: string[];
  showSearch?: boolean;
  showFilters?: boolean;
}

const ArticlesGrid = ({
  articles = [],
  searchPlaceholder = "Buscar artículos...",
  buttonText = "Leer más",
  emptyStateTitle = "No se encontraron artículos",
  emptyStateDescription = "No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría.",
  emptyStateButtonText = "Mostrar todos los artículos",
  showUrgentBadge = false,
  basePath,
  categories,
  showSearch = true,
  showFilters = true,
}: ArticlesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const pathname = usePathname();

  // Ordenar artículos por fecha (más reciente primero)
  const sortedArticles = sortByDate(articles);

  // Obtener categorías únicas si no se proporcionan como prop
  const categorias =
    categories ||
    Array.from(
      new Set(sortedArticles.map((item: any) => item.categoria).filter(Boolean))
    );

  // Filtrar artículos
  const noticiasFiltradas = showSearch
    ? filtrarArticulos(sortedArticles, searchTerm, categoriaSeleccionada)
    : filtrarArticulos(sortedArticles, "", categoriaSeleccionada);

  // Paginación
  const PAGE_SIZE = 8;
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.ceil(noticiasFiltradas.length / PAGE_SIZE);
  const noticiasPagina = noticiasFiltradas.slice(
    (pagina - 1) * PAGE_SIZE,
    pagina * PAGE_SIZE
  );

  // Cuando se cambia de categoría o búsqueda, reseteo la página
  React.useEffect(() => {
    setPagina(1);
  }, [categoriaSeleccionada, searchTerm]);

  const getItemLink = (id: string) => {
    if (basePath) {
      return `${basePath}/${id}`;
    }
    return pathname === "/" ? `/noticias/${id}` : `/tramites/${id}`;
  };

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        {/* Barra de búsqueda y filtros */}
        {(showSearch || (showFilters && categorias.length > 1)) && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="space-y-4">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="pl-12 w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
              {showFilters && categorias.length > 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="text-gray-500 h-4 w-4" />
                    <span className="text-sm font-medium text-gray-600">
                      Filtrar por categoría:
                    </span>
                  </div>
                  <Tabs
                    value={categoriaSeleccionada || "all"}
                    className="w-full"
                  >
                    <TabsList className="w-full flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg h-auto">
                      <TabsTrigger
                        value="all"
                        onClick={() => setCategoriaSeleccionada("")}
                        className="data-[state=active]:bg-white data-[state=active]:text-[#3D8B37] data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm flex-shrink-0 h-auto"
                      >
                        Todas
                      </TabsTrigger>
                      {categorias.map((cat) => (
                        <TabsTrigger
                          key={cat}
                          value={cat}
                          onClick={() => setCategoriaSeleccionada(cat)}
                          className="data-[state=active]:bg-white data-[state=active]:text-[#3D8B37] data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm flex-shrink-0 h-auto whitespace-nowrap"
                        >
                          {cat}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid de artículos */}
        {noticiasPagina.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {noticiasPagina.map((item) => (
              <Card
                key={item.id}
                className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {showUrgentBadge && item.esUrgente && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
                      Urgente
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge
                      variant="outline"
                      className="bg-[#3D8B37]/10 text-[#3D8B37] border-0 font-medium"
                    >
                      {item.categoria}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-2 text-gray-800">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-gray-600 line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0 pb-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1 hover:underline"
                    asChild
                  >
                    <Link href={getItemLink(item.id)}>
                      {buttonText} <ArrowRightIcon size={16} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-10 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {emptyStateTitle}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {emptyStateDescription}
            </p>
            <Button
              variant="outline"
              className="mt-4 border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setCategoriaSeleccionada("");
              }}
            >
              {emptyStateButtonText}
            </Button>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPaginas }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-full border text-sm font-semibold flex items-center justify-center transition-colors ${
                    pagina === idx + 1
                      ? "bg-[#3D8B37] text-white border-[#3D8B37]"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]"
                  }`}
                  onClick={() => setPagina(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesGrid;
