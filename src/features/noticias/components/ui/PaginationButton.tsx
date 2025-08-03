import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  className?: string;
}

export default function PaginationButton({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  className,
}: PaginationButtonProps) {
  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;

  return (
    <div className={cn('flex flex-col items-center gap-6 mt-12', className)}>
      {/* Información de página actual */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Página <span className="font-bold text-[#3D8B37]">{currentPage}</span>{' '}
          de <span className="font-bold text-gray-800">{totalPages}</span>
        </p>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center gap-3">
        {/* Botón página anterior */}
        {hasPrevPage && (
          <Link
            href={prevPage === 1 ? '/noticias' : `/noticias/page/${prevPage}`}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#f8f8f8] hover:text-[#3D8B37] hover:border-[#3D8B37] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-1 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </Link>
        )}

        {/* Navegación numérica para dispositivos móviles */}
        <div className="flex sm:hidden items-center gap-1">
          {hasPrevPage && (
            <Link
              href={prevPage === 1 ? '/noticias' : `/noticias/page/${prevPage}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {prevPage}
            </Link>
          )}

          <span className="px-3 py-1.5 text-sm font-medium bg-[#3D8B37] text-white rounded-md">
            {currentPage}
          </span>

          {hasNextPage && (
            <Link
              href={`/noticias/page/${nextPage}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {nextPage}
            </Link>
          )}
        </div>

        {/* Botón página siguiente */}
        {hasNextPage && (
          <Link
            href={`/noticias/page/${nextPage}`}
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-[#3D8B37] rounded-lg hover:bg-[#2d6b29] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-1 shadow-md hover:shadow-lg"
          >
            Siguiente
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Navegación numérica para pantallas más grandes */}
      {totalPages > 1 && (
        <div className="hidden sm:flex items-center gap-1">
          {/* Primera página */}
          {currentPage > 2 && (
            <>
              <Link
                href="/noticias"
                className={cn(
                  'px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors',
                  currentPage === 1
                    ? 'bg-[#3D8B37] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#3D8B37]',
                )}
              >
                1
              </Link>
              {currentPage > 3 && (
                <span className="px-2 py-1.5 text-gray-400">•••</span>
              )}
            </>
          )}

          {/* Página anterior */}
          {hasPrevPage && currentPage > 1 && (
            <Link
              href={prevPage === 1 ? '/noticias' : `/noticias/page/${prevPage}`}
              className="px-3.5 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {prevPage}
            </Link>
          )}

          {/* Página actual */}
          <span className="px-3.5 py-1.5 text-sm font-medium bg-[#3D8B37] text-white rounded-md shadow-inner">
            {currentPage}
          </span>

          {/* Página siguiente */}
          {hasNextPage && (
            <Link
              href={`/noticias/page/${nextPage}`}
              className="px-3.5 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {nextPage}
            </Link>
          )}

          {/* Última página */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 py-1.5 text-gray-400">•••</span>
              )}
              <Link
                href={`/noticias/page/${totalPages}`}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
