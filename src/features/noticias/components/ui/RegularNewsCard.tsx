import { Card, CardContent } from '@/shared/ui/card';
import { formatDate } from '@/shared/lib/date-utils';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { getCover } from '@/features/noticias/services/news';
import { NewsItem } from '@/shared/interfaces';
import Image from 'next/image';
import Link from 'next/link';

export function RegularNewsCard({
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
            src={getCover({ noticia }) || ''}
            width={1200}
            height={630}
            priority={isFirstImage}
            loading={isFirstImage ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/10" />
        </div>
        <div className="p-6 flex flex-col justify-between h-[250px]">
          <div>
            <div className="flex gap-4 items-center mb-4 text-sm text-gray-500">
              <div className="flex gap-1 items-center">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs tracking-wide">
                  {' '}
                  {formatDate(noticia.fecha)}
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <Tag className="w-4 h-4" />
                <span className="tracking-wide">
                  {/* {noticia.categoria ?? 'Redacción CGE'} */}
                  {noticia.id}
                </span>
              </div>
            </div>
            <Link href={`/noticias/${noticia.slug}`}>
              <h4 className="mb-3 text-lg font-semibold leading-7 text-gray-900 transition-colors duration-200 hover:text-green-900">
                {noticia.titulo}
              </h4>
            </Link>
            <p
              className="mb-4 text-sm leading-relaxed text-gray-600"
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
