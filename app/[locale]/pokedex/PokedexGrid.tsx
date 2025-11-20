"use client";

import type { DisplayPokemon, PokemonNames } from "@/types/pokemon";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";
import { Lock } from "lucide-react";
import { getPokemonName } from "@/lib/getPokemonName";

type TFunction = (key: string, values?: any) => string;

interface PokedexGridProps {
  displayList: DisplayPokemon[];
  locale: string;
  t: TFunction;
}

function PokemonCard({
  pokemon,
  locale,
  t,
}: {
  pokemon: DisplayPokemon;
  locale: string;
  t: TFunction;
}): React.JSX.Element {
  const isObtained: boolean = !!pokemon.obtainedData;
  const isShiny: boolean = pokemon.obtainedData?.isShiny ?? false;

  // --- CORRECTION DE LA LOGIQUE DU SPRITE ---
  const sprite: string = isObtained
    ? isShiny
      ? // 1. Essaye le sprite shiny
        pokemon.obtainedData!.spriteShiny ??
        // 2. Sinon, essaye le sprite par défaut
        pokemon.obtainedData!.spriteDefault ??
        // 3. Sinon, utilise le sprite de l'API (qui a déjà un fallback)
        pokemon.apiData.sprite
      : // 1. Essaye le sprite par défaut
        pokemon.obtainedData!.spriteDefault ??
        // 2. Sinon, utilise le sprite de l'API
        pokemon.apiData.sprite
    : // Non obtenu, utilise le sprite de l'API (qui a un fallback /pokeball.png)
      pokemon.apiData.sprite;

  const name: string = isObtained
    ? getPokemonName(pokemon.obtainedData!, locale)
    : t("unknown");

  const nationalId: string = `#${pokemon.apiData.id
    .toString()
    .padStart(4, "0")}`;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-900 p-4 rounded-xl flex flex-col items-center justify-between border border-neutral-800 transition-all duration-300 shadow-lg h-48",
        isObtained
          ? "hover:bg-neutral-800"
          : "bg-neutral-950 border-neutral-800",
        isObtained &&
          isShiny &&
          "border-yellow-500/30 shadow-xl shadow-yellow-500/10"
      )}
    >
      {!isObtained && (
        <Lock className="absolute top-3 right-3 h-4 w-4 text-neutral-600" />
      )}
      {isObtained && isShiny && (
        <ShineBorder
          shineColor={["#FFD700", "#FDE047", "#BF953F"]}
          className="rounded-xl"
        />
      )}

      <div className="w-24 h-24 flex items-center justify-center">
        <Image
          src={sprite}
          alt={name}
          width={96}
          height={96}
          className={cn(
            "object-contain transition-all duration-300",
            !isObtained && "brightness-0 opacity-60"
          )}
          unoptimized
        />
      </div>
      <div className="text-center">
        <p className="capitalize text-sm font-semibold">{name}</p>
        <p className="text-xs text-neutral-400">{nationalId}</p>
      </div>
    </div>
  );
}

export default function PokedexGrid({
  displayList,
  locale,
  t,
}: PokedexGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[500px] content-start">
      {displayList.map((p: DisplayPokemon) => (
        <PokemonCard key={p.apiData.id} pokemon={p} locale={locale} t={t} />
      ))}
    </div>
  );
}
