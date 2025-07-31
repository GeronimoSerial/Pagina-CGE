'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ArrowRight } from 'lucide-react';

interface PaginationInputProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationInput({
  currentPage,
  totalPages,
}: PaginationInputProps) {
  const [pageInput, setPageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoToPage = async () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsLoading(true);
      try {
        router.push(`/noticias/page/${page}`);
      } catch (error) {
        console.error('Error navigating to page:', error);
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const isValidPage = () => {
    const page = parseInt(pageInput);
    return page >= 1 && page <= totalPages && page !== currentPage;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 whitespace-nowrap">Ir a página:</span>
      <Input
        type="number"
        min="1"
        max={totalPages}
        placeholder={currentPage.toString()}
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-16 h-8 text-center"
        disabled={isLoading}
      />
      <Button
        onClick={handleGoToPage}
        size="sm"
        variant="outline"
        disabled={!isValidPage() || isLoading}
        className="h-8 px-2"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        ) : (
          <ArrowRight className="w-3 h-3" />
        )}
      </Button>
      <span className="text-gray-500 text-xs">de {totalPages}</span>
    </div>
  );
}
