"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { DisplayPokemon } from "@/types/pokemon";
import PokedexHeader from "./PokedexHeader";
import PokedexGrid from "./PokedexGrid";
import PaginationControls from "./PaginationControls";

const POKEMON_PER_PAGE: number = 24;

interface PokedexClientProps {
  displayList: DisplayPokemon[];
  totalCount: number;
  obtainedCount: number;
}

export default function PokedexClient({
  displayList,
  totalCount,
  obtainedCount,
}: PokedexClientProps): React.JSX.Element {
  const t = useTranslations("Pokedex");
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages: number = Math.ceil(totalCount / POKEMON_PER_PAGE);

  const paginatedList: DisplayPokemon[] = displayList.slice(
    (currentPage - 1) * POKEMON_PER_PAGE,
    currentPage * POKEMON_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-7xl mx-auto">
      <PokedexHeader
        t={t}
        obtainedCount={obtainedCount}
        totalCount={totalCount}
      />
      <PokedexGrid displayList={paginatedList} locale={locale} t={t} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        t={t}
      />
    </div>
  );
}
