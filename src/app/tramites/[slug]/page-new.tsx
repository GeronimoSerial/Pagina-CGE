import { notFound } from 'next/navigation';
import {
  getTramiteArticleBySlug,
  getAllTramiteSlugs,
  Article,
} from '@/features/tramites/services/docs-data';
import { Clock } from 'lucide-react';
import { PERFORMANCE_CONFIG } from '@/shared/lib/config';
import { HTMLContent } from '@/shared/components/HTMLContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generar páginas estáticas en build time con cache optimizado
export async function generateStaticParams() {
  try {
    const slugs = await getAllTramiteSlugs();
    // Filtrar slug 'introduccion' ya que tiene su propia página
    return slugs
      .filter((slug) => slug !== 'introduccion')
      .map((slug) => ({ slug }));
  } catch (error) {
    console.warn('Error generating static params for tramites:', error);
    // Fallback: generar páginas para trámites conocidos
    return [
      { slug: 'articulo-11' },
      { slug: 'articulo-22' },
      { slug: 'articulo-27' },
      { slug: 'articulo-28' },
      { slug: 'accidentes-laborales' },
    ];
  }
}

// ISR ultra-optimizado: Trámites son muy estáticos
export const revalidate = PERFORMANCE_CONFIG.REVALIDATE.TRAMITES;

export default async function DocumentPage({ params }: PageProps) {
  const slug = (await params).slug;

  // Cache ultra-agresivo integrado en el servicio
  const article: Article | null = await getTramiteArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const htmlContent = article.content?.[0]?.content || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 lg:overflow-y-auto">
        <div className="px-6 py-8 mx-auto max-w-4xl lg:px-8 lg:py-12">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 mr-3 text-xs font-medium text-white bg-green-800 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1 w-4 h-4" />
                {new Date(article.lastUpdated).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            {article.description && (
              <p className="text-xl text-gray-600">{article.description}</p>
            )}
          </header>

          {/* Article Content - HTML sanitizado */}
          <article className="max-w-none prose prose-lg">
            <HTMLContent content={htmlContent} className="tramites-content" />
          </article>
        </div>

        {/* Article Footer */}
        <footer className="px-6 pb-8 mx-auto max-w-4xl lg:px-8">
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 text-sm text-gray-600 sm:mb-0">
                ¿Encontraste un error en esta página?{' '}
                <a
                  href="/contacto"
                  className="text-green-800 underline hover:text-green-600"
                >
                  Comunícanos
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="/tramites"
                  className="flex items-center text-sm text-gray-800 hover:text-green-600"
                >
                  ← Volver a trámites
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Generar metadatos dinámicos optimizado
export async function generateMetadata({ params }: PageProps) {
  const slug = (await params).slug;
  const article = await getTramiteArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Página no encontrada',
    };
  }

  const url = `/tramites/${slug}`;

  return {
    title: `${article.title} - Trámites CGE`,
    description:
      article.description ||
      `Información sobre ${article.title} - Consejo General de Educación`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description || `Información sobre ${article.title}`,
      url: url,
      type: 'article',
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      siteName: 'Consejo General de Educación',
      images: [
        {
          url: '/og-tramites.webp',
          width: 1200,
          height: 630,
          alt: 'Trámites CGE',
        },
      ],
    },
  };
}
