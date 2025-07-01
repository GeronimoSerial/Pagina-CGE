import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@radix-ui/react-separator';
import { Calendar, Tag, User } from 'lucide-react';
import {
  getNoticiasPaginadas,
  getPortada,
} from '@/features/noticias/services/noticias';

export default async function UltimasNoticias() {
  // News data for institutional content
  const { noticias } = await getNoticiasPaginadas(1, 6);

  return (
    <section className="relative px-4 py-12 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Left section - Heading and Description */}
        <div className="w-full lg:w-96 lg:sticky lg:top-8 lg:self-start">
          <div className="relative mb-8">
            <h2 className="mb-6 text-2xl font-semibold tracking-wide leading-tight text-gray-300 sm:text-4xl">
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
          {noticias.map((noticia: any) => (
            <Card
              key={noticia.id}
              className="overflow-hidden bg-white rounded-xl border-none shadow-none transition-all duration-300 cursor-pointer group hover:shadow-lg"
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
                      <Calendar className="w-4 h-4" />
                      <span className="tracking-wide">{noticia.fecha}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Tag className="w-4 h-4" />
                      <span className="tracking-wide">{noticia.categoria}</span>
                    </div>
                  </div>

                  <h4 className="mb-3 text-lg font-semibold leading-7 text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
                    {noticia.titulo}
                  </h4>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {noticia.resumen}
                  </p>

                  <a href={`/noticias/${noticia.slug}`}>
                    <div className="flex items-center text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
                      <span>Leer más</span>
                      <svg
                        className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
