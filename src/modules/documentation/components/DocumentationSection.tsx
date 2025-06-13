//Contenedor para la sección de documentación y buscador
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

  const categories = ["licencias", "formularios", "normativas", "guias"];

  React.useEffect(() => {
    if (categoriaParam && categories.includes(categoriaParam)) {
      setActiveFilter(categoriaParam);
    } else {
      setActiveFilter("all");
    }
  }, [categoriaParam]);

  const filteredDocuments = filterDocuments(
    documents,
    searchQuery,
    activeFilter
  );

  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <section id="documentacion" className="w-full py-8">
      <div className="container mx-auto px-2">
        <div className="flex flex-col min-h-[500px]">
          {/* Últimos documentos añadidos */}
          <div className="mb-6">
            <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-gray-100 rounded-lg">
                  <FileText className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <h2 className="text-base font-semibold text-gray-800">
                  Últimos documentos añadidos
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {documents
                  .slice(-4)
                  .reverse()
                  .map((doc) => (
                    <Card
                      key={doc.id}
                      className="flex flex-col h-full border border-gray-200 hover:border-green-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-md overflow-hidden bg-white shadow-sm"
                    >
                      <CardHeader className="pb-0 pt-1.5 px-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(doc.category)}
                            <Badge
                              variant="outline"
                              className="text-xs font-medium capitalize px-1 py-0"
                            >
                              {doc.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {doc.date}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-hidden px-2 py-1.5">
                        <CardTitle title={doc.title} className="text-xs font-semibold mb-0.5 line-clamp-2">
                          {doc.title}
                        </CardTitle>
                        <CardDescription title={doc.description} className="text-gray-600 text-xs line-clamp-1">
                          {doc.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="pt-0 pb-1.5 px-2">
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-1 hover:bg-green-800 hover:text-white transition-colors text-xs py-0.5 px-1.5"
                          asChild
                        >
                          <a href={doc.downloadUrl}>
                            <Download className="h-3 w-3" />
                            Descargar
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm p-6 border border-gray-100">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos..."
                categories={categories}
                selectedCategory={activeFilter === "all" ? "" : activeFilter}
                onCategoryChange={(cat) =>
                  setActiveFilter(cat === "" ? "all" : cat)
                }
                allLabel="Todas las categorías"
              />
            </div>
          </div>

          <div className="relative rounded-md border border-gray-200 shadow bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
              {currentDocuments.length > 0 ? (
                currentDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="flex flex-col h-56 border border-gray-200 hover:border-green-300 hover:shadow transition-all duration-300 rounded-md"
                  >
                    <CardHeader className="pb-1 pt-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(doc.category)}
                          <Badge
                            variant="outline"
                            className="text-sm font-medium capitalize px-2 py-0.5"
                          >
                            {doc.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {doc.date}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                      <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm line-clamp-3">
                        {doc.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-1 pb-2">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-1 hover:bg-green-800 hover:text-white transition-colors text-sm py-1 px-2"
                        asChild
                      >
                        <a href={doc.downloadUrl}>
                          <Download className="h-3 w-3" />
                          Descargar
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-60">
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-base font-medium text-gray-700">
                      No se encontraron documentos
                    </h3>
                    <p className="text-gray-500 mt-1 max-w-xs text-sm">
                      Intenta con otra búsqueda o selecciona otra categoría
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredDocuments.length > documentsPerPage && (
            <div className="mt-3">
              <HeadlessPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-500 mb-2 text-sm">
              Próximamente más documentos y recursos estarán disponibles
            </p>
            <a href="/contacto">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 text-sm py-1 px-3"
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
