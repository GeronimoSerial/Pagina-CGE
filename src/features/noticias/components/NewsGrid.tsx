import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, User, CalendarDays, Tag } from 'lucide-react';
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
import { Separador } from '@/shared/components/Separador';
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
      <section className="mb-3">
        {noticiasDestacadas.length > 0 && (
          <>
            <Separador titulo="Destacadas" />
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
                            <CalendarDays className="inline-block mr-1 ml-3 w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {format(
                                new Date(noticia.fecha),
                                'EEE, d MMMM yyyy',
                                {
                                  locale: es,
                                },
                              )}
                            </span>
                          </div>
                          <a href={`/noticias/${noticia.slug}`}>
                            <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-gray-900 transition-colors cursor-pointer lg:text-3xl hover:text-green-900">
                              {noticia.titulo}
                            </h3>
                          </a>
                          <p className="mb-6 text-lg font-light leading-relaxed text-gray-700">
                            {noticia.resumen}
                          </p>
                          <Separator className="mb-6 bg-green-100" />
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <div className="flex items-center">
                              <div className="flex justify-center items-center mr-3 w-8 h-8 bg-green-800 rounded-full">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-500">
                                  {noticia.autor ?? 'Redacción CGE'}
                                </p>
                              </div>
                            </div>
                            <a
                              href={`/noticias/${noticia.slug}`}
                              className="inline-flex gap-2 items-center hover:underline"
                            >
                              Leer más
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-white bg-green-800/50" />
              <CarouselNext className="text-white bg-green-800/50" />
            </Carousel>
          </>
        )}
      </section>
      {/* Noticias regulares */}
      <section className="mb-6">
        <Separador titulo="Más noticias" />

        <div className="grid gap-8 mx-auto max-w-6xl md:grid-cols-3">
          {noticiasRegulares.slice(0, 3).map((noticia) => (
            <Card
              key={noticia.id}
              className="overflow-hidden bg-white rounded-xl border-none shadow-none transition-all duration-300 group hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="overflow-hidden relative rounded-t-xl">
                  <img
                    className="object-cover w-full h-48 transition-transform duration-300 sm:h-56 group-hover:scale-105"
                    alt={noticia.titulo}
                    src={getPortada({ noticia }) || undefined}
                  />
                  <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/10" />
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-center mb-4 text-sm text-gray-500">
                    <div className="flex gap-1 items-center">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-xs tracking-wide">
                        {' '}
                        {format(new Date(noticia.fecha), 'EEE, d MMMM yyyy', {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Tag className="w-4 h-4" />
                      <span className="tracking-wide">
                        {noticia.categoria ?? 'Redacción CGE'}
                      </span>
                    </div>
                  </div>
                  <a href={`/noticias/${noticia.slug}`}>
                    <h4 className="mb-3 text-lg font-semibold leading-7 text-gray-900 transition-colors duration-200 hover:text-green-900">
                      {noticia.titulo}
                    </h4>
                  </a>
                  <p
                    className="mb-4 text-sm leading-relaxed text-gray-600"
                    title={noticia.resumen}
                  >
                    {noticia.resumen}
                  </p>
                  <div className="flex items-center text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-green-900">
                    <a
                      href={`/noticias/${noticia.slug}`}
                      className="inline-flex gap-2 items-center hover:underline"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
