import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import { NewsCard } from './NewsCard';
import { NewsItem } from '@/shared/interfaces';
import Link from 'next/link';

interface LatestNewsProps {
  noticias: any[];
}

export default function LatestNews({ noticias }: LatestNewsProps) {
  const noticiasFormateadas: NewsItem[] = noticias
    .slice(0, 6)
    .map((noticia: any) => ({
      id: noticia.id,
      autor: noticia.autor || 'Redacción CGE',
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      fecha: noticia.fecha,
      categoria: noticia.categoria,
      esImportante: noticia.esImportante || false,
      slug: noticia.slug,
      portada: noticia.portada || { url: '' },
      imagen: noticia.imagen || [],
      contenido: '',
      publicado: true,
    }));

  return (
    <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-96 lg:sticky lg:top-8 lg:self-start">
          <div className="relative mb-8">
            <h2 className="mb-6 text-2xl font-semibold tracking-wide leading-tight sm:text-4xl bg-linear-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
              ÚLTIMAS NOTICIAS
            </h2>
            <Separator className="bg-green-700 h-0.5" />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold tracking-wide leading-tight text-gray-900 sm:text-2xl">
              SEGUÍ DE CERCA NUESTRAS ACCIONES
            </h3>

            <p className="text-base leading-relaxed text-gray-600 text-balance">
              Conocé los avances, logros e iniciativas más recientes que marcan
              el camino de nuestra institución hacia la calidad educativa, la
              inclusión y la innovación.
            </p>

            <Link
              href="/noticias"
              className="inline-flex items-center px-6 py-3 font-medium text-white bg-green-800 rounded-lg transition-colors duration-200 hover:bg-green-900"
            >
              Ver todas las noticias
            </Link>
          </div>
        </div>

        <div className="flex-1">
          {noticiasFormateadas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {noticiasFormateadas.map((noticia, index) => (
                <NewsCard key={noticia.slug} noticia={noticia} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                No hay noticias disponibles en este momento.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
