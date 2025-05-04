"use client";
import React from "react";
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
import { FileText, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
interface ArticlesGridProps {
  articles?: any;
  buttonText?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateButtonText?: string;
  showImportantBadge?: boolean;
  basePath?: string;
}

const ArticlesGrid = ({
  articles = [],
  buttonText = "Leer más",
  emptyStateTitle = "No se encontraron artículos",
  emptyStateDescription = "No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría.",
  emptyStateButtonText = "Mostrar todos los artículos",
  showImportantBadge = false,
  basePath,
}: ArticlesGridProps) => {
  const pathname = usePathname();
  const noticiasPagina = articles;

  const getItemLink = (id: string) => {
    if (basePath) {
      return `${basePath}/${id}`;
    }
    return pathname === "/" ? `/noticias/${id}` : `/tramites/${id}`;
  };

  return (
    <section className="w-full">
      <div className="container mx-auto">
        {/* Grid de artículos */}
        {noticiasPagina.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {noticiasPagina.map((item: any) => (
              <Card
                key={item.id}
                className="h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                  {showImportantBadge && item.esImportante && (
                    <Badge className="underline absolute top-3 right-3 bg-gray-600 text-white border-0">
                      Importante
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
                  <CardTitle
                    title={item.title}
                    className="text-lg font-bold line-clamp-2 text-gray-800"
                  >
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription
                    className="text-gray-600 line-clamp-3"
                    title={`${item.description}`}
                  >
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

export default ArticlesGrid;
