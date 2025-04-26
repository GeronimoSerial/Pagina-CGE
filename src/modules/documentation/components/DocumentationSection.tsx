'use client'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  date: string;
  downloadUrl?: string;
}

const DocumentationSection = ({
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data for documents - would be replaced with Strapi data in the future
  const documents: DocumentItem[] = [
    {
      id: "1",
      title: "Licencia por Artículo 28",
      description:
        "Guía completa para solicitar licencias según el Artículo 28. Incluye requisitos y formularios.",
      category: "licencias",
      type: "guia",
      date: "15/04/2023",
      downloadUrl: "#",
    },
    {
      id: "2",
      title: "Generación de Expedientes Administrativos",
      description:
        "Procedimiento paso a paso para la generación y seguimiento de expedientes administrativos.",
      category: "expedientes",
      type: "procedimiento",
      date: "10/03/2023",
      downloadUrl: "#",
    },
    {
      id: "3",
      title: "Formulario de Licencia Médica",
      description:
        "Formulario oficial para la solicitud de licencias por razones médicas.",
      category: "formularios",
      type: "formulario",
      date: "05/02/2023",
      downloadUrl: "#",
    },
    {
      id: "4",
      title: "Resolución 1234/2023 - Calendario Escolar",
      description:
        "Normativa vigente que establece el calendario escolar para el ciclo lectivo 2023.",
      category: "normativas",
      type: "resolucion",
      date: "20/12/2022",
      downloadUrl: "#",
    },
    {
      id: "5",
      title: "Guía para Directivos Escolares",
      description:
        "Manual práctico con orientaciones para la gestión directiva de establecimientos educativos.",
      category: "guias",
      type: "manual",
      date: "18/01/2023",
      downloadUrl: "#",
    },
    {
      id: "6",
      title: "Formulario de Inscripción Docente",
      description:
        "Formulario para la inscripción en el registro de aspirantes a cargos docentes.",
      category: "formularios",
      type: "formulario",
      date: "01/03/2023",
      downloadUrl: "#",
    },
    {
      id: "7",
      title: "Protocolo de Acción para Situaciones de Emergencia",
      description:
        "Documento oficial que establece los procedimientos a seguir ante situaciones de emergencia en instituciones educativas.",
      category: "normativas",
      type: "protocolo",
      date: "25/05/2023",
      downloadUrl: "#",
    },
  ];

  // Filter documents based on search query and active filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || doc.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
        return <BookOpen className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <section id="documentacion" className="w-full py-12">
      <div className="container mx-auto px-4">
        {/* <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#205C3B] mb-3">{title}</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {description}
          </p>
        </div> */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="h-full border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
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
                    <CardContent>
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
                <div className="col-span-full text-center py-10">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">
                    No se encontraron documentos
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Intenta con otra búsqueda o selecciona otra categoría
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* The same content is shown for all tabs, filtered by the activeFilter state */}
          {[
            "licencias",
            "expedientes",
            "formularios",
            "normativas",
            "guias",
          ].map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className="h-full border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
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
                      <CardContent>
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
                  <div className="col-span-full text-center py-10">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No se encontraron documentos
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Intenta con otra búsqueda o selecciona otra categoría
                    </p>
                  </div>
                )}
              </div>
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
    </section>
  );
};

export default DocumentationSection;
