"use client";

import { useState } from "react";
import type { User, Pokemon } from "@prisma/client";
import type { PokemonNames } from "@/types/pokemon";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";
import { useTranslations, useLocale } from "next-intl";
import { getPokemonName } from "@/lib/getPokemonName";
import { getLevelFromScore } from "@/lib/leveling-system";
import { BorderBeam } from "@/components/ui/border-beam";

const POKEMON_PER_PAGE = 12;

type PokemonWithTypedNames = Pokemon & { names: PokemonNames };
type UserWithPokemons = User & { pokemons: PokemonWithTypedNames[] };
type TFunction = (key: string, values?: any) => string;

const getLevelStyle = (level: number) => {
  if (level >= 180) {
    return {
      badgeBorder: "border-fuchsia-400",
      badgeBg: "bg-neutral-900",
      beamFrom: "#FF00FF",
      beamTo: "#00FFFF",
      aura: "bg-fuchsia-500/10",
      textShadow: "0 0 10px #FF00FF, 0 0 20px #00FFFF",
    };
  }
  if (level >= 160) {
    return {
      badgeBorder: "border-purple-400",
      badgeBg: "bg-purple-950/80",
      beamFrom: "#A000FF",
      beamTo: "#E060FF",
      aura: "bg-purple-500/10",
      textShadow: "0 0 10px #A000FF",
    };
  }
  if (level >= 140) {
    return {
      badgeBorder: "border-cyan-400",
      badgeBg: "bg-cyan-950/80",
      beamFrom: "#22D3EE",
      beamTo: "#06B6D4",
      aura: "bg-cyan-500/10",
      textShadow: "0 0 10px #22D3EE",
    };
  }
  if (level >= 120) {
    return {
      badgeBorder: "border-red-400",
      badgeBg: "bg-red-950/80",
      beamFrom: "#F87171",
      beamTo: "#DC2626",
      aura: "bg-red-500/10",
      textShadow: "0 0 10px #F87171",
    };
  }
  if (level >= 100) {
    return {
      badgeBorder: "border-pink-400",
      badgeBg: "bg-pink-950/80",
      beamFrom: "#EC4899",
      beamTo: "#F472B6",
      aura: "bg-pink-500/10",
      textShadow: "0 0 10px #EC4899",
    };
  }
  if (level >= 80) {
    return {
      badgeBorder: "border-yellow-400",
      badgeBg: "bg-yellow-950/80",
      beamFrom: "#FDE047",
      beamTo: "#FFD700",
      aura: "bg-yellow-500/10",
      textShadow: "0 0 10px #FDE047",
    };
  }
  if (level >= 60) {
    return {
      badgeBorder: "border-emerald-400",
      badgeBg: "bg-emerald-950/80",
      beamFrom: "#34D399",
      beamTo: "#A7F3D0",
      aura: "bg-emerald-500/10",
      textShadow: "0 0 10px #34D399",
    };
  }
  if (level >= 40) {
    return {
      badgeBorder: "border-blue-400",
      badgeBg: "bg-blue-950/80",
      beamFrom: "#3B82F6",
      beamTo: "#60A5FA",
      aura: "bg-blue-500/10",
      textShadow: "0 0 10px #3B82F6",
    };
  }
  if (level >= 20) {
    return {
      badgeBorder: "border-gray-400",
      badgeBg: "bg-gray-950/80",
      beamFrom: "#9CA3AF",
      beamTo: "#E5E7EB",
      aura: "bg-gray-500/10",
      textShadow: "0 0 10px #9CA3AF",
    };
  }
  return {
    badgeBorder: "border-orange-400",
    badgeBg: "bg-orange-950/80",
    beamFrom: "#F97316",
    beamTo: "#FB923C",
    aura: "bg-orange-500/10",
    textShadow: "0 0 10px #F97316",
  };
};

