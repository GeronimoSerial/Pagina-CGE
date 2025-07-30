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
  currentPage?: number;
}

export default function StaticNewsSection({
  initialData,
  featuredNews = [],
  currentPage = 1,
}: StaticNewsSectionProps) {
  const { noticias, pagination } = initialData;

  const finalFeaturedNews =
    featuredNews.length > 0
      ? featuredNews
      : noticias.filter((noticia: any) => noticia.esImportante) || [];

  const featuredIds = finalFeaturedNews.map((item: any) => item.id);
  const regularNews = noticias.filter((noticia: any) => {
    if (featuredNews.length > 0) {
      return !featuredIds.includes(noticia.id);
    }

    return !noticia.esImportante;
  });

  return (
    <div className="space-y-8">
      <div>
        <NewsGrid
          featuredNews={currentPage === 1 ? finalFeaturedNews : []}
          regularNews={regularNews}
        />
      </div>

      {pagination?.pageCount > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8 flex-wrap">
          {currentPage > 1 && (
            <Button asChild variant="outline">
              <Link href={`/noticias/page/${currentPage - 1}`}>
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                Anterior
              </Link>
            </Button>
          )}

          {currentPage > 3 && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/noticias/page/1">1</Link>
              </Button>
              {currentPage > 4 && <span className="text-gray-400">...</span>}
            </>
          )}

          {Array.from({ length: Math.min(pagination.pageCount, 5) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;
            if (pageNum > pagination.pageCount) return null;
            
            const isCurrentPage = pageNum === currentPage;
            
            return (
              <Button
                key={pageNum}
                asChild={!isCurrentPage}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                className="min-w-[40px]"
              >
                {isCurrentPage ? (
                  <span>{pageNum}</span>
                ) : (
                  <Link href={`/noticias/page/${pageNum}`}>{pageNum}</Link>
                )}
              </Button>
            );
          })}

          {currentPage < pagination.pageCount - 2 && (
            <>
              {currentPage < pagination.pageCount - 3 && <span className="text-gray-400">...</span>}
              <Button asChild variant="outline" size="sm">
                <Link href={`/noticias/page/${pagination.pageCount}`}>
                  {pagination.pageCount}
                </Link>
              </Button>
            </>
          )}

          {currentPage < pagination.pageCount && (
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
