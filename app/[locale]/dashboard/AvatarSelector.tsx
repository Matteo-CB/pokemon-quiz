"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PokemonWithNames } from "@/types/pokemon";
import { getPokemonName } from "@/lib/getPokemonName";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";

const AVATARS_PER_PAGE = 6;

function AvatarPaginationControls({
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
  return (
    <div className="flex justify-between items-center mt-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-neutral-400">
        {t("page", { current: currentPage, total: totalPages })}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function AvatarSelector({
  user,
}: {
  user: any & { pokemons: PokemonWithNames[] };
}) {
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonWithNames | null>(null);
  const [avatarPage, setAvatarPage] = useState(1);
  const t = useTranslations("AvatarSelector");
  const tPagination = useTranslations("Pagination");
  const locale = useLocale();

  const totalAvatarPages = Math.ceil(user.pokemons.length / AVATARS_PER_PAGE);
  const paginatedAvatars = user.pokemons.slice(
    (avatarPage - 1) * AVATARS_PER_PAGE,
    avatarPage * AVATARS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-32 h-32 bg-neutral-800 border-2 border-purple-500 rounded-full flex items-center justify-center overflow-hidden mx-auto">
        <Avatar className="w-28 h-28">
          <AvatarImage
            src={user.profilePicture || "/pokeball.png"}
            alt={user.name ?? ""}
            className="object-contain w-full h-full"
          />
          <AvatarFallback>
            {(user.name ?? "??").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="bg-neutral-800 p-4 rounded-md border border-neutral-700">
        <p className="font-semibold mb-2">{t("choosePokemon")}</p>
        <div className="grid grid-cols-3 gap-3 min-h-[210px] content-start">
          {paginatedAvatars.map((p: PokemonWithNames) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setSelectedPokemon(p)}
              className={cn(
                "relative p-2 rounded-md border-2 transition flex flex-col items-center bg-neutral-900 hover:bg-neutral-700",
                selectedPokemon?.id === p.id
                  ? "border-purple-500"
                  : "border-transparent",
                p.isShiny && "border-yellow-500/30"
              )}
            >
              {p.isShiny && (
                <ShineBorder
                  shineColor={["#FFD700", "#FDE047"]}
                  className="rounded-md"
                  borderWidth={1}
                />
              )}
              <Image
                src={
                  p.isShiny
                    ? p.spriteShiny ?? p.spriteDefault ?? "/pokeball.png"
                    : p.spriteDefault ?? "/pokeball.png"
                }
                alt={p.name}
                width={64}
                height={64}
                unoptimized
                className="object-contain"
              />
              <p className="text-xs capitalize mt-1 text-center truncate w-full">
                {getPokemonName(p, locale)}
              </p>
            </button>
          ))}
        </div>
        {totalAvatarPages > 1 && (
          <AvatarPaginationControls
            currentPage={avatarPage}
            totalPages={totalAvatarPages}
            onPageChange={setAvatarPage}
            t={tPagination}
          />
        )}
      </div>

      {selectedPokemon && (
        <details
          className="bg-neutral-800 p-4 rounded-md border border-neutral-700"
          open
        >
          <summary className="cursor-pointer font-semibold">
            {t("changeAvatar", {
              name: getPokemonName(selectedPokemon, locale),
            })}
          </summary>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(() => {
              const baseSprites = [
                selectedPokemon.spriteDefault,
                selectedPokemon.spriteHome,
                selectedPokemon.spriteOfficial,
                selectedPokemon.spriteDream,
                selectedPokemon.spriteBack,
                selectedPokemon.spriteShowdown,
              ].filter(Boolean) as string[];

              const shinySprites = selectedPokemon.isShiny
                ? ([
                    selectedPokemon.spriteShiny,
                    selectedPokemon.spriteBackShiny,
                    selectedPokemon.spriteShowdownShiny,
                  ].filter(Boolean) as string[])
                : [];

              const allSprites = [...baseSprites, ...shinySprites];

              return allSprites.map((spriteUrl: string, idx: number) => (
                <label
                  key={`${selectedPokemon.id}-${idx}`}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <input
                    type="radio"
                    name="profilePicture"
                    value={spriteUrl}
                    defaultChecked={user.profilePicture === spriteUrl}
                    className="hidden peer"
                  />
                  <div className="w-20 h-20 flex items-center justify-center bg-neutral-900 rounded-md border-2 border-transparent peer-checked:border-purple-500 cursor-pointer">
                    <Image
                      src={spriteUrl}
                      alt={selectedPokemon.name}
                      width={80}
                      height={80}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </label>
              ));
            })()}
          </div>
        </details>
      )}
    </div>
  );
}
