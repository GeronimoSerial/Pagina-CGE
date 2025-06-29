import Link from 'next/link';

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
    <nav className="flex gap-2 mt-6" aria-label="Paginación">
      {pages.map((page) =>
        onPageChange ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border text-sm ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ) : (
          <Link
            key={page}
            href={`/noticias?page=${page}`}
            className={`px-3 py-1 rounded border text-sm ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ),
      )}
    </nav>
  );
}
