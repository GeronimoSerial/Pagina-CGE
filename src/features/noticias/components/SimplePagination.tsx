import React, { memo } from 'react';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const SimplePagination = memo(function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  // Optimización: Calcular páginas visibles de manera más eficiente
  const getVisiblePages = () => {
    const maxVisible = 5;
    const delta = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Ajustar start si end está al límite
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showFirstEllipsis = visiblePages[0] > 2;
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <nav 
      className="flex justify-center items-center gap-1 mt-8" 
      role="navigation" 
      aria-label="Paginación de noticias"
    >
      {/* Botón Anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="px-3 py-2 gap-1"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Primera página */}
      {showFirstPage && (
        <>
          <Button
            variant={1 === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={loading}
            className="px-3 py-2 min-w-[40px]"
            aria-label="Ir a página 1"
            aria-current={1 === currentPage ? "page" : undefined}
          >
            1
          </Button>
          {showFirstEllipsis && (
            <span className="px-2 py-2 text-gray-500" aria-hidden="true">
              ...
            </span>
          )}
        </>
      )}

      {/* Páginas visibles */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          disabled={loading}
          className="px-3 py-2 min-w-[40px]"
          aria-label={`Ir a página ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {/* Última página */}
      {showLastPage && (
        <>
          {showLastEllipsis && (
            <span className="px-2 py-2 text-gray-500" aria-hidden="true">
              ...
            </span>
          )}
          <Button
            variant={totalPages === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={loading}
            className="px-3 py-2 min-w-[40px]"
            aria-label={`Ir a página ${totalPages}`}
            aria-current={totalPages === currentPage ? "page" : undefined}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="px-3 py-2 gap-1"
        aria-label="Página siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Información de estado */}
      <div className="ml-4 text-sm text-gray-500 hidden md:block">
        Página {currentPage} de {totalPages}
      </div>
    </nav>
  );
});

export default SimplePagination;
