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
    <div
      className={cn('flex flex-col items-center space-y-6 mt-12', className)}
    >
      {/* Información de página actual */}
      <div className="text-center text-gray-600">
        <p className="text-sm">
          Página{' '}
          <span className="font-semibold text-[#3D8B37]">{currentPage}</span> de{' '}
          <span className="font-semibold">{totalPages}</span>
        </p>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-center space-x-4">
        {/* Botón página anterior */}
        {hasPrevPage && (
          <Link
            href={prevPage === 1 ? '/noticias' : `/noticias/page/${prevPage}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#3D8B37] hover:border-[#3D8B37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Página anterior
          </Link>
        )}

        {/* Botón página siguiente */}
        {hasNextPage && (
          <Link
            href={`/noticias/page/${nextPage}`}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-[#3D8B37] rounded-lg hover:bg-[#2d6b29] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            Página siguiente
            <svg
              className="w-4 h-4 ml-2"
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
          </Link>
        )}
      </div>

      {/* Navegación numérica adicional para páginas cercanas (opcional) */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {/* Primera página */}
          {currentPage > 2 && (
            <>
              <Link
                href="/noticias"
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === 1
                    ? 'bg-[#3D8B37] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#3D8B37]',
                )}
              >
                1
              </Link>
              {currentPage > 3 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Página anterior */}
          {hasPrevPage && currentPage > 1 && (
            <Link
              href={prevPage === 1 ? '/noticias' : `/noticias/page/${prevPage}`}
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {prevPage}
            </Link>
          )}

          {/* Página actual */}
          <span className="px-3 py-2 text-sm font-medium bg-[#3D8B37] text-white rounded-md">
            {currentPage}
          </span>

          {/* Página siguiente */}
          {hasNextPage && (
            <Link
              href={`/noticias/page/${nextPage}`}
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
            >
              {nextPage}
            </Link>
          )}

          {/* Última página */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
              <Link
                href={`/noticias/page/${totalPages}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#3D8B37] transition-colors"
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
