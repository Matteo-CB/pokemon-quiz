import React from "react";
import { GuessComparison, GuessComparisonNumber } from "@/types/pokedle";
import {
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export const getComparisonClass = (
  value: GuessComparison | GuessComparisonNumber
): string => {
  if (value === "correct") return "bg-green-500";
  if (value === "partial") return "bg-yellow-500";
  if (value === "higher" || value === "lower") return "bg-red-500";
  return "bg-neutral-700";
};

export const getComparisonIcon = (
  value: GuessComparison | GuessComparisonNumber
): React.ReactNode => {
  if (value === "correct") return <CheckCircle className="h-4 w-4" />;
  if (value === "higher") return <ArrowUp className="h-4 w-4" />;
  if (value === "lower") return <ArrowDown className="h-4 w-4" />;
  if (value === "partial") return <Sparkles className="h-4 w-4" />;
  return <XCircle className="h-4 w-4" />;
};
