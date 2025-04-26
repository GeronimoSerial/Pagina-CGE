'use client'
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
import { ArrowRightIcon } from "lucide-react";
import Link from 'next/link'
import { ArticlesGridProp } from "../../../lib/utils";
import { usePathname } from "next/navigation";

const ArticlesGrid = ({
  articles = [],
}: ArticlesGridProp) => {
  // Obtener categorías únicas
  const categorias = Array.from(new Set(articles.map((item: any) => item.categoria).filter(Boolean)));
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const noticiasFiltradas = categoriaSeleccionada
    ? articles.filter((item: any) => item.categoria === categoriaSeleccionada)
    : articles;

  // Paginación
  const PAGE_SIZE = 8;
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.ceil(noticiasFiltradas.length / PAGE_SIZE);
  const noticiasPagina = noticiasFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  const pathname = usePathname();
  console.log(pathname)
  
  
  // Cuando se cambia de categoría, reseteo la página
  React.useEffect(() => {
    setPagina(1);
  }, [categoriaSeleccionada]);
  
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        {/* Card visual para la grilla y el filtro */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Filtro de categorías */}
          {categorias.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${!categoriaSeleccionada ? 'bg-[#3D8B37] text-white border-[#3D8B37]' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]'}`}
                onClick={() => setCategoriaSeleccionada(null)}
                >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                key={cat}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${categoriaSeleccionada === cat ? 'bg-[#3D8B37] text-white border-[#3D8B37]' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]'}`}
                onClick={() => setCategoriaSeleccionada(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {noticiasPagina.map((item) => (
              <Card
              key={item.id}
                className="h-[420px] flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[#3D8B37] bg-[#3D8B37]/10 px-2 py-1 rounded-full">
                      {item.categoria}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-gray-600 line-clamp-3 h-[60px]">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1"
                    asChild
                  >
                  <Link href={pathname === "/" ? `/noticia/${item.id}` : `/tramites/${item.id}`}>
                    Leer más <ArrowRightIcon size={16} />
                  </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Botón Ver más o paginación */}
          <div className="mt-10 text-center flex flex-col items-center gap-4">
            {/* Mostrar paginado solo si hay más de una página */}
            {totalPaginas > 1 && (
              <div className="flex gap-2 justify-center mt-4">
                {Array.from({ length: totalPaginas }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-8 h-8 rounded-full border text-sm font-semibold flex items-center justify-center transition-colors ${pagina === idx + 1 ? 'bg-[#3D8B37] text-white border-[#3D8B37]' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#3D8B37]/10 hover:text-[#3D8B37]'}`}
                    onClick={() => setPagina(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesGrid;
