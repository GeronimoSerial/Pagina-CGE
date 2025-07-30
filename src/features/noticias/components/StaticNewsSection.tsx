import Link from 'next/link';
import NewsGrid from './NewsGrid';
import { Button } from '@/shared/ui/button';
import { ArrowRight } from 'lucide-react';
import { NewsItem } from '@/shared/interfaces';

interface StaticNewsSectionProps {
  initialData: {
    noticias: any[];
    pagination: any;
  };
  featuredNews?: NewsItem[];
  currentPage?: number; // Nuevo prop opcional
}

export default function StaticNewsSection({
  initialData,
  featuredNews = [],
  currentPage = 1, // Default para backward compatibility
}: StaticNewsSectionProps) {
  const { noticias, pagination } = initialData;

  const finalFeaturedNews =
    featuredNews.length > 0
      ? featuredNews
      : noticias.filter((noticia: any) => noticia.esImportante) || [];

  // FIXED: Excluir noticias destacadas de las regulares para evitar duplicación
  const featuredIds = finalFeaturedNews.map((item: any) => item.id);
  const regularNews = noticias.filter((noticia: any) => {
    // Si tenemos featured news externas, excluir solo esas
    if (featuredNews.length > 0) {
      return !featuredIds.includes(noticia.id);
    }
    // Si no hay featured news externas, excluir las marcadas como importantes
    return !noticia.esImportante;
  });

  return (
    <div className="space-y-8">
      <div>
        <NewsGrid
          featuredNews={currentPage === 1 ? finalFeaturedNews : []} // Solo mostrar en página 1
          regularNews={regularNews}
        />
      </div>

      {/* Navegación mejorada pero simple */}
      {pagination?.pageCount > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          {currentPage > 1 && (
            <Button asChild variant="outline">
              <Link href={`/noticias/page/${currentPage - 1}`}>
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                Anterior
              </Link>
            </Button>
          )}

          <span className="px-4 py-2 text-sm text-gray-600">
            Página {currentPage} de {Math.min(pagination.pageCount, 5)}
          </span>

          {currentPage < Math.min(pagination.pageCount, 5) && (
            <Button asChild variant="outline">
              <Link href={`/noticias/page/${currentPage + 1}`}>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
