"use client";

import { Pokemon } from "@/hooks/useStarters";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ShineBorder } from "./ui/shine-border";

interface StarterPickerProps {
  starters: Pokemon[];
  selected: Pokemon | null;
  onSelect: (p: Pokemon) => void;
}

export function StarterPicker({
  starters,
  selected,
  onSelect,
}: StarterPickerProps) {
  const t = useTranslations("StarterPicker");

  return (
    <div
      className={cn(
        "relative w-full max-w-lg mx-auto p-8 rounded-2xl",
        "bg-linear-to-br from-neutral-900 to-neutral-950",
        "border border-neutral-700 shadow-2xl shadow-black/30"
      )}
    >
      <ShineBorder
        shineColor={["#7B2FF7", "#F107A3", "#FF6FB5"]}
        className="rounded-2xl"
      />

      <p className="text-2xl font-extrabold mb-6 text-center text-white tracking-tight">
        {t("chooseStarter")}
      </p>

      <div className="grid grid-cols-3 gap-4">
        {starters.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => onSelect(p)}
            className={cn(
              "relative flex flex-col items-center justify-start p-4 rounded-xl border-2 bg-neutral-800/60 transition-all duration-300 ease-in-out transform hover:scale-105",
              selected?.id === p.id
                ? "border-transparent shadow-2xl shadow-pink-500/30"
                : "border-neutral-700 hover:border-pink-500/40"
            )}
            style={{ minHeight: "160px" }}
          >
            {selected?.id === p.id && (
              <ShineBorder
                shineColor={["#F107A3", "#FF6FB5"]}
                className="rounded-xl"
              />
            )}

            <img
              src={p.sprite}
              alt={p.name}
              className="h-24 w-24 object-contain"
            />

            <p className="capitalize text-base font-semibold mt-2 text-white">
              {p.name} {p.isShiny && "✨"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
