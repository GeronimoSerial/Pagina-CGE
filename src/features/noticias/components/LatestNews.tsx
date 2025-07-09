import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';
import { RegularNewsCard } from './RegularNewsCard';
import { Noticia } from '@/shared/interfaces';

export default async function UltimasNoticias() {
  // News data for institutional content
  const { noticias } = await getNoticiasPaginadas(1, 6);

  return (
    <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Left section - Heading and Description */}
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

            <button className="inline-flex items-center px-6 py-3 font-medium text-white bg-green-900 rounded-lg transition-colors duration-200 hover:bg-gray-800">
              Ver todas las noticias
            </button>
          </div>
        </div>

        {/* Right section - News grid */}
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {noticias.map((noticia: Noticia) => (
            <RegularNewsCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </div>
    </section>
  );
}
