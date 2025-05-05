import React from "react";
import RCPagination from "rc-pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
}

const localeES = {
  items_per_page: "/ página",
  jump_to: "Ir a",
  jump_to_confirm: "confirmar",
  page: "Página",
  prev_page: "Página anterior",
  next_page: "Página siguiente",
  prev_5: "5 páginas anteriores",
  next_5: "5 páginas siguientes",
  prev_3: "3 páginas anteriores",
  next_3: "3 páginas siguientes",
};

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onChange,
  className,
}: PaginationProps) => {
  const itemRender = (page: number, type: string, element: React.ReactNode) => {
    if (type === "prev") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-9 h-9 p-0"
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      );
    }
    if (type === "next") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-9 h-9 p-0"
          title="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      );
    }
    if (type === "jump-prev" || type === "jump-next") {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0 hover:bg-transparent"
          title={
            type === "jump-prev" ? "Páginas anteriores" : "Páginas siguientes"
          }
        >
          •••
        </Button>
      );
    }
    return (
      <Button
        variant={currentPage === page ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-9 h-9 p-0",
          currentPage === page && "bg-[#3D8B37] hover:bg-[#2D6A27]"
        )}
        title={`Página ${page}`}
      >
        {page}
      </Button>
    );
  };

  return (
    <RCPagination
      current={currentPage}
      total={totalItems}
      pageSize={pageSize}
      onChange={onChange}
      itemRender={itemRender}
      locale={localeES}
      showLessItems
      // locale={localeES}
      className={cn(
        "flex items-center gap-2",
        "[&>li]:list-none [&>li]:m-0",
        "[&>.rc-pagination-disabled]:opacity-50 [&>.rc-pagination-disabled]:cursor-not-allowed",
        className
      )}
    />
  );
};

export { Pagination };