function UserProfileHeader({
  user,
  t,
  locale,
  currentLevel,
  tRewards,
}: {
  user: User;
  t: TFunction;
  locale: string;
  currentLevel: number;
  tRewards: TFunction;
}) {
  const style = getLevelStyle(currentLevel);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-900 to-neutral-950 p-6 shadow-2xl shadow-black/30 mb-10">
      <ShineBorder
        shineColor={["#A000FF", "#C000FF", "#E060FF"]}
        className="rounded-2xl"
      />
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Image
            src={user.profilePicture ?? "/default-avatar.png"}
            alt={user.name ?? "Avatar"}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-1">
              {t("title", { name: user.name })}
            </h1>
            {user.bio && (
              <p className="text-base italic text-neutral-300 mb-3">
                {user.bio}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase font-medium text-neutral-400">
                  {t("score")}
                </span>
                <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-semibold">
                  {user.score.toLocaleString(locale)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm uppercase font-medium text-neutral-400">
                  {t("pokeMoney")}
                </span>
                <span className="flex items-center bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-sm font-semibold">
                  <Image
                    src="/pokemoney.png"
                    alt="PokéMoney"
                    width={20}
                    height={20}
                    className="h-5 w-5 mr-1.5 object-contain"
                    unoptimized
                  />
                  {user.pokeMoney.toLocaleString(locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center shrink-0 z-10 md:pl-6">
          <div
            className={cn(
              "relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg overflow-hidden",
              style.badgeBorder,
              style.badgeBg
            )}
          >
            <BorderBeam
              colorFrom={style.beamFrom}
              colorTo={style.beamTo}
              duration={7}
              borderWidth={3}
              className="rounded-full"
            />
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-md opacity-70",
                style.aura
              )}
            />
            <span
              className="relative text-white text-4xl font-extrabold"
              style={{
                textShadow: style.textShadow,
              }}
            >
              {currentLevel}
            </span>
          </div>
          <span className="text-lg font-semibold text-neutral-300 mt-2 z-10">
            {tRewards("currentLevelShort")}
          </span>
        </div>
      </div>
    </div>
  );
}

function PokemonCard({
  pokemon,
  locale,
}: {
  pokemon: PokemonWithTypedNames;
  locale: string;
}) {
  const isShiny = pokemon.isShiny;
  const name = getPokemonName(pokemon, locale);

  // --- CORRECTION ICI ---
  const spriteSrc = isShiny ? pokemon.spriteShiny : pokemon.spriteDefault;

  return (
    <div
      key={pokemon.id}
      className={cn(
        "relative overflow-hidden bg-neutral-900 p-4 rounded-xl flex flex-col items-center border border-neutral-800 transition-all duration-300 hover:scale-105 hover:bg-neutral-800 shadow-lg",
        isShiny && "border-yellow-500/30 shadow-xl shadow-yellow-500/10"
      )}
    >
      {isShiny && (
        <ShineBorder
          shineColor={["#FFD700", "#FDE047", "#BF953F"]}
          className="rounded-xl"
        />
      )}
      <Image
        src={spriteSrc ?? "/default.png"}
        alt={name}
        width={80}
        height={80}
        className="w-20 h-20 mb-2"
      />
      <p className="capitalize text-center">{name}</p>
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
  t: TFunction;
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
        {t("pagination.previous")}
      </Button>

      <span className="text-neutral-400">
        {t("pagination.page", {
          current: currentPage,
          total: totalPages,
        })}
      </span>

      <Button
        variant="ghost"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t("pagination.next")}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

interface PlayerProfileClientProps {
  user: UserWithPokemons;
}

export default function PlayerProfileClient({
  user,
}: PlayerProfileClientProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("PlayerProfile");
  const tRewards = useTranslations("RewardsPage");
  const locale = useLocale();

  const pokemons = user.pokemons;
  const totalPages = Math.max(1, Math.ceil(pokemons.length / POKEMON_PER_PAGE));

  const paginatedPokemons = pokemons.slice(
    (currentPage - 1) * POKEMON_PER_PAGE,
    currentPage * POKEMON_PER_PAGE
  );

  const currentLevel = getLevelFromScore(user.score);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-5xl mx-auto">
      <UserProfileHeader
        user={user}
        t={t}
        locale={locale}
        currentLevel={currentLevel}
        tRewards={tRewards}
      />

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-6">{t("pokemons")}</h2>

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
            t={t}
          />
        )}
      </div>
    </div>
  );
}
