import { NewsItem } from '@/shared/interfaces';
import NewsCarousel from '../ui/NewsCarousel';
import NewsGrid from '../ui/NewsGrid';
import PaginationButton from '../ui/PaginationButton';

interface NewsSectionProps {
  initialData: {
    noticias: NewsItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  featuredNews?: NewsItem[];
  currentPage?: number;
  showCarousel?: boolean;
  loading?: boolean;
}

export default function NewsSection({
  initialData,
  featuredNews = [],
  currentPage = 1,
  showCarousel = true,
  loading = false,
}: NewsSectionProps) {
  const { noticias, pagination } = initialData;

  return (
    <div className="space-y-8">
      {/* Carrusel de noticias destacadas - Solo en página 1 */}
      {showCarousel && featuredNews.length > 0 && (
        <NewsCarousel featuredNews={featuredNews} />
      )}

      {/* Grid de noticias */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {showCarousel
              ? 'Últimas Noticias'
              : `Noticias - Página ${currentPage}`}
          </h2>
          <div className="mt-2">
            <div className="w-24 h-1 bg-[#3D8B37]"></div>
          </div>
        </div>

        <NewsGrid
          noticias={noticias}
          loading={loading}
          priorityFirst={currentPage === 1}
        />
      </section>

      {/* Paginación */}
      {pagination && (
        <PaginationButton
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      )}
    </div>
  );
}
