import { notFound } from 'next/navigation';
import { getProcedureBySlug } from '@/features/tramites/services/docs-data';
import { Clock } from 'lucide-react';
import { HTMLContent } from '@/shared/components/HTMLContent';

// MIGRATED: Removed export const revalidate = false (incompatible with Cache Components)
// Content is now dynamic by default - add "use cache" if caching is needed

export default async function IntroduccionPage() {
  const article = await getProcedureBySlug('introduccion');

  if (!article) {
    notFound();
  }
  const markdown = article.content?.[0]?.content || '';

  return (
    <div className="page-bg-default">
      <main className="flex-1 lg:overflow-y-auto">
        <div className="content-container section-spacing">
          {/* Article Header */}
          <header className="element-spacing">
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
            <h1 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              {article.description}
            </p>
          </header>

          {/* Article Content */}
          <article className="max-w-none prose prose-lg">
            <HTMLContent
              content={markdown}
              className="max-w-none mb-8 prose prose-lg"
            />
          </article>
        </div>

        {/* Article Footer */}
        <footer className="content-container pb-8">
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
              <div className="text-sm text-gray-500">
                Última actualización:{' '}
                {new Date(article.lastUpdated).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export async function generateMetadata() {
  const article = await getProcedureBySlug('introduccion');

  if (!article) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: 'Trámites',
    description:
      'Guía completa de trámites educativos para todos los agentes docentes',
    alternates: {
      canonical: '/tramites/introduccion',
    },
    openGraph: {
      title: article.title,
      description:
        'Guía completa de trámites educativos para todos los agentes docentes',
      type: 'website',
      url: '/tramites/introduccion',
      images: [
        {
          url: '/og-tramites.webp',
          width: 1200,
          height: 630,
          alt: 'Consejo General de Educación',
        },
      ],
    },
  };
}
