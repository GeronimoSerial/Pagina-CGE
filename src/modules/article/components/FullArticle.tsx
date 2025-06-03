import React from 'react';
import { ArrowLeftIcon, Tag, Clock, ExternalLink, ChevronRight, Bookmark, Newspaper, Share2, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatearFecha } from '@/src/lib/utils';
import ShareButton from './ShareButton';
import PrintButton from './PrintButton';
import { MarkdownComponent } from '../../layout/MarkdownComponent';
import { ClientCarousel } from '@/src/components/data/dynamic-client';

// Enlaces relacionados constantes
const ENLACES_RELACIONADOS = [
  {
    titulo: "Gestión Educativa",
    url: "https://ge.mec.gob.ar",
  },
  {
    titulo: "Sitio oficial Ministerio de Educación",
    url: "http://mec.gob.ar",
  },
  {
    titulo: "Artículos relacionados",
    url: "/articulos",
  },
  {
    titulo: "Documentación",
    url: "/documentacion",
  },
];

interface FullArticleProps {
  post: any;
  sectionTitle?: string;
  articulosRelacionados?: Array<{
    slug: string;
    titulo: string;
    fecha: string;
  }>;
}



export default function FullArticle({
  post,
  sectionTitle = "Artículo",
  articulosRelacionados = [],
}: FullArticleProps) {
  
  const section = sectionTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

 


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <header className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-slate-900 transition-all duration-300">
        <img
          src={post.imagen}
          alt={post.titulo}
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/30 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="max-w-4xl lg:ml-8 animate-fadeIn">
                <div className="flex flex-wrap items-center gap-3 mb-5 text-white">
                  <span className="text-sm font-medium bg-emerald-600 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md hover:bg-emerald-500 transition-colors duration-300">
                    <Tag size={14} strokeWidth={2.5} aria-hidden="true" />
                    <span>{post.subcategoria}</span>
                  </span>
                  <span className="text-sm flex items-center gap-1.5 bg-slate-800/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
                    <Clock size={14} aria-hidden="true" />
                    {formatearFecha(post.fecha)}
                  </span>
                  {post.esImportante && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full border border-emerald-200 shadow-sm">
                      <Newspaper
                        size={14}
                        className="text-emerald-700"
                        aria-hidden="true"
                      />
                      Importante
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                  {post.titulo}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-[1000] backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-3 flex flex-row justify-between items-center min-h-[60px]">
            <div className="transition-all duration-300 hover:translate-x-[-4px]">
              <a href={`/${section}`}>
                <button
                  className="text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 transition-all duration-300 font-medium rounded-full px-4 py-2 text-sm border border-emerald-200 shadow-sm flex items-center group"
                >
                  <ArrowLeftIcon
                    className="mr-2 group-hover:mr-3 transition-all duration-300"
                    size={18}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">Volver a {sectionTitle.toLowerCase()}</span>
                </button>
              </a>
            </div>

            <div className="flex items-center gap-3 ml-2">
                          <ShareButton title={post.titulo} />
              <PrintButton />

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Article Content */}
          <article className="printable-article w-full lg:max-w-4xl lg:mx-auto bg-white rounded-xl overflow-hidden shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg">
            <div className="p-5 md:p-8">
              <div className="max-w-none text-slate-700 text-base leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponent}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
            {post.imagenes_carrusel?.length > 0 && (
              <div className="mt-12">
                <ClientCarousel imagenes={post.imagenes_carrusel} />
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 ml-8">
            <div className="sticky top-[90px]">
              <div className="flex flex-col space-y-6 no-print">
                {/* Enlaces relacionados */}
                <section className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-5 w-full transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-base font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                    <ExternalLink
                      size={16}
                      className="mr-2 text-emerald-600"
                      aria-hidden="true"
                    />
                    Enlaces de interés
                  </h2>
                  <ul className="space-y-1">
                    {ENLACES_RELACIONADOS.map((enlace, index) => (
                      <li key={index} className="group">
                        <a
                          href={enlace.url}
                          className="text-slate-600 hover:text-emerald-700 flex items-center text-sm p-2.5 hover:bg-slate-50 rounded-lg transition-all duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ChevronRight
                            size={14}
                            className="mr-2 flex-shrink-0 text-emerald-500 group-hover:translate-x-1 transition-transform duration-300"
                            aria-hidden="true"
                          />
                          <span className="hover:underline">{enlace.titulo}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Artículos relacionados */}
                <section className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-5 w-full transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-base font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                    <Bookmark
                      size={16}
                      className="mr-2 text-emerald-600"
                      aria-hidden="true"
                    />
                    Artículos relacionados
                  </h2>
                  <div className="space-y-3">
                    {articulosRelacionados.length === 0 ? (
                      <p className="text-slate-500 text-sm italic p-2">
                        No hay artículos relacionados disponibles.
                      </p>
                    ) : (
                      <>
                        {articulosRelacionados.slice(0, 3).map((articulo) => (
                          <a
                            key={articulo.slug}
                            href={`/${section}/${articulo.slug}`}
                            className="block group hover:bg-slate-50 p-3 rounded-lg transition-all duration-300 border border-transparent hover:border-slate-100"
                          >
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 group-hover:underline">
                                {articulo.titulo}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center">
                                <Clock
                                  size={12}
                                  className="mr-1.5 text-slate-400"
                                  aria-hidden="true"
                                />
                                {formatearFecha(articulo.fecha)}
                              </p>
                            </div>
                          </a>
                        ))}
                        <a href={`/${section}`}>
                          <button
                            className="w-full justify-center text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 mt-3 py-2 rounded-lg font-medium transition-colors duration-300 border border-emerald-100"
                          >
                            Ver más {sectionTitle.toLowerCase()}
                          </button>
                        </a>
                      </>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}