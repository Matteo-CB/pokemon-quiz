"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TFunction = (key: string, values?: any) => string;

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: TFunction;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: PaginationControlsProps): React.JSX.Element {
  const hasPrevPage: boolean = currentPage > 1;
  const hasNextPage: boolean = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="ghost"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t("pagination.previous")}
      </Button>
      <span className="text-neutral-400">
        {t("pagination.page", {
          current: currentPage,
          total: totalPages,
        })}
      </span>
      <Button
        variant="ghost"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("pagination.next")}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
