import { NewsItem } from '@/shared/interfaces';
import NewsCard from './NewsCard';
import { cn } from '@/shared/lib/utils';
import { RegularNewsCard } from './RegularNewsCard';

interface NewsGridProps {
  noticias: NewsItem[];
  loading?: boolean;
  className?: string;
  priorityFirst?: boolean;
}

export default function NewsGrid({
  noticias,
  loading = false,
  className,
  priorityFirst = false,
}: NewsGridProps) {
  if (loading) {
    return <NewsGridSkeleton />;
  }

  if (!noticias || noticias.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No se encontraron noticias.</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className,
      )}
    >
      {noticias.map((noticia, index) => (
        <RegularNewsCard key={noticia.id} noticia={noticia} index={index} />
      ))}
    </div>
  );
}

// Skeleton component para loading state
function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Imagen skeleton */}
          <div className="aspect-[16/9] bg-gray-200" />

          {/* Contenido skeleton */}
          <div className="p-4 space-y-3">
            {/* Categoría y fecha */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>

            {/* Título */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
            </div>

            {/* Resumen */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>

            {/* CTA */}
            <div className="pt-2">
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
