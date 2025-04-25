'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
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

interface NewsItem {
  id?: string;
  slug?: string;
  title?: string;
  titulo?: string;
  description?: string;
  resumen?: string;
  date?: string;
  fecha?: string;
  imageUrl?: string;
  imagen?: string;
  category?: string;
}
type Props = {
  params: { id: string}
}
interface NewsGridProps {
  news?: NewsItem[];
  title?: string;
  subtitle?: string;
}

const NewsGrid = ({
  news = [],
  title = "Últimas Noticias",
  subtitle = "Mantente informado sobre las novedades del sistema educativo provincial",
}: NewsGridProps) => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <Card
              key={item.id || item.slug}
              className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.imageUrl || item.imagen}
                  alt={item.title || item.titulo}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  {item.category && (
                    <span className="text-xs font-medium text-[#3D8B37] bg-[#3D8B37]/10 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{item.date || item.fecha}</span>
                </div>
                <CardTitle className="text-lg font-bold line-clamp-2">
                  {item.title || item.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-gray-600 line-clamp-3">
                  <ReactMarkdown components={{ p: ({ children }) => <span>{children}</span> }}>
                    {item.description || item.resumen}
                  </ReactMarkdown>
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="link"
                  className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1"
                  onClick={() => (window.location.href = `/noticia/${item.id || item.slug}`)}
                >
                  Leer más <ArrowRightIcon size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-[#3D8B37] text-[#3D8B37] hover:bg-[#3D8B37]/10"
          >
            Ver todas las noticias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
