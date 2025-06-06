"use client";
import React, { Suspense, useMemo } from "react";
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
import { FileText, ArrowRightIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SkeletonCard from "./SkeletonCard";
import { Article } from "@/src/interfaces";
import { formatearFecha } from "@lib/utils";
import { HeadlessPagination } from "@modules/documentation/components/HeadlessPagination";

interface ArticlesGridProps {
  articles?: Article[];
  buttonText?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateButtonText?: string;
  showImportantBadge?: boolean;
  basePath?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
  isLoading?: boolean;
  isCategoryLoading?: boolean;
}

const ArticlesGridContent = ({
  articles,
  showImportantBadge = false,
  basePath,
  pagination,
  isLoading = false,
  isCategoryLoading = false,
}: ArticlesGridProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isNoticia = basePath?.includes("noticias") || false;
  const emptyStateButtonText = isNoticia
    ? "Mostrar todas las noticias"
    : "Mostrar todos los trámites";
  const emptyStateTitle = isNoticia
    ? "No se encontraron noticias"
    : "No se encontraron trámites";
  const emptyStateDescription =
    "No se encontraron resultados para tu búsqueda. Intenta con otra palabra clave o revisa la categoría seleccionada.";
  const buttonText = isNoticia
    ? "Ver noticia completa"
    : "Ver trámite completo";

  const { totalPaginas, currentPage } = useMemo(
    () => ({
      totalPaginas: pagination
        ? pagination.totalPages
        : Math.ceil((articles?.length || 0) / 4),
      currentPage: pagination ? pagination.currentPage : 1,
    }),
    [pagination, articles?.length]
  );

  const handlePageChange = (page: number) => {
    if (pagination) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
    }
  };

  const getItemLink = (id: string) => {
    if (basePath) {
      return `${basePath}/${id}`;
    }
    return pathname === "/" ? `/noticias/${id}` : `/tramites/${id}`;
  };

  return (
    <section className="w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isCategoryLoading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin" />
            </div>
          ) : isLoading ? (
            [...Array(Math.min(articles?.length || 4, 4))].map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : articles && articles.length > 0 ? (
            articles.map((item) => (
              <Card
                key={item.id}
                className="h-[24rem] flex flex-col overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:transition-all md:duration-300"
              >
                <Link
                  href={getItemLink(item.id || "")}
                  title="Ver artículo completo"
                  className="flex flex-col h-full"
                >
                  <div className="h-40 flex-none overflow-hidden relative flex items-center justify-center">
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
                        style={{ aspectRatio: "1.6/1", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {showImportantBadge && item.esImportante && (
                      <Badge className=" absolute top-3 right-3 bg-white/90 text-black border-0">
                        IMPORTANTE
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2 flex-none h-[5.5rem]">
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
                      className="text-base font-semibold line-clamp-2 text-gray-800"
                    >
                      {item.titulo}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 min-h-0">
                    <CardDescription
                      className="text-gray-600 line-clamp-3"
                      title={item.description}
                    >
                      {item.description}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="pt-0 pb-4 flex-none h-[3rem]">
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
            ))
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
        {totalPaginas > 1 && (
          <div className="py-6 border-t border-gray-100 mt-6">
            <HeadlessPagination
              currentPage={currentPage}
              totalPages={totalPaginas}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

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
