import { Card, CardContent } from '@/shared/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { getPortada } from '@/features/noticias/services/noticias';
import { Noticia } from '@/shared/interfaces';

export function RegularNewsCard({ noticia }: { noticia: Noticia }) {
  return (
    <Card
      key={noticia.id}
      className="overflow-hidden bg-white rounded-xl border-none shadow-none transition-all duration-300 group hover:shadow-lg"
    >
      <CardContent className="p-0">
        <div className="overflow-hidden relative rounded-t-xl">
          <img
            className="object-cover w-full h-48 transition-transform duration-300 sm:h-56 group-hover:scale-105"
            alt={noticia.titulo}
            src={getPortada({ noticia }) || undefined}
          />
          <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/10" />
        </div>
        <div className="p-6">
          <div className="flex gap-4 items-center mb-4 text-sm text-gray-500">
            <div className="flex gap-1 items-center">
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs tracking-wide">
                {' '}
                {format(new Date(noticia.fecha), 'EEE, d MMMM yyyy', {
                  locale: es,
                })}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Tag className="w-4 h-4" />
              <span className="tracking-wide">
                {noticia.categoria ?? 'Redacción CGE'}
              </span>
            </div>
          </div>
          <a href={`/noticias/${noticia.slug}`}>
            <h4 className="mb-3 text-lg font-semibold leading-7 text-gray-900 transition-colors duration-200 hover:text-green-900">
              {noticia.titulo}
            </h4>
          </a>
          <p
            className="mb-4 text-sm leading-relaxed text-gray-600"
            title={noticia.resumen}
          >
            {noticia.resumen}
          </p>
          <div className="flex items-center text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-green-900">
            <a
              href={`/noticias/${noticia.slug}`}
              className="inline-flex gap-2 items-center hover:underline"
            >
              Leer más
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
