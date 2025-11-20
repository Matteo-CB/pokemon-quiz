"use client";

import { PokemonOfTheDay, PokemonStat } from "@/lib/getPokemonOfTheDay";
import { SparklesText } from "./ui/sparkles-text";
import Image from "next/image";
import { ShowdownSprite } from "./ShowdownSprite";
import { useTranslations, useLocale } from "next-intl";
import { ShineBorder } from "./ui/shine-border";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  pokemon: PokemonOfTheDay;
}

function getStatColor(value: number): string {
  if (value < 50) return "bg-red-500";
  if (value < 100) return "bg-orange-500";
  if (value < 150) return "bg-yellow-400";
  if (value < 200) return "bg-lime-500";
  return "bg-green-600";
}

export default function GetPokemonOfTheDayClient({
  pokemon,
}: Props): React.JSX.Element {
  const t: (key: string) => string = useTranslations("PokemonOfTheDay");
  const locale: string = useLocale();
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  const localizedName: string =
    pokemon.names.find(
      (n: { language: string; name: string }): boolean => n.language === locale
    )?.name ??
    pokemon.names.find(
      (n: { language: string; name: string }): boolean => n.language === "en"
    )?.name ??
    pokemon.names[0]?.name;

  const localizedDescription: string =
    pokemon.descriptions.find(
      (d: { language: string; text: string }): boolean => d.language === locale
    )?.text ??
    pokemon.descriptions.find(
      (d: { language: string; text: string }): boolean => d.language === "en"
    )?.text ??
    "No description available.";

  return (
    <div className="relative text-center bg-linear-to-br from-neutral-900 to-neutral-950 p-7 mt-0 m-3 rounded-xl">
      <ShineBorder shineColor={["#7B2FF7", "#F107A3", "#FF6FB5"]} />
      <SparklesText className="text-4xl">{t("title")}</SparklesText>
      <h3 className="text-xl font-semibold">{localizedName}</h3>

      <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-start md:gap-10">
        <div className="md:w-1/2">
          <div className="flex justify-center gap-6 my-4 h-32">
            <ShowdownSprite src={pokemon.sprite} alt={localizedName} />
            <ShowdownSprite
              src={pokemon.shiny}
              alt={`${localizedName} shiny`}
            />
          </div>
          <p className="mt-4 italic max-w-[800px] text-neutral-400">
            {localizedDescription}
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <Image
              src={`/types/${pokemon.type1}.svg`}
              alt={pokemon.type1}
              width={32}
              height={32}
              className="h-32 w-32"
            />
            {pokemon.type2 && (
              <Image
                src={`/types/${pokemon.type2}.svg`}
                alt={pokemon.type2}
                width={32}
                height={32}
                className="h-32 w-32"
              />
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-0 md:w-1/2 flex flex-col items-center">
          <button
            type="button"
            className="flex md:hidden justify-between items-center w-full bg-neutral-800 p-3 rounded-lg mb-4"
            onClick={(): void => setIsStatsOpen(!isStatsOpen)}
          >
            <span className="font-bold">{t("stats.toggleTitle")}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isStatsOpen && "rotate-180"
              )}
            />
          </button>

          <ul
            className={cn(
              "space-y-3 max-w-md mx-auto md:mx-0 px-4 w-full",
              isStatsOpen ? "block" : "hidden",
              "md:block"
            )}
          >
            {pokemon.stats.map((s: PokemonStat): React.JSX.Element => {
              const percentage: number = Math.min((s.value / 255) * 100, 100);
              const colorClass: string = getStatColor(s.value);

              return (
                <li key={s.name} className="text-left">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{t(`stats.${s.name}`)}</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded h-4 overflow-hidden">
                    <div
                      className={`h-4 ${colorClass} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
