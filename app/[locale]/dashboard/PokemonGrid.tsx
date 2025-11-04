"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { PokemonWithNames } from "@/types/pokemon";
import { getPokemonName } from "@/lib/getPokemonName";

export default function PokemonGrid({
  pokemons,
}: {
  pokemons: PokemonWithNames[];
}) {
  const t = useTranslations("PokemonGrid");
  const locale = useLocale();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {pokemons.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-900 p-4 rounded-xl flex flex-col items-center"
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <Image
                src={p.spriteDefault ?? "/pokeball.png"}
                alt={p.name}
                width={96}
                height={96}
                unoptimized
                className="object-contain"
              />
            </div>
            <p className="capitalize mt-2">{getPokemonName(p, locale)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
