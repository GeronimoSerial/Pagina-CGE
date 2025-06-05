"use client";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HeadlessPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const [isPrevLoading, setIsPrevLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const handlePageChange = (page: number) => {
    const isNext = page > currentPage;
    const setLoading = isNext ? setIsNextLoading : setIsPrevLoading;

    setLoading(true);
    onPageChange(page);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
      {" "}
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPrevLoading}
        className="flex items-center gap-1 md:gap-2 h-9 px-2 md:px-4 transition-transform active:scale-95"
      >
        {isPrevLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        <span className="hidden md:inline">Anterior</span>
      </Button>
      <span className="text-sm text-gray-600 min-w-[100px] text-center">
        {currentPage} de {totalPages}
      </span>{" "}
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isNextLoading}
        className="flex items-center gap-1 md:gap-2 h-9 px-2 md:px-4 transition-transform active:scale-95 "
      >
        <span className="hidden md:inline">Siguiente</span>
        {isNextLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    </div>
  );
};
