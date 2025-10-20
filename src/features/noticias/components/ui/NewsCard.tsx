import { Card, CardContent } from '@/shared/ui/card';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { getCover } from '@/features/noticias/services/news';
import { NewsItem } from '@/shared/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/shared/lib/date-utils';
export function NewsCard({
  noticia,
  index = 0,
}: {
  noticia: NewsItem;
  index?: number;
}) {
  const isFirstImage = index === 0;

  return (
    <Card
      key={noticia.id}
      className="overflow-hidden bg-white rounded-xl border-none transition-all duration-300 group shadow-md hover:shadow-lg"
    >
      <CardContent className="p-0">
        <div className="overflow-hidden relative rounded-t-xl">
          <Image
            className="object-cover w-full h-48 transition-transform duration-500 "
            alt={noticia.titulo}
            src={getCover({ noticia }) || '/images/hero2.png'}
            width={1200}
            height={630}
            priority={isFirstImage}
            loading={isFirstImage ? 'eager' : 'lazy'}
            unoptimized
          />
          <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/10" />
        </div>
        <div className="p-6 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex items-center text-xs text-gray-500 gap-2 mb-3 overflow-hidden whitespace-nowrap">
              <div className="flex items-center gap-1 shrink-0">
                <CalendarDays className="w-3 h-3" />
                <span className="truncate">
                  {formatDate(noticia.fecha || '')}
                </span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-1 min-w-0">
                <Tag className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {noticia.categoria ?? 'Redacción CGE'}
                </span>
              </div>
            </div>
            <Link href={`/noticias/${noticia.slug}`}>
              <h4 className="mb-3 text-lg font-semibold leading-7 text-gray-900 transition-colors duration-200 hover:text-green-900">
                {noticia.titulo}
              </h4>
            </Link>
            <p
              className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3"
              title={noticia.resumen}
            >
              {noticia.resumen}
            </p>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-green-900">
            <Link
              href={`/noticias/${noticia.slug}`}
              className="inline-flex gap-2 items-center hover:underline"
            >
              Leer más
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
