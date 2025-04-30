import {
  ArrowLeftIcon,
  Tag,
  Clock,
  Share2,
  Bookmark,
  ExternalLink,
  Mail,
  Printer,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatearFecha } from "../../../lib/utils";
import ShareButton from "./ShareButton";
import PrintButton from "./PrintButton";

export default function FullArticle({
  post,
  sectionTitle = "Articulo",
  articulosRelacionados = [],
}: {
  post: any;
  sectionTitle?: string;
  articulosRelacionados?: any[];
}) {
  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="flex flex-col items-center py-12 px-6">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <span className="text-red-500 text-4xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-3">
                {sectionTitle} no encontrado
              </h1>
              <p className="text-slate-500 text-center mb-8">
                Lo sentimos, el {sectionTitle.toLowerCase()} que estás buscando
                no existe o ha sido removido.
              </p>
              <Link href="/">
                <Button className="bg-emerald-700 hover:bg-emerald-800 transition-all duration-300">
                  <ArrowLeftIcon className="mr-2" size={16} />
                  Volver a la página principal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      titulo: "Articulos relacionados",
      url: `/${sectionTitle.toLowerCase()}`,
    },
  ];

  // function handleShare() {
  //   const url = typeof window !== "undefined" ? window.location.href : "";
  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: post.titulo,
  //         text: "Mira este articulo del Consejo General de Educación",
  //         url,
  //       })
  //       .catch((error) => {
  //         console.log("Error al compartir", error);
  //       });
  //   } else if (navigator.clipboard) {
  //     navigator.clipboard.writeText(url).then(() => {
  //       alert("¡Enlace copiado al portapapeles!");
  //     });
  //   } else {
  //     prompt("Copia el enlace:", url);
  //   }
  // }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header - Full Width */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={post.imagen ?? "/images/default.jpg"}
          alt={post.titulo ?? "Articulo"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 mb-3 text-white/90">
                <span className="text-sm font-medium bg-emerald-700 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Tag size={14} />
                  {post.subcategoria}
                </span>
                <span className="text-sm flex items-center gap-1.5">
                  <Clock size={14} />
                  {formatearFecha(post.fecha)}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                {post.titulo ?? ""}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-emerald-700 hover:bg-emerald-50 transition-all duration-300 font-medium"
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content - Main Column */}
          <article className="lg:col-span-8 bg-white rounded-xl overflow-hidden shadow-md border border-slate-100">
            <div className="p-6 md:p-12">
              {/* Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-emerald-800 prose-headings:font-semibold prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:text-emerald-800 hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-emerald-600/30 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:text-slate-700 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-emerald-700 prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4 printable-article">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-bold mt-10 mb-4"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-semibold mt-8 mb-3"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-semibold mt-6 mb-2"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="rounded-lg shadow-lg my-6 w-full"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-emerald-600/30 bg-emerald-50/50 text-slate-700 pl-4 py-2 my-6 italic"
                        {...props}
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-sm"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-slate-800 text-slate-100 rounded-lg p-4 overflow-x-auto my-6"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 my-4 space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 my-4 space-y-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <table
                        className="min-w-full border border-slate-200 my-6 rounded-lg overflow-hidden"
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-slate-200 px-4 py-2 bg-slate-50 text-left"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-slate-200 px-4 py-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-6 text-slate-700 leading-relaxed"
                        {...props}
                      />
                    ),
                  }}
                >
                  {post.content ?? ""}
                </ReactMarkdown>
              </div>

              {/* Table of Contents - Displayed as links on smaller screens */}
              <div className="mt-12 lg:hidden block pt-6 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  En esta página
                </h3>
                <nav className="flex flex-col space-y-2">
                  <a
                    href="#"
                    className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                  >
                    <span className="mr-2">•</span> Introducción
                  </a>
                  <a
                    href="#"
                    className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                  >
                    <span className="mr-2">•</span> Sección principal
                  </a>
                  <a
                    href="#"
                    className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                  >
                    <span className="mr-2">•</span> Conclusiones
                  </a>
                </nav>
              </div>

              {/* Contact Info */}
              <div className="mt-12 pt-6 border-t border-slate-100 bg-slate-50/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  Más información
                </h3>
                <p className="text-slate-600 mb-4">
                  Para más detalles sobre este {sectionTitle.toLowerCase()},
                  puede contactar a la oficina de prensa del CGE.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/contacto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Mail size={16} className="mr-2" />
                      Contactar
                    </Button>
                  </Link>
                  <Link href="/documentacion">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                    >
                      <FileText size={16} className="mr-2" />
                      Descargar documentación
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Complementary Column */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Table of Contents */}
            <div className="hidden lg:block bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 border-b border-slate-100 pb-2">
                En esta página
              </h3>
              <nav className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                >
                  <span className="mr-2">•</span> Introducción
                </a>
                <a
                  href="#"
                  className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                >
                  <span className="mr-2">•</span> Sección principal
                </a>
                <a
                  href="#"
                  className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                >
                  <span className="mr-2">•</span> Conclusiones
                </a>
              </nav>
            </div>

            {/* Enlaces relacionados */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 border-b border-slate-100 pb-2">
                Enlaces de interés
              </h3>
              <ul className="space-y-3">
                {enlaces.map((enlace, index) => (
                  <li key={index}>
                    <a
                      href={enlace.url}
                      className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center"
                    >
                      <ExternalLink size={14} className="mr-2 flex-shrink-0" />
                      <span>{enlace.titulo}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Artículos relacionados */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 border-b border-slate-100 pb-2">
                Artículos relacionados
              </h3>
              <div className="space-y-4">
                {articulosRelacionados.length === 0 && (
                  <p className="text-slate-500 text-sm">
                    No hay artículos relacionados.
                  </p>
                )}
                {articulosRelacionados.map((articulo) => (
                  <a
                    key={articulo.slug}
                    href={`/${sectionTitle.toLowerCase()}/${articulo.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={articulo.imagen ?? "/images/default.jpg"}
                          alt={articulo.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {articulo.titulo}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatearFecha(articulo.fecha)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
                <Link href={`/${sectionTitle.toLowerCase()}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm text-emerald-700 hover:bg-emerald-50 mt-2"
                  >
                    Ver más {sectionTitle.toLowerCase()}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Newsletter subscription */}
            <div className="bg-emerald-50 rounded-xl overflow-hidden shadow-md border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                Suscríbete al boletín
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Recibe las últimas actualizaciones directamente en tu correo.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 transition-all duration-300">
                  Suscribirse
                </Button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
