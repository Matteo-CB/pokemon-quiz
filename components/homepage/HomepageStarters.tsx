"use client";

import { useState, useEffect } from "react";
import { validStarters } from "@/lib/validStarter";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";

interface Pokemon {
  id: number;
  name: string;
  names: Record<string, string>;
  sprite: string;
  isShiny: boolean;
}

const StarterCardSkeleton: React.FC = () => (
  <div className="relative flex flex-col items-center p-4 rounded-xl border border-neutral-800 bg-neutral-800/30 min-h-44 justify-center">
    <div className="w-24 h-24 bg-neutral-700 rounded-md animate-pulse" />
    <div className="w-20 h-4 bg-neutral-700 rounded-md mt-2 animate-pulse" />
    <ShineBorder
      shineColor={["#505050", "#707070", "#909090"]}
      className="rounded-xl"
    />
  </div>
);

export default function HomepageStarters(): React.JSX.Element {
  const t: (key: string) => string = useTranslations("HomePage.starters");
  const tAlt: (key: string) => string = useTranslations("AltText");
  const locale: string = useLocale();

  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [spritesLoaded, setSpritesLoaded] = useState<boolean>(false);

  useEffect((): void => {
    const chosen: string[] = validStarters
      .sort((): number => 0.5 - Math.random())
      .slice(0, 3);

    const shinyIndex: number = Math.floor(Math.random() * 3);

    Promise.all(
      chosen.map(async (name: string, index: number): Promise<Pokemon> => {
        const res: Response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );
        const data: any = await res.json();

        const speciesRes: Response = await fetch(data.species.url);
        const speciesData: any = await speciesRes.json();
        const namesDict: Record<string, string> = {};
        speciesData.names.forEach(
          (n: { language: { name: string }; name: string }): void => {
            namesDict[n.language.name] = n.name;
          }
        );

        const isShiny: boolean = index === shinyIndex;
        const sprite: string =
          isShiny && data.sprites.front_shiny
            ? data.sprites.front_shiny
            : data.sprites.front_default;

        return {
          id: data.id,
          name: data.name,
          names: namesDict,
          sprite: sprite,
          isShiny: isShiny,
        } as Pokemon;
      })
    ).then(async (results: Pokemon[]): Promise<void> => {
      await Promise.all(
        results.map(
          (p: Pokemon): Promise<void> =>
            new Promise<void>((resolve): void => {
              const img: HTMLImageElement = new Image();
              img.src = p.sprite;
              const timer: NodeJS.Timeout = setTimeout(
                (): void => resolve(),
                3000
              );
              img.onload = (): void => {
                clearTimeout(timer);
                resolve();
              };
              img.onerror = (): void => {
                clearTimeout(timer);
                resolve();
              };
            })
        )
      );
      setStarters(results);
      setSpritesLoaded(true);
    });
  }, [locale]);

  return (
    <section className="w-full py-16">
      <div className="relative w-full max-w-4xl mx-auto p-8 md:p-12 bg-neutral-950/40 rounded-2xl shadow-2xl shadow-black/20 border border-neutral-800 text-center ">
        <ShineBorder
          shineColor={["#502090", "#A03070", "#D06090"]} // Couleurs plus profondes pour le cadre
          className="rounded-2xl"
        />

        <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-neutral-50 drop-shadow-lg">
          {t("title")}
        </h3>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-10">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {!spritesLoaded && (
            <>
              <StarterCardSkeleton />
              <StarterCardSkeleton />
              <StarterCardSkeleton />
            </>
          )}

          {spritesLoaded &&
            starters.map(
              (p: Pokemon): React.JSX.Element => (
                <Link
                  href="/signin"
                  key={p.id}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-xl border bg-neutral-800/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none",
                    "min-h-44 justify-center",
                    "animate-in fade-in duration-500",
                    p.isShiny
                      ? "border-transparent shadow-2xl shadow-pink-500/15" // Ombre shiny plus douce
                      : "border-neutral-800 hover:border-pink-500/20" // Bordure plus douce au survol
                  )}
                >
                  {p.isShiny && (
                    <ShineBorder
                      shineColor={["#C03080", "#E060A0"]} // Couleurs shiny plus douces
                      className="rounded-xl"
                    />
                  )}

                  <img
                    src={p.sprite}
                    alt={tAlt("starterPokemon")}
                    className="w-24 h-24 object-contain"
                    width="96"
                    height="96"
                  />
                  <p className="capitalize text-base font-semibold mt-2 text-white">
                    {p.names?.[locale] ?? p.name} {p.isShiny && "✨"}
                  </p>
                </Link>
              )
            )}
        </div>
      </div>
    </section>
  );
}
