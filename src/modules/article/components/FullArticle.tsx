import {
  ArrowLeftIcon,
  Tag,
  Clock,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Newspaper,
  Share2,
  Printer,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatearFecha } from "@lib/utils";
import { ClientCarousel } from "@components/data/dynamic-client";
import { MarkdownComponent } from "@src/modules/layout/MarkdownComponent";
import ShareButton from "./ShareButton";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${section}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Volver a {sectionTitle.toLowerCase()}
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={post}></ShareButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Contenido principal */}
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Imagen hero */}
              {post.imagen && (
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={post.imagen}
                    alt={post.titulo}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              {/* Contenido del artículo */}
              <div className="p-6 sm:p-8">
                {/* Meta información */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {post.subcategoria}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatearFecha(post.fecha)}
                  </span>
                  {post.esImportante && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Newspaper className="w-3 h-3 mr-1" />
                      Importante
                    </span>
                  )}
                </div>

                {/* Título */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  {post.titulo}
                </h1>

                {/* Contenido markdown */}
                <div className="prose prose-gray max-w-none prose-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponent}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* Carrusel de imágenes */}
                {post.imagenes_carrusel?.length > 0 && (
                  <div className="mt-12 border-t border-gray-200 pt-8">
                    <ClientCarousel imagenes={post.imagenes_carrusel} />
                  </div>
                )}
              </div>
            </article>
          </main>

          {/* Sidebar sticky */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* Enlaces de interés */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-gray-600" />
                  Enlaces de interés
                </h2>
                <nav className="space-y-2">
                  {ENLACES_RELACIONADOS.map((enlace, index) => (
                    <a
                      key={index}
                      href={enlace.url}
                      className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-md transition-colors group"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      {enlace.titulo}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Artículos relacionados */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-gray-600" />
                  Artículos relacionados
                </h2>
                <div className="space-y-4">
                  {articulosRelacionados.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No hay artículos relacionados disponibles.
                    </p>
                  ) : (
                    <>
                      {articulosRelacionados.slice(0, 4).map((articulo) => (
                        <Link
                          key={articulo.slug}
                          href={`/${section}/${articulo.slug}`}
                          className="block group hover:bg-gray-50 p-3 rounded-md transition-colors"
                        >
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                            {articulo.titulo}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatearFecha(articulo.fecha)}
                          </p>
                        </Link>
                      ))}
                      <Link href={`/${section}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 text-sm"
                        >
                          Ver más {sectionTitle.toLowerCase()}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
