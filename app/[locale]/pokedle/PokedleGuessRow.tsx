import React from "react";
import { PokedleGuess } from "@/types/pokedle";
import { cn } from "@/lib/utils";
import { getComparisonClass } from "@/lib/pokedle-ui-helpers";
import PokemonTypeIcon from "./PokemonTypeIcon";
import { PokedleComparisonCell } from "./PokedleComparisonCell";

interface PokedleGuessRowProps {
  guess: PokedleGuess;
}

export const PokedleGuessRow: React.FC<PokedleGuessRowProps> = ({ guess }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-2 min-w-[700px] text-sm",
        "animate-in fade-in-50 duration-300"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg flex items-center gap-2 col-span-2 bg-neutral-700"
        )}
      >
        <img src={guess.sprite} alt={guess.guessName} className="h-8 w-8" />
        <span className="capitalize">{guess.guessName}</span>
      </div>

      <PokedleComparisonCell
        value={guess.generation.toString()}
        comparison={guess.generationComparison}
      />

      <div
        className={cn(
          "p-2 rounded-lg flex items-center justify-center",
          getComparisonClass(guess.typeComparison)
        )}
      >
        <PokemonTypeIcon type={guess.type1} className="h-6 w-auto" />
      </div>

      <div
        className={cn(
          "p-2 rounded-lg flex items-center justify-center",
          getComparisonClass(guess.typeComparison)
        )}
      >
        {guess.type2 ? (
          <PokemonTypeIcon type={guess.type2} className="h-6 w-auto" />
        ) : (
          <span className="text-neutral-400">—</span>
        )}
      </div>

      <PokedleComparisonCell
        value={`${guess.height.toFixed(1)}m`}
        comparison={guess.heightComparison}
      />

      <PokedleComparisonCell
        value={`${guess.weight.toFixed(1)}kg`}
        comparison={guess.weightComparison}
      />
    </div>
  );
};
