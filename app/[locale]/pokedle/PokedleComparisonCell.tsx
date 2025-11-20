import React from "react";
import { cn } from "@/lib/utils";
import { GuessComparisonNumber } from "@/types/pokedle";
import {
  getComparisonClass,
  getComparisonIcon,
} from "@/lib/pokedle-ui-helpers";

interface PokedleComparisonCellProps {
  value: string | number;
  comparison: GuessComparisonNumber;
}

export const PokedleComparisonCell: React.FC<PokedleComparisonCellProps> = ({
  value,
  comparison,
}) => {
  return (
    <div
      className={cn(
        "p-2 rounded-lg flex items-center justify-center gap-1",
        getComparisonClass(comparison)
      )}
    >
            {getComparisonIcon(comparison)}      <span>{value}</span>   {" "}
    </div>
  );
};
