import { notFound } from 'next/navigation';
import { MobileMenu } from '@/features/tramites/navigation/mobile-menu';
import {
  getTramitesNavigation,
  getTramiteArticleBySlug,
  getAllTramiteSlugs,
  NavSection,
  Article,
} from '@/features/tramites/services/docs-data';
import ReactMarkdown from 'react-markdown';
import { MarkdownComponent } from '@/shared/components/MarkdownComponent';
import { Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generar páginas estáticas en build time
export async function generateStaticParams() {
  const slugs = await getAllTramiteSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ISR: Revalidar cada 60 segundos DEVELOPMENT
export const revalidate = 60;

export default async function DocumentPage({ params }: PageProps) {
  const [navigationSections, article]: [NavSection[], Article | null] =
    await Promise.all([
      getTramitesNavigation(),
      getTramiteArticleBySlug((await params).slug),
    ]);

  if (!article) {
    notFound();
  }
  const markdown = article.content?.[0]?.content || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <MobileMenu
        sections={navigationSections}
        currentPageTitle={article.category}
      /> */}

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
            <p className="text-xl text-gray-600">{article.description}</p>
          </header>

          {/* Article Content */}
          <article className="max-w-none prose prose-lg">
            <ReactMarkdown components={MarkdownComponent}>
              {markdown}
            </ReactMarkdown>
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
                  href="/"
                  className="text-sm text-green-800 transition-colors hover:text-green-800"
                >
                  ← Anterior
                </a>
                <span className="text-sm text-green-800">Siguiente →</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: PageProps) {
  const article = await getTramiteArticleBySlug((await params).slug);

  if (!article) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: `${article.title} - Documentación`,
    description: article.description,
  };
}
