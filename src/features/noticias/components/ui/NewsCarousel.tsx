'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/shared/interfaces';
import { cn, formatDate } from '@/shared/lib/utils';
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
  // Limitar a 3 noticias destacadas
  const limitedNews = featuredNews.slice(0, 3);

  // Si no hay noticias destacadas, no mostrar el carrusel
  if (!limitedNews || limitedNews.length === 0) {
    return null;
  }

  return (
    <section className={cn('relative mb-12', className)}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Destacadas
        </h2>
        <div className="mt-2 flex justify-center">
          <div className="w-24 h-1 bg-[#3D8B37]"></div>
        </div>
      </div>
      <Carousel className="mx-auto w-full overflow-x-hidden max-w-7xl">
        <CarouselContent className="-ml-6 ">
          {limitedNews.map((noticia) => (
            <CarouselItem key={noticia.id} className="pl-6 basis-full">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="aspect-[4/3] lg:h-[400px] overflow-hidden">
                    <Image
                      src={getCover({ noticia }) || ''}
                      alt={noticia.titulo}
                      className="object-cover w-full h-full transition-transform duration-500"
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
    </section>
  );
}
