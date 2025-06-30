'use client';
import { useEffect, useState } from 'react';
import { ArticleRenderer } from '@/features/tramites/components/article-renderer';
import { Sidebar } from '@/features/tramites/navigation/sidebar';
import { MobileMenu } from '@/features/tramites/navigation/mobile-menu';
import {
  getTramitesNavigation,
  getTramiteArticleBySlug,
  NavSection,
  Article,
} from '@/features/tramites/services/docs-data';

export default function ClientHomePage() {
  const [navigationSections, setNavigationSections] = useState<NavSection[]>(
    [],
  );
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTramitesNavigation(),
      getTramiteArticleBySlug('introduccion'),
    ])
      .then(([nav, art]) => {
        setNavigationSections(nav);
        setArticle(art);
        setError(null);
      })
      .catch(() => setError('Error al cargar los datos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error || !article)
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'Artículo no encontrado'}
      </div>
    );

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
                  <span className="text-sm text-gray-400">← Anterior</span>
                  <a
                    href="/api"
                    className="text-sm text-green-800 transition-colors hover:text-green-600"
                  >
                    Siguiente →
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
