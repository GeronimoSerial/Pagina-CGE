"use client";
import React, { useState } from "react";
import {
  FileText,
  Download,
  ClipboardList,
  Scale,
  File,
  FileCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { documents } from "../data";
import { useSearchParams } from "next/navigation";
import { filterDocuments } from "@lib/utils";
import SearchInput from "@modules/layout/SearchInput";
import { HeadlessPagination } from "./HeadlessPagination";

const DocumentationSection = () => {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  // Categorías disponibles para el filtro
  const categories = ["licencias", "formularios", "normativas", "guias"];

  // Set initial filter from URL param only on mount
  React.useEffect(() => {
    if (categoriaParam && categories.includes(categoriaParam)) {
      setActiveFilter(categoriaParam);
    } else {
      setActiveFilter("all");
    }
  }, [categoriaParam]);

  // Filter documents based on search query and active filter
  const filteredDocuments = filterDocuments(
    documents,
    searchQuery,
    activeFilter
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "licencias":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "expedientes":
        return <ClipboardList className="h-5 w-5 text-blue-600" />;
      case "formularios":
        return <FileCheck className="h-5 w-5 text-purple-600" />;
      case "normativas":
        return <Scale className="h-5 w-5 text-red-600" />;
      case "guias":
        return <FileText className="h-5 w-5 text-gray-600" />;
      case "instructivos":
        return <File className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <section id="documentacion" className="w-full py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col min-h-[800px]">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6 border border-gray-100">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar"
                categories={categories}
                selectedCategory={activeFilter === "all" ? "" : activeFilter}
                onCategoryChange={(cat) =>
                  setActiveFilter(cat === "" ? "all" : cat)
                }
                allLabel="Todas las categorías"
              />
            </div>
          </div>

          <div className="relative rounded-lg border border-gray-200 shadow-md bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {currentDocuments.length > 0 ? (
                currentDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="flex flex-col h-72 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(doc.category)}
                          <Badge
                            variant="outline"
                            className="text-xs font-medium capitalize px-2 py-0.5"
                          >
                            {doc.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {doc.date}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                      <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm line-clamp-4">
                        {doc.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 hover:bg-green-50 transition-colors"
                        asChild
                      >
                        <a href={doc.downloadUrl}>
                          <Download className="h-4 w-4" />
                          Descargar
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-96">
                  <div className="text-center p-8 rounded-lg bg-gray-50">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No se encontraron documentos
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-md">
                      Intenta con otra búsqueda o selecciona otra categoría
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredDocuments.length > documentsPerPage && (
            <div className="mt-6">
              <HeadlessPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">
              Próximamente más documentos y recursos estarán disponibles
            </p>
            <a href="/contacto">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                Solicitar documentación específica
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
