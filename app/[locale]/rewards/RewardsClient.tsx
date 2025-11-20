"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { User } from "@prisma/client";
import type { EnrichedRewardPokemon } from "@/lib/leveling-system"; // Modifié
import { getTotalScoreForLevel } from "@/lib/leveling-system";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Check,
  Lock,
  Gift,
  Trophy,
  Swords,
  Puzzle,
  BookMarked,
  Users,
} from "lucide-react";
import { GameModeCard } from "@/components/homepage/GameModeCard";

type TFunction = (key: string, values?: any) => string;
type RewardEntry = [number, EnrichedRewardPokemon]; // Modifié

interface RewardsClientProps {
  user: User;
  locale: string;
  allRewards: RewardEntry[];
  initialClaimedLevels: Set<number>;
  initialCurrentLevel: number;
  scoreToNextLevel: number;
  currentScoreProgress: number;
}

const getRewardBorderClass = (
  type: EnrichedRewardPokemon["type"] // Modifié
): string => {
  switch (type) {
    case "mythical":
      return "border-purple-500 shadow-purple-500/30";
    case "legendary":
      return "border-yellow-500 shadow-yellow-500/30";
    case "pseudo":
      return "border-blue-500 shadow-blue-500/30";
    default:
      return "border-neutral-700";
  }
};

const getRewardShineColor = (
  type: EnrichedRewardPokemon["type"] // Modifié
): string[] | undefined => {
  switch (type) {
    case "mythical":
      return ["#A000FF", "#C000FF", "#E060FF"];
    case "legendary":
      return ["#FFD700", "#FDE047", "#BF953F"];
    default:
      return undefined;
  }
};

