import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import {
  getNoticiaBySlug,
  getNoticiaPortada,
  getNoticiasRelacionadas,
} from '@/features/noticias/services/noticias';
import { formatearFecha } from '@/shared/lib/utils';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import PhotoSwipeGallery from '@/shared/components/PhotoSwipeGallery';
import { MarkdownComponent } from '@/shared/components/MarkdownComponent';
import remarkGfm from 'remark-gfm';
import { Separador } from '@/shared/components/Separador';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return {};
  return {
    title: noticia.titulo,
    description: noticia.resumen || noticia.titulo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen || noticia.titulo,
      images: noticia.portada ? [noticia.portada] : [],
    },
  };
}

const ENLACES = [
  {
    href: 'https://www.corrientes.gob.ar/',
    label: 'Gobierno de Corrientes',
  },
  {
    href: 'https://www.mec.gob.ar/',
    label: 'Ministerio de Educación',
  },
  {
    href: 'https://ge.mec.gob.ar/',
    label: 'Gestión Educativa',
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  // Fetch noticia y relacionadas en paralelo
  const [noticia, related] = await Promise.all([
    getNoticiaBySlug(slug),
    (async () => {
      const n = await getNoticiaBySlug(slug);
      return n ? getNoticiasRelacionadas(n.categoria) : [];
    })(),
  ]);
  if (!noticia) return notFound();

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
                  <>
                    <Separador titulo="Galería de imágenes" />
                    <PhotoSwipeGallery noticia={noticia} />
                  </>
                )}
              </div>
            </article>
          </div>
        </main>
        {/* Sidebar (static, right) */}
        <aside className="hidden overflow-hidden sticky top-24 mt-24 mr-3 mb-3 w-72 h-full border-t-2 border-b border-l border-r border-slate-200 border-t-slate-300 shadow-lg shadow-slate-200/50 transition-all duration-500 ease-out lg:block bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Navigation Section */}
            <div className="px-2 py-6">
              <h3 className="px-4 mb-5 text-sm font-semibold tracking-[0.1em] text-black ">
                ENLACES INSTITUCIONALES
              </h3>
              {/* Enhanced Navigation Links */}
              <div className="space-y-1">
                {ENLACES.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center px-4 py-3.5 text-black-800 transition-all duration-300 ease-out hover:text-black-900 hover:underline"
                  >
                    {/* Left accent line that appears on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>
                    {/* Content container with better spacing */}
                    <div className="flex items-center w-full ml-3">
                      {/* Small decorative element */}
                      <div className="w-1.5 h-1.5 bg-green-800 rounded-full mr-3 group-hover:bg-green-700 transition-colors duration-300"></div>
                      {/* Link text */}
                      <span className="text-sm font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-300 ease-out">
                        {enlace.label}
                      </span>
                    </div>
                    {/* Subtle background on hover */}
                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300 ease-out rounded-sm"></div>
                  </Link>
                ))}
              </div>
            </div>
            {/* Single Elegant Separator */}
            {Array.isArray(related) && related.length > 0 && (
              <div className="px-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full">
                      <div className="border-t border-slate-300 mb-0.5"></div>
                      <div className="border-t border-slate-200"></div>
                    </div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white px-4">
                      <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Related Articles Section */}
            {Array.isArray(related) && related.length > 0 && (
              <div className="px-2 py-6 flex-1">
                <h3 className="px-4 mb-5 text-sm font-semibold tracking-[0.1em] text-black ">
                  ARTÍCULOS RELACIONADOS
                </h3>
                {/* Related Articles Links */}
                <div className="space-y-2">
                  {related.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/noticias/${item.slug}`}
                      className="group relative block px-4 py-3 transition-all duration-300 ease-out hover:text-slate-900"
                    >
                      {/* Left accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>
                      {/* Content with better left margin usage */}
                      <div className="ml-3">
                        <div className="font-medium text-sm text-slate-800 leading-snug group-hover:text-slate-900 mb-2 group-hover:translate-x-1 transition-transform duration-300 ease-out">
                          {item.titulo}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed group-hover:text-black transition-colors duration-300 pr-2">
                          {item.resumen.slice(0, 160)}
                        </div>
                      </div>
                      {/* Subtle background on hover */}
                      <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-40 transition-opacity duration-300 ease-out rounded-sm"></div>
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
