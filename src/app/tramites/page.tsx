import { notFound } from 'next/navigation';
import { getTramiteArticleBySlug } from '@/features/tramites/services/docs-data';
import { Clock } from 'lucide-react';

import { HTMLContent } from '@/shared/components/HTMLContent';

// ISR ultra-optimizado: Revalidar cada día - Trámites son muy estáticos
export const revalidate = 86400; //

export default async function IntroduccionPage() {
  // Cache ultra-agresivo integrado en el servicio
  const article = await getTramiteArticleBySlug('introduccion');

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
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Generar metadatos dinámicos
export async function generateMetadata() {
  const article = await getTramiteArticleBySlug('introduccion');

  if (!article) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: 'Trámites CGE',
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
