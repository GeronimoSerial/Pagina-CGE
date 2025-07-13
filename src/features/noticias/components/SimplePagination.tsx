'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function SimplePagination({
  currentPage,
  totalPages,
}: SimplePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/noticias?${params.toString()}`);
  };

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    const start = Math.max(1, currentPage - 2);
    return start + i;
  }).filter((page) => page <= totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Anterior
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-[#3D8B37] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}
