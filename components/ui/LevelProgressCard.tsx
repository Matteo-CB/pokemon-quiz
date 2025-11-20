"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";

type Props = {
  currentLevel: number;
  currentScore: number;
  currentLevelScore: number;
  nextLevelScore: number;
};

const getLevelStyle = (level: number) => {
  if (level >= 180) {
    return {
      badgeBorder: "border-fuchsia-400",
      badgeBg: "bg-neutral-900",
      progressGradient: "from-red-500 via-yellow-500 to-green-500",
      accentText: "text-fuchsia-300",
      beamFrom: "#FF00FF",
      beamTo: "#00FFFF",
      aura: "bg-fuchsia-500/10",
      shadowColor: "#FF00FF",
      textShadow: "0 0 10px #FF00FF, 0 0 20px #00FFFF",
    };
  }
  if (level >= 160) {
    return {
      badgeBorder: "border-purple-400",
      badgeBg: "bg-purple-950/80",
      progressGradient: "from-purple-500 to-violet-500",
      accentText: "text-purple-300",
      beamFrom: "#A000FF",
      beamTo: "#E060FF",
      aura: "bg-purple-500/10",
      shadowColor: "#A000FF",
      textShadow: "0 0 10px #A000FF",
    };
  }
  if (level >= 140) {
    return {
      badgeBorder: "border-cyan-400",
      badgeBg: "bg-cyan-950/80",
      progressGradient: "from-cyan-500 to-blue-500",
      accentText: "text-cyan-300",
      beamFrom: "#22D3EE",
      beamTo: "#06B6D4",
      aura: "bg-cyan-500/10",
      shadowColor: "#22D3EE",
      textShadow: "0 0 10px #22D3EE",
    };
  }
  if (level >= 120) {
    return {
      badgeBorder: "border-red-400",
      badgeBg: "bg-red-950/80",
      progressGradient: "from-red-500 to-orange-500",
      accentText: "text-red-300",
      beamFrom: "#F87171",
      beamTo: "#DC2626",
      aura: "bg-red-500/10",
      shadowColor: "#F87171",
      textShadow: "0 0 10px #F87171",
    };
  }
  if (level >= 100) {
    return {
      badgeBorder: "border-pink-400",
      badgeBg: "bg-pink-950/80",
      progressGradient: "from-pink-500 to-rose-500",
      accentText: "text-pink-300",
      beamFrom: "#EC4899",
      beamTo: "#F472B6",
      aura: "bg-pink-500/10",
      shadowColor: "#EC4899",
      textShadow: "0 0 10px #EC4899",
    };
  }
  if (level >= 80) {
    return {
      badgeBorder: "border-yellow-400",
      badgeBg: "bg-yellow-950/80",
      progressGradient: "from-yellow-500 to-amber-500",
      accentText: "text-yellow-300",
      beamFrom: "#FDE047",
      beamTo: "#FFD700",
      aura: "bg-yellow-500/10",
      shadowColor: "#FDE047",
      textShadow: "0 0 10px #FDE047",
    };
  }
  if (level >= 60) {
    return {
      badgeBorder: "border-emerald-400",
      badgeBg: "bg-emerald-950/80",
      progressGradient: "from-emerald-500 to-green-500",
      accentText: "text-emerald-300",
      beamFrom: "#34D399",
      beamTo: "#A7F3D0",
      aura: "bg-emerald-500/10",
      shadowColor: "#34D399",
      textShadow: "0 0 10px #34D399",
    };
  }
  if (level >= 40) {
    return {
      badgeBorder: "border-blue-400",
      badgeBg: "bg-blue-950/80",
      progressGradient: "from-blue-500 to-sky-500",
      accentText: "text-blue-300",
      beamFrom: "#3B82F6",
      beamTo: "#60A5FA",
      aura: "bg-blue-500/10",
      shadowColor: "#3B82F6",
      textShadow: "0 0 10px #3B82F6",
    };
  }
  if (level >= 20) {
    return {
      badgeBorder: "border-gray-400",
      badgeBg: "bg-gray-950/80",
      progressGradient: "from-gray-500 to-neutral-500",
      accentText: "text-gray-300",
      beamFrom: "#9CA3AF",
      beamTo: "#E5E7EB",
      aura: "bg-gray-500/10",
      shadowColor: "#9CA3AF",
      textShadow: "0 0 10px #9CA3AF",
    };
  }
  return {
    badgeBorder: "border-orange-400",
    badgeBg: "bg-orange-950/80",
    progressGradient: "from-orange-500 to-amber-600",
    accentText: "text-orange-300",
    beamFrom: "#F97316",
    beamTo: "#FB923C",
    aura: "bg-orange-500/10",
    shadowColor: "#F97316",
    textShadow: "0 0 10px #F97316",
  };
};

export function LevelProgressCard({
  currentLevel,
  currentScore,
  currentLevelScore,
  nextLevelScore,
}: Props) {
  const t = useTranslations("DashboardPage");
  const tRewards = useTranslations("RewardsPage");

  const totalExpForThisLevel = nextLevelScore - currentLevelScore;
  const expEarnedThisLevel = currentScore - currentLevelScore;
  const progressPercentage =
    totalExpForThisLevel > 0
      ? Math.max(
          0,
          Math.min(100, (expEarnedThisLevel / totalExpForThisLevel) * 100)
        )
      : 0;

  const style = getLevelStyle(currentLevel);

  return (
    <div className="relative overflow-hidden mb-8 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
      <div
        className={cn("absolute inset-0 opacity-10 blur-2xl", style.aura)}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center shrink-0 z-10">
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

      <div className="w-full z-10">
        <div className="flex justify-between text-sm text-neutral-300 mb-1 font-semibold">
          <span>
            {t("currentScore")}{" "}
            <span className="text-white font-bold">
              {currentScore.toLocaleString()}
            </span>
          </span>
          <span className={cn("font-semibold", style.accentText)}>
            {tRewards("nextLevelScoreShort")} {nextLevelScore.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-4 overflow-hidden border border-neutral-600 p-0.5">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2",
              `bg-linear-to-r ${style.progressGradient}`
            )}
            style={{ width: `${progressPercentage}%` }}
          >
            <span
              className={cn(
                "text-xs font-bold text-white transition-opacity duration-300",
                progressPercentage < 20 ? "opacity-0" : "opacity-80"
              )}
              style={{
                filter: `drop-shadow(0 0 3px ${style.shadowColor})`,
              }}
            >
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-neutral-400 mt-1 text-right">
          {tRewards("scoreToNextLevel", {
            score: (nextLevelScore - currentScore).toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
}
