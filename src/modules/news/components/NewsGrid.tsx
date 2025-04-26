'use client'
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
import { ArrowRightIcon } from "lucide-react";
import Link from 'next/link'
import { NewsItem } from "../types";


interface NewsGridProps
 {
  news?: NewsItem[];
  title?: string;
  subtitle?: string;
}

const NewsGrid = ({
  news = [],

}: NewsGridProps) => {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <Card
              key={item.id}
              className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                <CardDescription className="text-gray-600 line-clamp-3">
                  {item.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="link"
                  className="p-0 h-auto text-[#3D8B37] font-medium hover:text-[#2D6A27] flex items-center gap-1"
                  asChild
                >
                  <Link href={`/noticia/${item.id}`}>
                    Leer más <ArrowRightIcon size={16} />
                  </Link>
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
