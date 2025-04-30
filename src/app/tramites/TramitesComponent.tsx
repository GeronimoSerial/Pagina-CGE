"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Search, Filter, FileText, ChevronRight } from "lucide-react";
import { filtrarArticulos } from "../../lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { truncateText } from "../../lib/utils";

interface TramitesGridClientProps {
  tramite: any[];
  categorias: string[];
}

export default function TramitesGridClient({
  tramite,
  categorias,
}: TramitesGridClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const tramiteFiltrado = filtrarArticulos(
    tramite,
    searchTerm,
    categoriaSeleccionada
  );

  return (
    <section className="w-full">
      <div className="container mx-auto">
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="search"
                placeholder="Buscar trámites..."
                className="pl-12 w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="text-gray-500 h-4 w-4" />
                <span className="text-sm font-medium text-gray-600">
                  Filtrar por categoría:
                </span>
              </div>
              <Tabs value={categoriaSeleccionada || "all"} className="w-full">
                <TabsList className="w-full flex flex-wrap gap-2 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger
                    value="all"
                    onClick={() => setCategoriaSeleccionada("")}
                    className="data-[state=active]:bg-white data-[state=active]:text-[#3D8B37] data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                  >
                    Todas
                  </TabsTrigger>
                  {categorias.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className="data-[state=active]:bg-white data-[state=active]:text-[#3D8B37] data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Grid de trámites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tramiteFiltrado.length > 0 ? (
            tramiteFiltrado.map((item) => (
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
                  {item.esUrgente && (
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
                  <CardDescription
                    className="text-gray-600 cursor-help"
                    title={item.description}
                  >
                    {truncateText(item.description, 15)}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0 pb-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1 hover:underline"
                    asChild
                  >
                    <Link href={`/tramites/${item.id}`}>
                      Ver trámite
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-10 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No se encontraron trámites
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No hay resultados para tu búsqueda. Intenta con otros términos o
                selecciona otra categoría.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setSearchTerm("");
                  setCategoriaSeleccionada("");
                }}
              >
                Mostrar todos los trámites
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
