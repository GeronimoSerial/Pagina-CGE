import {
  ArrowLeftIcon,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatearFecha } from "@lib/utils";
import { normalizarTexto } from "@lib/utils";
import ShareButton from "./ShareButton";
import PrintButton from "./PrintButton";
import { ClientCarousel } from "@components/data/dynamic-client";
import { MarkdownComponent } from "@src/modules/layout/MarkdownComponent";

interface FullArticleProps {
  post: any;
  sectionTitle?: string;
  articulosRelacionados?: Array<{
    slug: string;
    titulo: string;
    date: string;
  }>;
}

export default function FullArticle({
  post,
  sectionTitle = "Artículo",
  articulosRelacionados = [],
}: FullArticleProps) {
  const section = normalizarTexto(sectionTitle);
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
      url: `/${section}`,
    },
    {
      titulo: "Documentación",
      url: "/documentacion",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative h-[300px] md:h-[400px] overflow-hidden bg-slate-900">
        <Image
          src={post.imagen}
          alt={post.titulo}
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="max-w-4xl lg:ml-8">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-white">
                  <span className="text-sm font-medium bg-emerald-600 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                    <Tag size={14} aria-hidden="true" />
                    {post.categoria}
                  </span>
                  <span className="text-sm flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full">
                    <Clock size={14} aria-hidden="true" />
                    {formatearFecha(post.date)}
                  </span>
                  {post.esImportante && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-300">
                      <Newspaper
                        size={14}
                        className="text-green-700"
                        aria-hidden="true"
                      />
                      Importante
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  {post.titulo}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-[6px] py-2 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-2 flex flex-row justify-between items-center min-h-[56px]">
            <div>
              <Link href={`/${section}`}>
                <Button
                  variant="ghost"
                  className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/40 transition-all duration-300 font-medium rounded-full px-3 py-1.5 text-sm"
                >
                  <ArrowLeftIcon
                    className="mr-2"
                    size={18}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">
                    Volver a {sectionTitle.toLowerCase()}
                  </span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <ShareButton title={post.titulo} />
              <PrintButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between">
          <article className="printable-article w-full lg:max-w-4xl lg:mx-auto bg-white rounded-xl overflow-hidden shadow-md border border-slate-200">
            <div className="p-4 md:p-6">
              <div className="max-w-none text-slate-800 text-base leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponent}
                >
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

          <aside className="hidden lg:block w-64 flex-shrink-0 ml-8">
            <div className="sticky top-[90px]">
              <div className="flex flex-col space-y-4 no-print">
                <section className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-4 w-full">
                  <h2 className="text-base font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
                    <ExternalLink
                      size={16}
                      className="mr-2 text-slate-600"
                      aria-hidden="true"
                    />
                    Enlaces de interés
                  </h2>
                  <ul className="space-y-2">
                    {ENLACES_RELACIONADOS.map((enlace, index) => (
                      <li key={index} className="group">
                        <a
                          href={enlace.url}
                          className="text-slate-600 hover:text-slate-800 hover:underline flex items-center text-sm p-1.5 hover:bg-slate-50 rounded-lg transition-all duration-300"
                        >
                          <ChevronRight
                            size={14}
                            className="mr-1.5 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                          />
                          <span>{enlace.titulo}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-4 w-full">
                  <h2 className="text-base font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center">
                    <Bookmark
                      size={16}
                      className="mr-2 text-slate-600"
                      aria-hidden="true"
                    />
                    Artículos relacionados
                  </h2>
                  <div className="space-y-3">
                    {articulosRelacionados.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">
                        No hay artículos relacionados disponibles.
                      </p>
                    ) : (
                      <>
                        {articulosRelacionados.slice(0, 3).map((articulo) => (
                          <a
                            key={articulo.slug}
                            href={`/${section}/${articulo.slug}`}
                            className="block group hover:bg-slate-50 p-2 rounded-lg transition-all duration-300"
                          >
                            <div className="space-y-1">
                              <h3 className="text-sm font-medium text-slate-800 group-hover:text-slate-700 transition-colors line-clamp-2">
                                {articulo.titulo}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center">
                                <CalendarDays
                                  size={12}
                                  className="mr-1"
                                  aria-hidden="true"
                                />
                                {formatearFecha(articulo.date)}
                              </p>
                            </div>
                          </a>
                        ))}
                        <Link href={`/${section}`}>
                          <Button
                            variant="ghost"
                            className="w-full justify-center text-xs text-slate-600 hover:bg-slate-50 mt-1 py-1.5 rounded-lg font-medium"
                          >
                            Ver más {sectionTitle.toLowerCase()}
                          </Button>
                        </Link>
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
