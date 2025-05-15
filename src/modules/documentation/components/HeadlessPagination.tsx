import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 md:gap-2 h-9 px-2 md:px-4"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden md:inline">Anterior</span>
      </Button>
      <span className="text-sm text-gray-600 min-w-[100px] text-center">
        {currentPage} de {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 md:gap-2 h-9 px-2 md:px-4"
      >
        <span className="hidden md:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
