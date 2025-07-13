import Link from 'next/link';
import { CalendarDays, Pencil } from 'lucide-react';
import {
  getNoticiaBySlug,
  getPortada,
  getNoticiasRelacionadas,
  getAllNoticias,
} from '@/features/noticias/services/noticias';
import { formatearFecha } from '@/shared/lib/utils';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import PhotoSwipeGallery from '@/shared/components/PhotoSwipeGallery';
import { MarkdownComponent } from '@/shared/components/MarkdownComponent';
import remarkGfm from 'remark-gfm';
import { Separador } from '@/shared/components/Separador';
import type { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export const revalidate = 86400;

export async function generateStaticParams() {
  const noticias = await getAllNoticias();
  return noticias.map((noticia: { slug: string }) => ({
    slug: noticia.slug,
  }));
}

const metadataCache = new Map<string, any>();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (metadataCache.has(slug)) {
    return metadataCache.get(slug);
  }

  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return {};

  const url = `/noticias/${slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumen || noticia.titulo,
    datePublished: noticia.fecha,
    dateModified: noticia.fecha,
    author: {
      '@type': 'Organization',
      name: 'Consejo General de Educación',
    },
    image: noticia.portada,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  const metadata = {
    title: noticia.titulo,
    description: noticia.resumen || noticia.titulo,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen || noticia.titulo,
      url: url,
      type: 'article',
      publishedTime: noticia.fecha,
      modifiedTime: noticia.fecha,
      expirationTime: noticia.fecha,
      authors: ['Consejo General de Educación'],
      tags: [noticia.categoria],
      images: noticia.portada ? [noticia.portada] : [],
    },
    other: {
      'script:ld+json': JSON.stringify(structuredData),
    },
  };

  metadataCache.set(slug, metadata);
  setTimeout(() => metadataCache.delete(slug), 3600000); // 1 hora

  return metadata;
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

  const [noticia, related] = await Promise.all([
    getNoticiaBySlug(slug),

    Promise.resolve([]),
  ]);

  if (!noticia) {
    return notFound();
  }

  // Obtener noticias relacionadas de la misma categoría, excluyendo la actual
  const relatedFinal = await getNoticiasRelacionadas(
    noticia.categoria,
    slug,
  ).catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1">
        <main className="flex-1 transition-all duration-300">
          <div className="px-4 py-8 mx-auto max-w-5xl sm:px-6 lg:px-8">
            <nav className="flex items-center mb-6 text-sm text-gray-500">
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

            <article className="mb-8 bg-white rounded-xl shadow-sm">
              <div className="p-6 sm:p-8">
                <header className="mb-8">
                  <div className="flex flex-wrap gap-4 items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 w-4 h-4" />
                      <span className="text-xs tracking-wide">
                        {format(new Date(noticia.fecha), 'EEE, d MMMM yyyy', {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Pencil className="mr-1 w-4 h-4" />
                      <span>Por: {noticia.autor || 'Redacción CGE'}</span>
                    </div>
                    <span className="px-2 py-1 text-xs text-white bg-green-800 rounded-full">
                      {noticia.categoria}
                    </span>
                  </div>
                  <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    {noticia.titulo}
                  </h1>
                  <p className="text-xl leading-relaxed text-gray-600">
                    {noticia.resumen}
                  </p>
                </header>

                {noticia.portada && (
                  <Image
                    src={getPortada({ noticia }) || ''}
                    alt={noticia.titulo}
                    className="object-cover mb-8 w-full max-h-96 rounded"
                    width={1200}
                    height={630}
                    priority
                  />
                )}
                <div className="mb-8 max-w-none prose prose-lg">
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

        <aside className="hidden overflow-hidden sticky top-[85px] mt-16 mr-4 mb-3 w-72 lg:h-[530px] border-t-2 border-r border-b border-l shadow-lg backdrop-blur-sm transition-all duration-500 ease-out border-slate-200 border-t-slate-300 shadow-slate-200/50 lg:block bg-white/95">
          <div className="flex flex-col h-full">
            <div className="px-2 py-6">
              <h3 className="px-4 mb-3 text-sm font-semibold tracking-[0.1em] text-black ">
                ENLACES INSTITUCIONALES
              </h3>

              <div className="space-y-1">
                {ENLACES.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center px-4 py-3.5 text-black-800 transition-all duration-300 ease-out hover:text-green-900 hover:underline"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-800 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>

                    <div className="flex items-center ml-3 w-full">
                      <div className="w-1.5 h-1.5 bg-green-800 rounded-full mr-3 group-hover:bg-green-700 transition-colors duration-300"></div>

                      <span className="text-sm font-medium tracking-wide transition-transform duration-300 ease-out group-hover:translate-x-1">
                        {enlace.label}
                      </span>
                    </div>

                    <div className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-out bg-slate-50 group-hover:opacity-60"></div>
                  </Link>
                ))}
              </div>
            </div>

            {Array.isArray(relatedFinal) && relatedFinal.length > 0 && (
              <div className="px-6">
                <div className="relative">
                  <div className="flex absolute inset-0 items-center">
                    <div className="w-full">
                      <div className="border-t border-slate-300 mb-0.5"></div>
                      <div className="border-t border-slate-200"></div>
                    </div>
                  </div>
                  <div className="flex relative justify-center">
                    <div className="px-4 bg-white">
                      <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(relatedFinal) && relatedFinal.length > 0 && (
              <div className="flex-1 px-2 py-3">
                <h3 className="px-4 mb-2 text-sm font-semibold tracking-[0.1em] text-black ">
                  ARTÍCULOS RELACIONADOS
                </h3>

                <div className="space-y-1">
                  {relatedFinal.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/noticias/${item.slug}`}
                      className="block relative px-4 py-1 transition-all duration-300 ease-out group hover:text-slate-900"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-800 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>

                      <div className="ml-3">
                        <div className="mb-2 text-sm font-medium leading-snug transition-transform duration-300 ease-out text-slate-800 group-hover:text-green-800 group-hover:translate-x-1">
                          {item.titulo}
                        </div>
                        <div className="pr-2 text-xs leading-relaxed transition-colors duration-300 text-slate-500 group-hover:text-black">
                          <p title={item.resumen}>
                            {item.resumen.slice(0, 90) + '...'}
                          </p>
                        </div>
                      </div>
                      {/* Fondo sutil al pasar el ratón */}
                      <div className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 ease-out bg-slate-50 group-hover:opacity-40"></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
