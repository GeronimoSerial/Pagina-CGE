'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/shared/interfaces';
import { cn } from '@/shared/lib/utils';
import { formatDate } from '@/shared/lib/date-utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/shared/ui/carousel';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { getCover } from '@/features/noticias/services/news';
import { CalendarDays, User, ArrowRight } from 'lucide-react';

interface NewsCarouselProps {
  featuredNews: NewsItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function NewsCarousel({
  featuredNews,
  className,
}: NewsCarouselProps) {
  const limitedNews = featuredNews.slice(0, 3);

  if (!limitedNews || limitedNews.length === 0) {
    return null;
  }

  return (
    <section className={cn('relative mb-12', className)}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Noticias Destacadas
        </h2>
        <div className="mt-2 flex justify-center">
          <div className="w-24 h-1 bg-[#3D8B37]"></div>
        </div>
      </div>
      <Carousel className="mx-auto w-full overflow-x-hidden max-w-7xl">
        <CarouselContent className="-ml-4 md:-ml-6">
          {limitedNews.map((noticia) => (
            <CarouselItem key={noticia.id} className="pl-4 md:pl-6 basis-full">
              <Card className="overflow-hidden border-0 h-full">
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0 h-full">
                  <div className="relative w-full">
                    <Link
                      href={`/noticias/${noticia.slug}`}
                      prefetch={false}
                      aria-label={noticia.titulo}
                    >
                      <div className="aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
                        <Image
                          src={getCover({ noticia }) || ''}
                          alt={noticia.titulo}
                          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          width={1200}
                          height={630}
                          priority
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                          unoptimized
                        />
                      </div>
                    </Link>
                  </div>

                  <CardContent className="flex flex-col justify-between p-6 sm:p-8 lg:p-12 bg-white min-h-[300px] lg:min-h-[400px]">
                    <div className="flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white bg-green-800 rounded-full">
                          {noticia.categoria}
                        </span>
                        <div className="flex items-center text-gray-500">
                          <CalendarDays className="mr-1 w-4 h-4" />
                          <span className="text-xs">
                            {formatDate(noticia.fecha)}
                          </span>
                        </div>
                      </div>

                      <Link href={`/noticias/${noticia.slug}`}>
                        <h3 className="mb-4 font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-gray-900 transition-colors cursor-pointer hover:text-green-900 line-clamp-3">
                          {noticia.titulo}
                        </h3>
                      </Link>

                      <p className="mb-6 text-base sm:text-lg font-light leading-relaxed text-gray-700 line-clamp-3 lg:line-clamp-4">
                        {noticia.resumen}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <Separator className="mb-4 bg-green-100" />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="flex justify-center items-center mr-3 w-8 h-8 bg-green-800 rounded-full flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-500 truncate">
                              {noticia.autor ?? 'Redacción CGE'}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/noticias/${noticia.slug}`}
                          prefetch={false}
                          className="inline-flex gap-2 items-center text-green-800 hover:text-green-900 hover:underline font-medium transition-colors group flex-shrink-0"
                        >
                          Leer más
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 text-white bg-green-800/80 hover:bg-green-800 border-green-800/80 hover:border-green-800 hidden sm:flex" />
        <CarouselNext className="right-2 text-white bg-green-800/80 hover:bg-green-800 border-green-800/80 hover:border-green-800 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
