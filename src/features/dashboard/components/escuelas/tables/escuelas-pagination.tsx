'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/shared/ui/pagination';

interface EscuelasPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
}

export function EscuelasPagination({
  currentPage,
  totalItems,
  pageSize,
}: EscuelasPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      onChange={handlePageChange}
    />
  );
}
