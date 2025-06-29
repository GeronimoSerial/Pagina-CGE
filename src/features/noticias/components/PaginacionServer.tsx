import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionServerProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

export default function PaginacionServer({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginacionServerProps) {
  const pageCount = Math.ceil(totalItems / pageSize);
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1 bg-white p-4 shadow-sm border border-gray-200">
        {/* Botón Anterior */}
        {onPageChange ? (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-150 disabled:opacity-50 rounded text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-medium">Anterior</span>
          </button>
        ) : (
          <Link
            href={`/noticias?page=${currentPage - 1}`}
            tabIndex={currentPage === 1 ? -1 : 0}
            aria-disabled={currentPage === 1}
            className="flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-150 disabled:opacity-50 rounded text-sm"
            style={{
              pointerEvents: currentPage === 1 ? 'none' : undefined,
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-medium">Anterior</span>
          </Link>
        )}

        {/* Números de página */}
        <div className="flex items-center mx-4">
          {pages.map((page) =>
            onPageChange ? (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2 py-1 mx-0.5 font-medium transition-all duration-150 rounded text-sm ${
                  currentPage === page
                    ? 'bg-[#3D8B37] text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
                disabled={currentPage === page}
              >
                {page}
              </button>
            ) : (
              <Link
                key={page}
                href={`/noticias?page=${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`px-2 py-1 mx-0.5 font-medium transition-all duration-150 rounded text-sm ${
                  currentPage === page
                    ? 'bg-[#3D8B37] text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                }`}
                style={{
                  pointerEvents: currentPage === page ? 'none' : undefined,
                  opacity: currentPage === page ? 0.7 : 1,
                }}
              >
                {page}
              </Link>
            ),
          )}
        </div>

        {/* Botón Siguiente */}
        {onPageChange ? (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
            className="flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-150 disabled:opacity-50 rounded text-sm"
          >
            <span className="font-medium">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={`/noticias?page=${currentPage + 1}`}
            tabIndex={currentPage === pageCount ? -1 : 0}
            aria-disabled={currentPage === pageCount}
            className="flex items-center space-x-2 px-2 py-1 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-150 disabled:opacity-50 rounded text-sm"
            style={{
              pointerEvents: currentPage === pageCount ? 'none' : undefined,
              opacity: currentPage === pageCount ? 0.5 : 1,
            }}
          >
            <span className="font-medium">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
