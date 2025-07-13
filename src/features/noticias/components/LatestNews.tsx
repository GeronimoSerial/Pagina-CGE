import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import { RegularNewsCard } from './RegularNewsCard';
import { Noticia } from '@/shared/interfaces';
import Link from 'next/link';

interface LatestNewsProps {
  noticias: Noticia[]; // Required - ya no opcional, viene del SSR
}

export default function LatestNews({ noticias }: LatestNewsProps) {
  // Componente puro - no más fetch, solo renderizado

  return (
    <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-96 lg:sticky lg:top-8 lg:self-start">
          <div className="relative mb-8">
            <h2 className="mb-6 text-2xl font-semibold tracking-wide leading-tight text-gray-300 sm:text-4xl bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
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

        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {noticias.length > 0 ? (
            noticias.map((noticia: Noticia) => (
              <RegularNewsCard key={noticia.id} noticia={noticia} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No hay noticias disponibles</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
