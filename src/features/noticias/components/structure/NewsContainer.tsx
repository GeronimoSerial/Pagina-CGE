'use client';

import NewsSearch from '../Search';
import NewsSection from './NewsSection';
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
  return (
    <div className="px-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <NewsSearch categorias={categorias} showResults={true} />
      </div>

      <NewsSection
        initialData={initialData}
        featuredNews={featuredNews}
        currentPage={1}
        showCarousel={true}
      />
    </div>
  );
}
