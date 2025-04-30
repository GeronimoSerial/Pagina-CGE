"use client";
import React, { useState } from "react";
import {
  Search,
  FileText,
  Filter,
  Download,
  BookOpen,
  FileCheck,
  ClipboardList,
  Scale,
  ChevronLeft,
  ChevronRight,
  File,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { documents } from "../data";

const DocumentationSection = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  // Filter documents based on search query and active filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || doc.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  // Reset to first page when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the section smoothly
    // document.getElementById("documentacion")?.scrollIntoView({ behavior: "smooth" });
  };

  // Get icon based on document category
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
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar documentos, formularios, normativas..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" />
              <span className="text-sm font-medium">Filtrar por:</span>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full md:w-auto flex flex-wrap justify-start">
              <TabsTrigger
                value="all"
                onClick={() => setActiveFilter("all")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger
                value="licencias"
                onClick={() => setActiveFilter("licencias")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Licencias
              </TabsTrigger>
              <TabsTrigger
                value="expedientes"
                onClick={() => setActiveFilter("expedientes")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Expedientes
              </TabsTrigger>
              <TabsTrigger
                value="formularios"
                onClick={() => setActiveFilter("formularios")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Formularios
              </TabsTrigger>
              <TabsTrigger
                value="normativas"
                onClick={() => setActiveFilter("normativas")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Normativas
              </TabsTrigger>
              <TabsTrigger
                value="guias"
                onClick={() => setActiveFilter("guias")}
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Guías Prácticas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Contenedor con altura fija para las tarjetas */}
              <div className="relative h-[750px] overflow-y-auto rounded-lg border border-gray-100  shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {currentDocuments.length > 0 ? (
                    currentDocuments.map((doc) => (
                      <Card
                        key={doc.id}
                        className="flex flex-col h-full border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(doc.category)}
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {doc.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {doc.date}
                            </span>
                          </div>
                          <CardTitle className="text-lg mt-2">
                            {doc.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <CardDescription className="text-gray-600">
                            {doc.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
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
                    <div className="col-span-full flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">
                          No se encontraron documentos
                        </h3>
                        <p className="text-gray-500 mt-1">
                          Intenta con otra búsqueda o selecciona otra categoría
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {filteredDocuments.length > documentsPerPage && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 p-0 ${
                          currentPage === page
                            ? "bg-[#3D8B37] hover:bg-[#2D6A27]"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Other tabs content */}
            {[
              "licencias",
              "expedientes",
              "formularios",
              "normativas",
              "guias",
            ].map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                {/* Contenedor con altura fija para las tarjetas */}
                <div className="relative h-[800px] overflow-y-auto rounded-lg border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {currentDocuments.length > 0 ? (
                      currentDocuments.map((doc) => (
                        <Card
                          key={doc.id}
                          className="flex flex-col h-full border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(doc.category)}
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {doc.type}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">
                                {doc.date}
                              </span>
                            </div>
                            <CardTitle className="text-lg mt-2">
                              {doc.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <CardDescription className="text-gray-600">
                              {doc.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full flex items-center gap-2"
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
                      <div className="col-span-full flex items-center justify-center h-[500px]">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium text-gray-700">
                            No se encontraron documentos
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Intenta con otra búsqueda o selecciona otra
                            categoría
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pagination Controls */}
                {filteredDocuments.length > documentsPerPage && (
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-9 h-9 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 p-0 ${
                            currentPage === page
                              ? "bg-[#3D8B37] hover:bg-[#2D6A27]"
                              : ""
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">
              Próximamente más documentos y recursos estarán disponibles
            </p>
            <Button
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              Solicitar documentación específica
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
