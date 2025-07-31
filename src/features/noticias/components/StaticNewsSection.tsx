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
}

export default function StaticNewsSection({
  initialData,
  featuredNews = [],
}: StaticNewsSectionProps) {
  const { noticias, pagination } = initialData;

  const finalFeaturedNews =
    featuredNews.length > 0
      ? featuredNews
      : noticias.filter((noticia: any) => noticia.esImportante) || [];

  const regularNews =
    noticias.filter((noticia: any) => !noticia.esImportante) || [];

  return (
    <div className="space-y-8">
      <div>
        <NewsGrid featuredNews={finalFeaturedNews} regularNews={regularNews} />
      </div>

      {pagination?.pageCount > 1 && (
        <div className="flex justify-center pt-8">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/noticias?page=2">
              Ver más noticias
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
