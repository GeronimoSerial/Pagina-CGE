import React from 'react';
import { Calendar, ArrowRight, User, Link } from 'lucide-react';
import { getNoticiaPortada } from '@/src/services/noticias';

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
  noticias: NewsItem[];
}

export default function NewsGrid({ noticias }: NewsGridProps) {
  // Separar noticias destacadas de las regulares
  const noticiasDestacadas = noticias.filter((noticia) => noticia.destacado);
  const noticiasRegulares = noticias.filter((noticia) => !noticia.destacado);
  return (
    <section>
      {/* Contenido principal con fondo blanco */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mensaje cuando no hay resultados */}
          {noticias.length === 0 && (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                No se encontraron noticias
              </h3>
              <p className="text-slate-500">
                Intenta ajustar los filtros de búsqueda para encontrar más
                resultados.
              </p>
            </div>
          )}
          {/* Grid de noticias destacadas */}
          {noticiasDestacadas.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-medium text-slate-800 mb-8 tracking-wide">
                Noticias Destacadas
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {noticiasDestacadas.slice(0, 2).map((noticia) => (
                  <article
                    key={noticia.id}
                    className="group relative bg-white border border-slate-200 hover:border-slate-300 transition-all duration-500 ease-out hover:shadow-lg hover:shadow-slate-200/60 rounded-sm overflow-hidden"
                  >
                    {/* Imagen destacada */}
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={getNoticiaPortada({ noticia }) || undefined}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    {/* Contenido */}
                    <div className="p-8">
                      {/* Categoría */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-slate-600 bg-slate-100 rounded-full uppercase">
                          {noticia.categoria}
                        </span>
                      </div>
                      {/* Título */}
                      <h4 className="text-xl font-medium text-slate-800 mb-4 leading-tight group-hover:text-slate-900 transition-colors duration-300">
                        {noticia.titulo}
                      </h4>
                      {/* Resumen */}
                      <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                        {noticia.resumen}
                      </p>
                      {/* Meta información */}
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{noticia.fecha}</span>
                          </div>
                          {noticia.autor && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{noticia.autor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Enlace de lectura */}
                      <a
                        href={`/noticias/${noticia.slug}`}
                        className="group/link inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 ease-out"
                      >
                        <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                          Leer más
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>
                    {/* Línea de acento superior */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                  </article>
                ))}
              </div>
            </div>
          )}
          {/* Grid principal de noticias */}
          {noticiasRegulares.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticiasRegulares.map((noticia) => (
                <article
                  key={noticia.id}
                  className="group relative bg-white border border-slate-200 hover:border-slate-300 transition-all duration-500 ease-out hover:shadow-md hover:shadow-slate-200/50 rounded-sm overflow-hidden"
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getNoticiaPortada({ noticia }) || ''}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  {/* Contenido */}
                  <div className="p-6">
                    {/* Categoría */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium tracking-wider text-slate-600 bg-slate-50 rounded uppercase">
                        {noticia.categoria}
                      </span>
                    </div>
                    {/* Título */}
                    <h4 className="text-lg font-medium text-slate-800 mb-3 leading-tight group-hover:text-slate-900 transition-colors duration-300">
                      {noticia.titulo}
                    </h4>
                    {/* Resumen */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {noticia.resumen}
                    </p>
                    {/* Meta información */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{noticia.fecha}</span>
                      </div>
                      {noticia.autor && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{noticia.autor}</span>
                        </div>
                      )}
                    </div>
                    {/* Enlace de lectura */}
                    <Link
                      href={`/noticias/${noticia.slug}`}
                      className="group/link inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-sm font-medium transition-all duration-300 ease-out"
                    >
                      <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                        Leer más
                      </span>
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                  {/* Línea de acento superior */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                </article>
              ))}
            </div>
          )}
          {/* Separador final */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full">
                <div className="border-t border-slate-300 mb-1"></div>
                <div className="border-t border-slate-200"></div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-6">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
