import {
  ArrowLeftIcon,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatearFecha } from "@lib/utils";
import ShareButton from "./ShareButton";
import PrintButton from "./PrintButton";
import Image from "next/image";
import { ClientCarousel } from "@components/data/dynamic-client";
export default function FullArticle({
  post,
  sectionTitle = "Artículo",
  articulosRelacionados = [],
}: {
  post: any;
  sectionTitle?: string;
  articulosRelacionados?: any[];
}) {
  const enlaces = [
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
      url: `/${sectionTitle.toLowerCase()}`,
    },
    {
      titulo: "Documentación",
      url: "/documentacion",
    },
  ];

  const section = sectionTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header - Mejorado con overlay más suave y mejor espaciado */}
      <div className="relative h-[350px] md:h-[550px] overflow-hidden bg-slate-900">
        <Image
          src={post.imagen}
          alt={post.titulo}
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
          <div className="container mx-auto px-6 pb-8">
            <div className="max-w-4xl ">
              <div className="flex flex-wrap items-center gap-4 mb-5 text-white">
                <span className="text-sm font-medium bg-emerald-600 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                  <Tag size={14} />
                  {post.subcategoria}
                </span>
                <span className="text-sm flex items-center gap-1.5 bg-black/30 px-4 py-1.5 rounded-full">
                  <Clock size={14} />
                  {formatearFecha(post.fecha)}
                </span>
                {post.esImportante && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-300">
                    <Newspaper size={16} className="text-green-700" />
                    Importante
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight ">
                {post.titulo ?? ""}
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Bar - Mejorado con mejor espaciado y hover states */}
      <div className="sticky top-[15px] z-[1000] backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-18">
            <Link href={`/${section}`}>
              <Button
                variant="ghost"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/40 transition-all duration-300 font-medium rounded-full px-4 py-2"
              >
                <ArrowLeftIcon className="mr-2" size={18} />
                Volver a {sectionTitle.toLowerCase()}
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <ShareButton title={post.titulo} />
              <PrintButton />
            </div>
          </div>
        </div>
      </div>
      {/* Main Content - Mejorado con mejor espaciado y layout */}
      <div className="container mx-auto px-4 py-10">
        <div className="printable-article relative flex flex-col lg:flex-row gap-4">
          {/* Article Content - Main Column */}
          <article className="printable-article w-full lg:w-3/4 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <div className="p-5 md:p-10">
              <div className="max-w-none text-slate-800 text-base leading-relaxed ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold text-slate-900 mt-10 mb-5 border-b pb-1 border-slate-200"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-semibold mt-8 mb-4 text-slate-800"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-medium mt-6 mb-3 text-slate-700"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-gray-800 underline hover:text-blue-800 hover:underline transition-colors font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="rounded-xl shadow-xl my-8 w-full"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-slate-400 bg-slate-50 pl-5 py-3 my-8 italic rounded-r-lg text-slate-700"
                        {...props}
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-sm"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-slate-800 text-slate-100 rounded-xl p-5 overflow-x-auto my-8 shadow-md text-sm"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 my-5 space-y-2 marker:text-slate-500"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 my-5 space-y-2 marker:text-slate-500"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2 leading-relaxed" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-8 rounded-xl shadow-md">
                        <table
                          className="min-w-full border border-slate-200 rounded-xl overflow-hidden"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-slate-200 px-5 py-3 bg-slate-100 text-left text-slate-700 font-medium"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-slate-200 px-5 py-3"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-6 text-slate-700 leading-relaxed text-lg"
                        {...props}
                      />
                    ),
                  }}
                >
                  {post.content ?? ""}
                </ReactMarkdown>
              </div>
            </div>
            {/* Carrusel de imágenes al final del artículo */}
            {post.imagenes_carrusel && post.imagenes_carrusel.length > 0 && (
              <div className="mt-12">
                <ClientCarousel imagenes={post.imagenes_carrusel} />
              </div>
            )}
          </article>

          {/* Sidebar - Complementary Column */}
          <aside className="w-full flex flex-col space-y-6 lg:w-1/4 lg:sticky lg:top-[90px] h-full lg:ml-auto no-print">
            {/* Enlaces relacionados */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 p-4 w-full">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                <ExternalLink size={18} className="mr-2 text-slate-600" />
                Enlaces de interés
              </h3>
              <ul className="space-y-3">
                {enlaces.map((enlace, index) => (
                  <li key={index} className="group">
                    <a
                      href={enlace.url}
                      className="text-slate-600 hover:text-slate-800 hover:underline flex items-center text-sm p-2 hover:bg-slate-50 rounded-lg transition-all duration-300"
                    >
                      <ChevronRight
                        size={16}
                        className="mr-2 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                      />
                      <span>{enlace.titulo}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Artículos relacionados */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 p-4 w-full">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center">
                <Bookmark size={18} className="mr-2 text-slate-600" />
                Artículos relacionados
              </h3>
              <div className="space-y-4">
                {articulosRelacionados.length === 0 && (
                  <p className="text-slate-500 text-sm italic">
                    No hay artículos relacionados disponibles.
                  </p>
                )}
                {articulosRelacionados.slice(0, 3).map((articulo) => (
                  <a
                    key={articulo.slug}
                    href={`/${section}/${articulo.slug}`}
                    className="block group hover:bg-slate-50 p-3 rounded-xl transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <h4 className="text-base font-medium text-slate-800 group-hover:text-slate-700 transition-colors line-clamp-2">
                        {articulo.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatearFecha(articulo.fecha)}
                      </p>
                    </div>
                  </a>
                ))}
                <Link href={`/${section}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm text-slate-600 hover:bg-slate-50 mt-2 py-2 rounded-xl font-medium"
                  >
                    Ver más {sectionTitle.toLowerCase()}
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
