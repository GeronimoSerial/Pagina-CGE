import React from 'react';
import { formatDate } from '@/shared/lib/date-utils';
import { ArrowRight, User, CalendarDays } from 'lucide-react';
import { getCover } from '@/features/noticias/services/news';
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
import { RegularNewsCard } from './RegularNewsCard';
import { NewsItem } from '@/shared/interfaces';
import Image from 'next/image';
import Link from 'next/link';

interface NewsGridProps {
  featuredNews: NewsItem[];
  regularNews: NewsItem[];
}

export default function NewsGrid({ featuredNews, regularNews }: NewsGridProps) {
  return (
    <>
      <section className="mb-3">
        {featuredNews.length > 0 && (
          <>
            <Separador titulo="Destacadas" />
            <Carousel className="mx-auto w-full overflow-x-hidden max-w-7xl">
              <CarouselContent className="-ml-6 ">
                {featuredNews.slice(0, 3).map((noticia) => (
                  <CarouselItem key={noticia.id} className="pl-6 basis-full">
                    <Card className="overflow-hidden border-0 shadow-2xl">
                      <div className="grid gap-0 lg:grid-cols-2">
                        <div className="aspect-4/3 lg:aspect-auto overflow-hidden">
                          <Image
                            src={getCover({ noticia }) || ''}
                            alt={noticia.titulo}
                            className="object-cover w-full h-full transition-transform duration-500 "
                            width={1200}
                            height={630}
                            priority
                          />
                        </div>
                        <CardContent className="flex flex-col justify-center p-8 bg-white lg:p-12">
                          <div className="mb-4">
                            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white bg-green-800 rounded-full">
                              {noticia.categoria}
                            </span>
                            <CalendarDays className="inline-block mr-1 ml-3 w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {formatDate(noticia.fecha)}
                            </span>
                          </div>
                          <Link href={`/noticias/${noticia.slug}`}>
                            <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-gray-900 transition-colors cursor-pointer lg:text-3xl hover:text-green-900">
                              {noticia.titulo}
                            </h3>
                          </Link>
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

                            <Link
                              href={`/noticias/${noticia.slug}`}
                              className="inline-flex gap-2 items-center hover:underline"
                            >
                              Leer más
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
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
          {regularNews.slice(0, 3).map((noticia) => (
            <RegularNewsCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </section>
    </>
  );
}
