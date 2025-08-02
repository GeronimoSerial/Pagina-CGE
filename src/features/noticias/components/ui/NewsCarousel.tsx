'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/shared/interfaces';
import { cn } from '@/shared/lib/utils';

interface NewsCarouselProps {
  featuredNews: NewsItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function NewsCarousel({
  featuredNews,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limitar a 3 noticias destacadas
  const limitedNews = featuredNews.slice(0, 3);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || limitedNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === limitedNews.length - 1 ? 0 : prevIndex + 1,
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, limitedNews.length]);

  // Si no hay noticias destacadas, no mostrar el carrusel
  if (!limitedNews || limitedNews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? limitedNews.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === limitedNews.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <section className={cn('relative mb-12', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Noticias Destacadas
        </h2>
        <div className="mt-2 flex justify-center">
          <div className="w-24 h-1 bg-[#3D8B37]"></div>
        </div>
      </div>

      {/* Carrusel */}
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {limitedNews.map((noticia, index) => (
            <div key={noticia.id} className="w-full flex-shrink-0">
              <Link href={`/noticias/${noticia.slug}`} className="block">
                <div className="relative">
                  {/* Imagen de fondo */}
                  {noticia.portada?.url && (
                    <div className="relative aspect-[21/9] md:aspect-[16/6] overflow-hidden">
                      <Image
                        src={noticia.portada.url}
                        alt={noticia.titulo}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Contenido superpuesto */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <div className="max-w-4xl">
                      {/* Categoría */}
                      {noticia.categoria && (
                        <span className="inline-block px-3 py-1 rounded-full bg-[#3D8B37] text-white text-sm font-medium mb-3 uppercase tracking-wider">
                          {noticia.categoria}
                        </span>
                      )}

                      {/* Título */}
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                        {noticia.titulo}
                      </h3>

                      {/* Resumen */}
                      {noticia.resumen && (
                        <p className="text-base md:text-lg text-gray-200 mb-4 line-clamp-2 md:line-clamp-3">
                          {noticia.resumen}
                        </p>
                      )}

                      {/* Fecha */}
                      <div className="flex items-center text-sm text-gray-300">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <time dateTime={noticia.fecha}>
                          {formatDate(noticia.fecha)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        {limitedNews.length > 1 && (
          <>
            {/* Botones anterior/siguiente */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
              aria-label="Noticia anterior"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
              aria-label="Siguiente noticia"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {limitedNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors',
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70',
                  )}
                  aria-label={`Ir a noticia ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
