"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { PokemonWithNames } from "@/types/pokemon";
import { getPokemonName } from "@/lib/getPokemonName";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";

const POKEMON_PER_PAGE = 12;

function PokemonCard({
  pokemon,
  locale,
}: {
  pokemon: PokemonWithNames;
  locale: string;
}) {
  const isShiny = pokemon.isShiny;
  return (
    <div
      className={cn(
        "relative bg-neutral-900 p-4 rounded-xl flex flex-col items-center border border-neutral-800 transition-all duration-300 hover:scale-105 hover:bg-neutral-800 shadow-lg",
        isShiny && "border-yellow-500/30 shadow-xl shadow-yellow-500/10"
      )}
    >
      {isShiny && (
        <ShineBorder
          shineColor={["#FFD700", "#FDE047", "#BF953F"]}
          className="rounded-xl"
        />
      )}
      <div className="w-24 h-24 flex items-center justify-center">
        <Image
          src={
            isShiny
              ? pokemon.spriteShiny ?? pokemon.spriteDefault ?? "/pokeball.png"
              : pokemon.spriteDefault ?? "/pokeball.png"
          }
          alt={pokemon.name}
          width={96}
          height={96}
          unoptimized
          className="object-contain"
        />
      </div>
      <p className="capitalize mt-2 text-center">
        {getPokemonName(pokemon, locale)}
      </p>
      {isShiny && (
        <span className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400">
          ✨ Shiny
        </span>
      )}
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: (key: string, values?: any) => string;
}) {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="ghost"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t("previous")}
      </Button>
      <span className="text-neutral-400">
        {t("page", { current: currentPage, total: totalPages })}
      </span>
      <Button
        variant="ghost"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("next")}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

export default function PokemonGrid({
  pokemons,
}: {
  pokemons: PokemonWithNames[];
}) {
  const tGrid = useTranslations("PokemonGrid");
  const tPagination = useTranslations("Pagination");
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(pokemons.length / POKEMON_PER_PAGE);
  const paginatedPokemons = pokemons.slice(
    (currentPage - 1) * POKEMON_PER_PAGE,
    currentPage * POKEMON_PER_PAGE
  );

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
      <h2 className="text-3xl font-bold mb-6">{tGrid("title")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[450px] content-start">
        {paginatedPokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} locale={locale} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          t={tPagination}
        />
      )}
    </div>
  );
}
