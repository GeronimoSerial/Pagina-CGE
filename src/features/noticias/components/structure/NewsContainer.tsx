'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import NewsSearch from '../Search';
import StaticNewsSection from './StaticNewsSection';
import { NewsItem } from '@/shared/interfaces';

interface NewsContainerProps {
  initialData: {
    noticias: any[];
    pagination: any;
  };
  categorias: Array<{ id: number; nombre: string }>;
  featuredNews?: NewsItem[];
}

export default function NewsContainer({
  initialData,
  categorias,
  featuredNews = [],
}: NewsContainerProps) {
  const searchParams = useSearchParams();

  const hasQuery = searchParams.get('q');
  const hasCategory = searchParams.get('categoria');
  const hasDateFilter = searchParams.get('desde') || searchParams.get('hasta');

  const hasActiveFilters = hasQuery || hasCategory || hasDateFilter;

  return (
    <div className="px-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <NewsSearch categorias={categorias} />
      </div>

      {!hasActiveFilters ? (
        <StaticNewsSection
          initialData={initialData}
          featuredNews={featuredNews}
          currentPage={1}
        />
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D8B37]"></div>
                <div className="text-gray-500">Filtrando noticias...</div>
              </div>
            </div>
          }
        >
          {/* <FetchNewsClient /> */}
        </Suspense>
      )}
    </div>
  );
}
