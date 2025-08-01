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
      <div className="flex justify-center">
        <Link href="/noticias" className="inline-flex items-center">
          <Button variant="outline" size="sm">
            Ver todas las noticias
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
