"use client";
import React, { Suspense } from "react";
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
import { FileText, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import SkeletonCard from "./SkeletonCard";
import { formatearFecha } from "@lib/utils";

interface ArticlesGridProps {
  articles:
    | Array<{
        id: string;
        slug: string;
        titulo: string;
        description: string;
        date?: string;
        imagen?: string;
        categoria?: string;
        esImportante?: boolean;
      }>
    | undefined;
  buttonText?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateButtonText?: string;
  showImportantBadge?: boolean;
  basePath?: string;
}

const ArticlesGridContent = ({
  articles,
  buttonText = "Leer más",
  emptyStateTitle = "No se encontraron artículos",
  emptyStateDescription = "No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría.",
  emptyStateButtonText = "Mostrar todos los artículos",
  showImportantBadge = false,
  basePath,
}: ArticlesGridProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getItemLink = (id: string) => {
    if (basePath) {
      return `${basePath}/${id}`;
    }
    return pathname === "/" ? `/noticias/${id}` : `/tramites/${id}`;
  };

  return (
    <section className="w-full">
      <div className="container mx-auto">
        {articles === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((item) => (
              <Card
                key={item.id}
                className="h-[28rem] flex flex-col overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:transition-all md:duration-300"
              >
                <Link
                  href={getItemLink(item.id)}
                  title="Ver artículo completo"
                  className="flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative">
                    {item.imagen ? (
                      <Image
                        src={
                          item.imagen.startsWith("http")
                            ? item.imagen
                            : item.imagen.startsWith("/")
                            ? item.imagen
                            : `/images/${item.imagen}`
                        }
                        alt={item.titulo}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full md:transition-transform md:duration-300 md:hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {showImportantBadge && item.esImportante && (
                      <Badge className="underline absolute top-3 right-3 bg-gray-600 text-white border-0">
                        Importante
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2 flex-none">
                    <div className="flex justify-between items-center mb-2">
                      {item.categoria && (
                        <Badge
                          variant="outline"
                          className="bg-[#3D8B37]/10 text-[#3D8B37] border-0 font-medium"
                        >
                          {item.categoria}
                        </Badge>
                      )}
                      {item.date && (
                        <span className="text-xs text-gray-500 font-medium">
                          {formatearFecha(item.date)}
                        </span>
                      )}
                    </div>
                    <CardTitle
                      title={item.titulo}
                      className="text-lg font-bold line-clamp-2 text-gray-800"
                    >
                      {item.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription
                      className="text-gray-600 line-clamp-3"
                      title={item.description}
                    >
                      {item.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 flex-none">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1 hover:underline"
                      asChild
                    >
                      <p className="flex items-center gap-3">
                        {buttonText} <ArrowRightIcon size={16} />
                      </p>
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full rounded-xl shadow-sm p-10 text-center">
            <FileText className="h-12 w-12 mx-auto text-black mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {emptyStateTitle}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {emptyStateDescription}
            </p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = basePath || "/")}
              className="mt-4 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {emptyStateButtonText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// Wrapped component with Suspense
const ArticlesGrid = (props: ArticlesGridProps) => {
  return (
    <Suspense
      fallback={
        <section className="w-full">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <ArticlesGridContent {...props} />
    </Suspense>
  );
};

export default ArticlesGrid;
