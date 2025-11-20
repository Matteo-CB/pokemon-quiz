"use client";

import React from "react";
import { PokedleGuess } from "@/types/pokedle";
import { PokedleGuessRow } from "./PokedleGuessRow";
import { useTranslations } from "next-intl";

interface PokedleGuessGridProps {
  guesses: PokedleGuess[];
}

export const PokedleGuessGrid: React.FC<PokedleGuessGridProps> = ({
  guesses,
}) => {
  const t = useTranslations("Pokedle");

  return (
    <div className="space-y-2 overflow-x-auto bg-neutral-800/50 p-4 rounded-lg border border-neutral-700 shadow-inner">
      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-neutral-300 uppercase text-center tracking-wider min-w-[700px]">
        <span className="col-span-2">{t("header.pokemon")}</span>
        <span>{t("header.generation")}</span>
        <span>{t("header.type1")}</span>
        <span>{t("header.type2")}</span>
        <span>{t("header.height")}</span>
        <span>{t("header.weight")}</span>
      </div>

      {guesses.map((guess, index) => (
        <PokedleGuessRow key={index} guess={guess} />
      ))}
    </div>
  );
};
