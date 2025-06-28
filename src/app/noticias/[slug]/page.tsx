import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Settings,
  Search,
} from 'lucide-react';
import {
  getNoticiaBySlug,
  getNoticiaPortada,
  getNoticias,
} from '@/src/services/noticias';
import { formatearFecha } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import PhotoSwipeGallery from '@/src/components/PhotoSwipeGallery';
import { MarkdownComponent } from '@/src/modules/layout/MarkdownComponent';
import remarkGfm from 'remark-gfm';

interface NoticiaDetalleProps {
  params: { slug: string };
}

export default async function NoticiaDetalle({ params }: NoticiaDetalleProps) {
  const noticia = await getNoticiaBySlug(params.slug);
  if (!noticia) return notFound();

  // Fetch all noticias for related articles (by category, excluding current)
  const allNoticias = await getNoticias();
  const related = allNoticias
    .filter(
      (n: any) => n.categoria === noticia.categoria && n.slug !== noticia.slug,
    )
    .slice(0, 3);

  const Enlaces = [
    {
      href: 'https://www.corrientes.gob.ar/',
      label: 'Gobierno de Corrientes',
    },
    {
      href: 'https://www.mec.gob.ar/',
      label: 'Ministerio de Educación',
    },
    {
      href: 'https://cge.corrientes.gob.ar/',
      label: 'CGE Corrientes',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 transition-all duration-300">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-800">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <Link href="/noticias" className="hover:text-green-800">
                Noticias
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{noticia.titulo}</span>
            </nav>
            {/* Main Article */}
            <article className="bg-white rounded-xl shadow-sm mb-8">
              <div className="p-6 sm:p-8">
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatearFecha(noticia.fecha)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>Redacción CGE</span>
                    </div>
                    <span className="bg-green-800 text-white px-2 py-1 rounded-full text-xs">
                      {noticia.categoria}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    {noticia.titulo}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {noticia.resumen}
                  </p>
                </header>
                {noticia.portada && (
                  <img
                    src={getNoticiaPortada({ noticia }) || ''}
                    alt={noticia.titulo}
                    className="mb-8 rounded w-full object-cover max-h-96"
                  />
                )}
                <div className="prose prose-lg max-w-none mb-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponent}
                  >
                    {noticia.contenido}
                  </ReactMarkdown>
                </div>
                {noticia.imagen && noticia.imagen.length > 0 && (
                  <PhotoSwipeGallery noticia={noticia} />
                )}
                {/* Article footer */}
              </div>
            </article>
          </div>
        </main>
        {/* Sidebar (static, right) */}
        <aside className="hidden lg:block bg-white/90 shadow border border-gray-200 sticky top-24 h-[calc(70vh-4rem)] w-72 transition-all duration-300 ease-in-out overflow-hidden rounded-xl">
          <div className="p-5 flex flex-col gap-8 h-full">
            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-4 px-2 tracking-widest uppercase">
                Enlaces Institucionales
              </h3>
              <div className="space-y-2">
                {Enlaces.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors group border border-transparent hover:border-gray-300"
                  >
                    <span className="ml-1 font-medium group-hover:underline">
                      {enlace.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {/* Related articles in sidebar */}
            {related.length > 0 && (
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-xs font-semibold text-gray-700 mb-4 px-2 tracking-widest uppercase">
                  Artículos Relacionados
                </h3>
                <div className="space-y-2">
                  {related.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/noticias/${item.slug}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-green-800 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                    >
                      <div className="font-semibold hover:underline ">
                        {item.titulo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.resumen.slice(0, 50)}...
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      {/* Footer */}
    </div>
  );
}
