import React from 'react';
import { Calendar, ArrowRight, User, Badge, Clock, Quote } from 'lucide-react';
import { getPortada } from '@/features/noticias/services/noticias';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/shared/ui/carousel';
import { Separator } from '@radix-ui/react-separator';
interface NewsItem {
  id: string | number;
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  autor?: string;
  categoria: string;
  portada?: any;
  destacado?: boolean;
}

interface NewsGridProps {
  noticiasDestacadas: NewsItem[];
  noticiasRegulares: NewsItem[];
}

export default function NewsGrid({
  noticiasDestacadas,
  noticiasRegulares,
}: NewsGridProps) {
  return (
    <>
      <section className="mt-16 mb-16">
        {/* Carrusel de ultimas 3 noticias */}
        <Carousel className="mx-auto w-full max-w-7xl">
          <CarouselContent className="-ml-6">
            {noticiasDestacadas.slice(0, 3).map((noticia) => (
              <CarouselItem key={noticia.id} className="pl-6 basis-full">
                <Card className="overflow-hidden border-0 shadow-2xl">
                  <div className="grid gap-0 lg:grid-cols-2">
                    <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <img
                        src={getPortada({ noticia }) || undefined}
                        alt={noticia.titulo}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex flex-col justify-center p-8 bg-white lg:p-12">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white bg-green-800 rounded-full">
                          {noticia.categoria}
                        </span>
                        <Clock className="inline-block mr-1 ml-3 w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {noticia.fecha}
                        </span>
                      </div>
                      <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-gray-900 transition-colors cursor-pointer lg:text-3xl hover:text-purple-700">
                        {noticia.titulo}
                      </h3>
                      <p className="mb-6 text-lg font-light leading-relaxed text-gray-700">
                        {noticia.resumen}
                      </p>
                      <Separator className="mb-6 bg-purple-100" />
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-green-100 rounded-full">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">
                              {noticia.autor ?? 'Redacción CGE'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`/noticias/${noticia.slug}`}
                          className="inline-flex gap-2 items-center font-medium transition-all duration-300 ease-out group/link text-slate-700 hover:text-slate-900"
                        >
                          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                            Leer más
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </a>
                        {/* <span className="font-medium">{formatDate(noticia.fecha)}</span> */}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="left-4 text-purple-600 border-purple-200 bg-white/90 hover:bg-white hover:text-purple-700" /> */}
          {/* <CarouselNext className="right-4 text-purple-600 border-purple-200 bg-white/90 hover:bg-white hover:text-purple-700" /> */}
        </Carousel>
      </section>
    </>
  );
}
