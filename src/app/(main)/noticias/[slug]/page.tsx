import Link from 'next/link';
import { CalendarDays, Pencil, Download, FileText } from 'lucide-react';
import {
  getNewsBySlug,
  getCover,
  getRelatedNews,
  getAllNews,
} from '@/features/noticias/services/news';
import { notFound } from 'next/navigation';
import { PhotoSwipeGallery, VideoGallery } from '@/shared/data/dynamic-client';
import { Separador } from '@/shared/components/Separador';
import type { Metadata } from 'next';
import Image from 'next/image';
import { formatDate } from '@/shared/lib/date-utils';
import { NewsItem } from '@/shared/interfaces';
import { HTMLContent } from '@/shared/components/HTMLContent';
import { SITE_URL } from '@/shared/lib/config';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

// MIGRATED: Removed export const revalidate = false (incompatible with Cache Components)
// Content is now dynamic by default - add "use cache" if caching is needed

export async function generateStaticParams() {
  const noticias = await getAllNews();
  const validNoticias = noticias
    .filter(
      (noticia: any) =>
        typeof noticia.slug === 'string' && noticia.slug.length > 0,
    )
    .slice(0, 50)
    .map((noticia: any) => ({ slug: noticia.slug }));

  // Cache Components requires at least one result from generateStaticParams
  // If no noticias are returned, provide a placeholder that will 404 at runtime
  if (validNoticias.length === 0) {
    return [{ slug: '__placeholder__' }];
  }

  return validNoticias;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const noticia = await getNewsBySlug(slug);

  if (!noticia) return {};
  const url = `/noticias/${slug}`;

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
      publishedTime: noticia.createdAt,
      modifiedTime: noticia.lastUpdated,
      expirationTime: noticia.lastUpdated,
      authors: ['Consejo General de Educación'],
      tags: [noticia.categoria],
      images: getCover({ noticia }) || [],
    },
  };

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

  const noticia: NewsItem | null = await getNewsBySlug(slug).catch((error) => {
    console.error('Error fetching news by slug:', error);
    return null;
  });

  if (!noticia) {
    return notFound();
  }
  const coverUrl = getCover({ noticia }) || '/images/hero2.png';

  const relatedFinal = await getRelatedNews(noticia.categoria, slug).catch(
    () => [],
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumen || noticia.titulo,
    datePublished: noticia.createdAt,
    dateModified: noticia.lastUpdated,
    author: {
      '@type': 'Person',
      name: noticia.autor || 'Redacción CGE',
      url: SITE_URL,
    },
    image: getCover({ noticia }) || [],
    publisher: {
      '@type': 'Organization',
      name: 'Consejo General de Educación',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/noticias/${slug}`,
    },
  };
  const documentosConId =
    noticia?.documentos?.map((doc, idx) => ({
      id: idx + 1,
      ...doc,
    })) || [];

  return (
    <div className="flex flex-col page-bg-white">
      <div className="flex flex-1">
        <main className="flex-1 transition-all duration-300">
          <div className="wide-container section-spacing">
            <nav className="flex flex-wrap items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-green-800">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <Link href="/noticias" className="hover:text-green-800">
                Noticias
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 truncate max-w-[200px] sm:max-w-none">
                {noticia.titulo}
              </span>
            </nav>

            <article className="element-spacing bg-white rounded-xl shadow-xs overflow-hidden">
              <div className="p-6 sm:p-8">
                <header className="mb-8">
                  <div className="flex flex-wrap gap-4 items-center mb-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 w-4 h-4" />
                      <span className="text-xs tracking-wide">
                        {formatDate(noticia.fecha || noticia.createdAt || '')}
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
                  <h1 className="mb-6 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                    {noticia.titulo}
                  </h1>
                  <p className="text-xl leading-relaxed text-gray-600">
                    {noticia.resumen}
                  </p>
                </header>

                {noticia.portada && (
                  <Image
                    src={coverUrl}
                    alt={noticia.titulo}
                    className="object-cover mb-8 w-full max-h-96 rounded"
                    width={1200}
                    height={630}
                    priority
                    unoptimized
                  />
                )}
                <HTMLContent
                  content={noticia.contenido}
                  className="mb-8 max-w-full prose prose-lg overflow-x-hidden"
                />
                {documentosConId && documentosConId.length > 0 && (
                  <>
                    <Separador titulo="Documentos adjuntos" />
                    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                      {documentosConId.map((doc) => (
                        <Card
                          key={doc.id}
                          className="flex overflow-hidden flex-col h-full rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                        >
                          <CardHeader className="px-4 pt-3 pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-2 items-center">
                                <FileText className="w-5 h-5 text-green-800" />
                              </div>
                              {doc.fecha && (
                                <span className="text-xs text-gray-500">
                                  {formatDate(doc.fecha)}
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="grow px-4 py-2">
                            <CardTitle
                              className="mb-1 text-lg font-semibold line-clamp-2"
                              title={doc.nombre}
                            >
                              {doc.nombre}
                            </CardTitle>
                          </CardContent>
                          <CardFooter className="px-4 py-3">
                            <Button
                              variant="outline"
                              className="flex gap-2 items-center w-full text-sm hover:bg-[#3D8B37] hover:text-white transition-colors"
                              asChild
                            >
                              <a
                                href={doc.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-3 h-3" />
                                Descargar
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </>
                )}

                {noticia.imagenes && noticia.imagenes.length > 0 && (
                  <>
                    <Separador titulo="Galería de imágenes" />
                    <PhotoSwipeGallery noticia={noticia} />
                  </>
                )}
                {noticia.videos && noticia.videos.length > 0 && (
                  <>
                    <Separador titulo="Galería de videos" />
                    <VideoGallery noticia={noticia} />
                  </>
                )}
              </div>
            </article>
          </div>
        </main>

        <aside className="hidden overflow-hidden sticky top-[85px] mt-16 mr-4 mb-3 w-72 lg:h-[550px] border-t-2 border-r border-b border-l shadow-lg backdrop-blur-xs transition-all duration-500 ease-out border-slate-200 border-t-slate-300 shadow-slate-200/50 lg:block bg-white/95">
          <div className="flex flex-col h-full">
            <div className="px-2 py-6">
              <h3 className="px-4 mb-3 text-sm font-semibold tracking-widest text-black ">
                ENLACES INSTITUCIONALES
              </h3>

              <div className="space-y-1">
                {ENLACES.map((enlace) => (
                  <a
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
                  </a>
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
                <h3 className="px-4 mb-3 text-sm font-semibold tracking-widest text-black ">
                  ARTÍCULOS RELACIONADOS
                </h3>

                <div className="space-y-1">
                  {relatedFinal.slice(0, 2).map((item: any) => (
                    <Link
                      key={item.slug}
                      href={`/noticias/${item.slug}`}
                      className="block relative px-4 py-1 transition-all duration-300 ease-out group hover:text-slate-900"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-800 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center"></div>

                      <div className="ml-3">
                        <div className="mb-2 text-sm font-medium leading-snug transition-transform duration-300 ease-out text-slate-800 group-hover:text-green-800 group-hover:translate-x-1 line-clamp-2">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}
