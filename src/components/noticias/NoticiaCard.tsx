import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import { formatearFecha } from '@/src/lib/utils';
import { getNoticiaPortada } from '@/src/services/noticias';
import { Noticia } from '@/src/interfaces';

interface NoticiaCardProps {
  noticia: Noticia;
}

export function NoticiaCard({ noticia }: NoticiaCardProps) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/noticias/${noticia.slug}`}>
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={getNoticiaPortada({ noticia }) || ''}
          alt={noticia.titulo}
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{noticia.categoria}</Badge>
          {noticia.esImportante && (
            <Badge variant="destructive">Importante</Badge>
          )}
        </div>
        <Link href={`/noticias/${noticia.slug}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {noticia.titulo}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {noticia.resumen}
        </p>
        <span className="text-xs text-gray-500">
          {formatearFecha(noticia.fecha)}
        </span>
      </div>
    </div>
  );
}
