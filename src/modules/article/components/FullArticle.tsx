import {
  ArrowLeftIcon,
  Tag,
  Clock,
  ExternalLink,
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
import { markdownComponents } from "@modules/layout/MarkdownContent";

interface Enlace {
  titulo: string;
  url: string;
}

interface Articulo {
  slug: string;
  titulo: string;
  fecha: string;
}

interface FullArticleProps {
  post: any;
  sectionTitle?: string;
  articulosRelacionados?: Articulo[];
}

const ENLACES: Enlace[] = [
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
    url: "/documentacion",
  },
  {
    titulo: "Documentación",
    url: "/documentacion",
  },
];

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
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${section}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Volver a {sectionTitle.toLowerCase()}
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={post.titulo} />
              <PrintButton />
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Contenido principal */}
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Header del artículo */}
              <div className="px-6 py-8 border-b">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-md">
                    <Tag className="mr-1.5 h-3 w-3" />
                    {post.subcategoria}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="mr-1.5 h-3 w-3" />
                    {formatearFecha(post.fecha)}
                  </span>
                  {post.esImportante && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-sm rounded-md">
                      <Newspaper className="h-3 w-3" />
                      Importante
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {post.titulo}
                </h1>
              </div>

              {/* Imagen principal */}
              {post.imagen && (
                <div className="relative h-64 sm:h-80">
                  <Image
                    src={post.imagen || "/placeholder.svg"}
                    alt={post.titulo}
                    width={1200}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              )}

              {/* Contenido del artículo */}
              <div className="px-6 py-8">
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {post.content ?? ""}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Carrusel de imágenes */}
              {post.imagenes_carrusel && post.imagenes_carrusel.length > 0 && (
                <div className="px-6 pb-8">
                  <ClientCarousel imagenes={post.imagenes_carrusel} />
                </div>
              )}
            </article>
          </main>

          {/* Sidebar sticky */}
          <aside className="mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* Enlaces relacionados */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enlaces útiles
                </h3>
                <nav className="space-y-3">
                  {ENLACES.map((enlace, index) => (
                    <Link
                      key={index}
                      href={enlace.url}
                      className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <ExternalLink className="mr-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
                      {enlace.titulo}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Artículos relacionados */}
              {articulosRelacionados.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Artículos relacionados
                  </h3>
                  <div className="space-y-3">
                    {articulosRelacionados.map((articulo, index) => (
                      <Link
                        key={index}
                        href={`/${section}/${articulo.slug}`}
                        className="block p-3 rounded-md hover:bg-gray-50 transition-colors group"
                      >
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {articulo.titulo}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatearFecha(articulo.fecha)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
