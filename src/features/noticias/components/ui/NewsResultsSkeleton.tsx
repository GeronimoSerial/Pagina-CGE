import { Skeleton } from '@/shared/ui/skeleton';

interface NewsResultsSkeletonProps {
  count?: number;
}

export default function NewsResultsSkeleton({
  count = 6,
}: NewsResultsSkeletonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          {/* Imagen */}
          <Skeleton className="aspect-video w-full rounded-lg" />

          {/* Categoría y fecha */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Título */}
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />

          {/* Resumen */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Botón de leer más */}
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
