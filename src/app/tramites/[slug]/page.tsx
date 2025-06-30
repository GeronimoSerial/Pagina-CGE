import { notFound } from 'next/navigation';
import { ArticleRenderer } from '@/features/tramites/components/article-renderer';
import { Sidebar } from '@/features/tramites/navigation/sidebar';
import { MobileMenu } from '@/features/tramites/navigation/mobile-menu';
import {
  getTramitesNavigation,
  getTramiteArticleBySlug,
  getAllTramiteSlugs,
  NavSection,
  Article,
} from '@/features/tramites/services/docs-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generar páginas estáticas en build time
export async function generateStaticParams() {
  const slugs = await getAllTramiteSlugs();
  return slugs
    .filter((slug) => slug !== 'introduccion') // Excluir la página principal
    .map((slug) => ({ slug }));
}

// ISR: Revalidar cada 24 horas
export const revalidate = 86400;

export default async function DocumentPage({ params }: PageProps) {
  const [navigationSections, article]: [NavSection[], Article | null] =
    await Promise.all([
      getTramitesNavigation(),
      getTramiteArticleBySlug((await params).slug),
    ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileMenu
        sections={navigationSections}
        currentPageTitle={article.category}
      />

      {/* Main Grid Layout */}
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden overflow-y-auto sticky top-0 h-screen bg-white border-r border-gray-200 lg:block">
          <Sidebar sections={navigationSections} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:overflow-y-auto">
          <ArticleRenderer article={article} />

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
