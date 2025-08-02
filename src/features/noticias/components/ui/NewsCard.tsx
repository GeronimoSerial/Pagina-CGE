import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/shared/interfaces';
import { cn } from '@/shared/lib/utils';

interface NewsCardProps {
  noticia: NewsItem;
  priority?: boolean;
  className?: string;
}

export default function NewsCard({
  noticia,
  priority = false,
  className,
}: NewsCardProps) {
  const { titulo, resumen, fecha, categoria, esImportante, slug, portada } =
    noticia;

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article
      className={cn(
        'group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden',
        esImportante && 'ring-2 ring-[#3D8B37] ring-opacity-50',
        className,
      )}
    >
      <Link href={`/noticias/${slug}`} className="block">
        {/* Imagen de portada */}
        {portada?.url && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={portada.url}
              alt={titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {esImportante && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3D8B37] text-white">
                  Destacada
                </span>
              </div>
            )}
          </div>
        )}

        {/* Contenido */}
        <div className="p-4 space-y-3">
          {/* Categoría y fecha */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {categoria && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium uppercase tracking-wider">
                {categoria}
              </span>
            )}
            <time dateTime={fecha} className="ml-auto">
              {formatDate(fecha)}
            </time>
          </div>

          {/* Título */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-[#3D8B37] transition-colors line-clamp-2">
            {titulo}
          </h3>

          {/* Resumen */}
          {resumen && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {resumen}
            </p>
          )}

          {/* Call to action */}
          <div className="pt-2">
            <span className="inline-flex items-center text-sm text-[#3D8B37] font-medium group-hover:text-[#2d6b29] transition-colors">
              Leer más
              <svg
                className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
