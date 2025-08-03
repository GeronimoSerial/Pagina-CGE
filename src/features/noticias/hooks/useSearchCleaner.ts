'use client';

import { useRouter } from 'next/navigation';

interface UseSearchCleanerProps {
  onClearFilters: () => void;
}

export function useSearchCleaner({ onClearFilters }: UseSearchCleanerProps) {
  const router = useRouter();

  const clearAllAndNavigate = () => {
    onClearFilters();
    router.push('/noticias');
  };

  return { clearAllAndNavigate };
}
