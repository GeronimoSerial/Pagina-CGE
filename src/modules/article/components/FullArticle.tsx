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

const ArticleHeader = ({
  post,
  sectionTitle,
}: {
  post: FullArticleProps["post"];
  sectionTitle: string;
}) => (
  <header className="bg-white border-b border-gray-200">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
              <Tag size={14} className="mr-1" />
              {post.subcategoria}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              {formatearFecha(post.fecha)}
            </span>
            {post.esImportante && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                <Newspaper size={14} />
                Importante
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {post.titulo}
          </h1>

          {post.imagen && (
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
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
        </div>
      </div>
    </div>
  </header>
);

const StickyLinks = () => (
  <div className="absolute right-0 top-24 w-64">
    <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Enlaces relacionados</h3>
      <ul className="space-y-3">
        {ENLACES.map((enlace, index) => (
          <li key={index}>
            <Link
              href={enlace.url}
              className="flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ExternalLink size={14} className="mr-2" />
              {enlace.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header fijo */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center h-20">
            <Link href={`/${section}`}>
              <Button
                variant="ghost"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
              >
                <ArrowLeftIcon className="mr-2" size={16} />
                Volver a {sectionTitle.toLowerCase()}
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton title={post.titulo} />
              <PrintButton />
            </div>
          </div>
        </div>
      </div>

      {/* Encabezado del artículo */}
      <ArticleHeader post={post} sectionTitle={sectionTitle} />

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 relative">
        {/* Artículo centrado */}
        <div className="flex justify-center">
          <article className="printable-article bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-[800px]">
            <div className="p-6 md:p-8">
              <div className="prose prose-lg prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {post.content ?? ""}
                </ReactMarkdown>
              </div>
            </div>

            {post.imagenes_carrusel && post.imagenes_carrusel.length > 0 && (
              <div className="mt-12">
                <ClientCarousel imagenes={post.imagenes_carrusel} />
              </div>
            )}
          </article>
        </div>

        {/* Card sticky de enlaces */}
        <StickyLinks />
      </main>
    </div>
  );
}