function RewardLevelRow({
  level,
  reward,
  isClaimed,
  canClaim,
  onClaim,
  t,
  locale,
}: {
  level: number;
  reward: EnrichedRewardPokemon; // Modifié
  isClaimed: boolean;
  canClaim: boolean;
  onClaim: (level: number) => void;
  t: TFunction;
  locale: string;
}): React.JSX.Element {
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const handleClaim = async (): Promise<void> => {
    if (isClaiming || isClaimed || !canClaim) return;
    setIsClaiming(true);
    await onClaim(level);
    setIsClaiming(false);
  };

  const name: string = reward.names[locale] ?? reward.name;
  const scoreNeeded: string =
    getTotalScoreForLevel(level).toLocaleString(locale);

  const spriteSrc: string = reward.isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${reward.pokemonId}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${reward.pokemonId}.png`;

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 md:gap-4 bg-neutral-900 p-4 rounded-2xl border transition-all duration-300",
        canClaim && "shadow-lg",
        isClaimed && "bg-neutral-800/50",
        !canClaim && !isClaimed && "opacity-60",
        getRewardBorderClass(reward.type)
      )}
    >
      {(reward.type !== "normal" || reward.isShiny) && (
        <ShineBorder
          shineColor={
            reward.isShiny
              ? ["#FFD700", "#FDE047", "#BF953F"]
              : getRewardShineColor(reward.type)
          }
          className="rounded-2xl"
        />
      )}
      <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-800 rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-purple-300 shrink-0">
        {level}
      </div>
      <Image
        src={spriteSrc}
        alt={name}
        width={64}
        height={64}
        className={cn(
          "w-12 h-12 md:w-16 md:h-16 shrink-0",
          reward.isShiny && "drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
        )}
        unoptimized
      />
      <div className="flex-1">
        <p className="text-base md:text-lg font-semibold capitalize">
          {name}
          {reward.isShiny && (
            <span className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400 ml-1 md:ml-2">
              ✨ Shiny
            </span>
          )}
        </p>
        <p className="text-sm text-neutral-400">
          {t("scoreNeeded", { score: scoreNeeded })}
        </p>
      </div>
      <div className="w-auto md:w-32 text-right shrink-0">
        {isClaimed ? (
          <Button
            variant="ghost"
            disabled
            className="text-green-400 px-2 md:px-3"
          >
            <Check className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("claimed")}</span>
          </Button>
        ) : canClaim ? (
          <Button
            onClick={handleClaim}
            disabled={isClaiming}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-2 md:px-3"
          >
            <Gift className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("claim")}</span>
          </Button>
        ) : (
          <Button variant="ghost" disabled className="px-2 md:px-3">
            <Lock className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">{t("locked")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

function GameModesLinks(): React.JSX.Element {
  const t = useTranslations("HomePage.gameModes");
  const tRewards = useTranslations("RewardsPage");

  const modes = [
    {
      href: "/quiz",
      icon: Swords,
      title: t("quiz.title"),
      description: t("quiz.description"),
    },
    {
      href: "/pokedle",
      icon: Puzzle,
      title: t("pokedle.title"),
      description: t("pokedle.description"),
    },
    {
      href: "/friends-quiz",
      icon: Users,
      title: t("friends.title"),
      description: t("friends.description"),
    },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {tRewards("ctaTitle")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modes.map((mode) => (
          <GameModeCard
            key={mode.href}
            href={mode.href}
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
          />
        ))}
      </div>
    </section>
  );
}

export default function RewardsClient({
  user,
  locale,
  allRewards,
  initialClaimedLevels,
  initialCurrentLevel,
  scoreToNextLevel,
  currentScoreProgress,
}: RewardsClientProps): React.JSX.Element {
  const t = useTranslations("RewardsPage");
  const [isPending, startTransition] = useTransition();
  const [claimedLevels, setClaimedLevels] =
    useState<Set<number>>(initialClaimedLevels);
  const [currentLevel, setCurrentLevel] = useState<number>(initialCurrentLevel);

  const rewardsToClaim = useMemo(
    () =>
      allRewards.filter(
        ([level]) => level <= currentLevel && !claimedLevels.has(level)
      ),
    [allRewards, currentLevel, claimedLevels]
  );

  const handleClaim = async (level: number): Promise<void> => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/rewards/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level }),
        });
        if (res.ok) {
          setClaimedLevels((prev) => new Set(prev).add(level));
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleClaimAll = async (): Promise<void> => {
    const levelsToClaim = rewardsToClaim.map(([level]) => level);
    if (levelsToClaim.length === 0) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/rewards/claim-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ levels: levelsToClaim }),
        });
        if (res.ok) {
          setClaimedLevels((prev) => new Set([...prev, ...levelsToClaim]));
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-900 to-neutral-950 p-6 shadow-2xl shadow-black/30 mb-10">
        <ShineBorder
          shineColor={["#A000FF", "#C000FF", "#E060FF"]}
          className="rounded-2xl"
        />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              {t("title")}
            </h1>
            <p className="text-lg text-neutral-300">{t("subtitle")}</p>
          </div>
          <div className="w-full md:w-1/2 shrink-0">
            <div className="flex justify-between text-sm text-neutral-300 mb-1 font-semibold">
              <span>{t("currentLevel", { level: currentLevel })}</span>
              <span className="text-purple-300">
                {t("nextLevelScore", {
                  score: scoreToNextLevel.toLocaleString(locale),
                })}
              </span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-4 overflow-hidden border border-neutral-600 p-0.5">
              <div
                className="bg-linear-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${currentScoreProgress}%` }}
              >
                <span className="text-xs font-bold text-white opacity-80">
                  {Math.round(currentScoreProgress)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {t("currentScore", {
                score: user.score.toLocaleString(locale),
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            <Trophy className="inline-block h-8 w-8 mr-2 text-yellow-400" />
            {t("rewardsListTitle")}
          </h2>
          {rewardsToClaim.length > 1 && (
            <Button
              onClick={handleClaimAll}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold mt-4 md:mt-0"
            >
              <Gift className="h-4 w-4 mr-2" />
              {t("claimAll", { count: rewardsToClaim.length })}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {allRewards.map(([level, reward]: RewardEntry) => {
            const isClaimed: boolean = claimedLevels.has(level);
            const canClaim: boolean = currentLevel >= level && !isClaimed;
            return (
              <RewardLevelRow
                key={level}
                level={level}
                reward={reward}
                isClaimed={isClaimed}
                canClaim={canClaim}
                onClaim={handleClaim}
                t={t}
                locale={locale}
              />
            );
          })}
        </div>
      </div>

      <GameModesLinks />
    </>
  );
}
