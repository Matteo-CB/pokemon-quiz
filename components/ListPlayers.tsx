"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedList } from "@/components/ui/animated-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShineBorder } from "./ui/shine-border";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getLevelFromScore } from "@/lib/leveling-system";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

interface Player {
  id: string;
  name: string;
  score: number;
  profilePicture: string;
  bio?: string;
  level: number;
}

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

const rankStyles = {
  0: {
    shineColor: ["#FFD700", "#FDE047", "#BF953F"],
    gradient:
      "bg-gradient-to-r from-yellow-800/40 via-neutral-900 to-neutral-900",
    shadow: "shadow-lg shadow-yellow-500/20",
  },
  1: {
    shineColor: ["#C0C0C0", "#E5E7EB", "#9CA3AF"],
    gradient:
      "bg-gradient-to-r from-slate-700/40 via-neutral-900 to-neutral-900",
    shadow: "shadow-lg shadow-slate-400/20",
  },
  2: {
    shineColor: ["#CD7F32", "#E29A55", "#A46628"],
    gradient:
      "bg-gradient-to-r from-orange-800/40 via-neutral-900 to-neutral-900",
    shadow: "shadow-lg shadow-orange-700/20",
  },
};

export default function ListPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const t = useTranslations("ListPlayers");

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch("/api/users/top");
        if (!res.ok) throw new Error("Failed to fetch players");
        const data: (Player & { score: number })[] = await res.json();

        const playersWithLevel = data.slice(0, 3).map((p) => ({
          ...p,
          level: getLevelFromScore(p.score),
        }));
        setPlayers(playersWithLevel);
      } catch (err) {
        console.error("Erreur chargement joueurs :", err);
      }
    }
    loadPlayers();
  }, []);

  const playerElements = players.map((player, index) => {
    const styles = rankStyles[index as keyof typeof rankStyles];
    const levelStyle = getLevelStyle(player.level);
    if (!styles) return null;

    return (
      <Link
        key={player.name}
        href={`/${player.name}`}
        className={cn(
          "relative mb-4 rounded-xl w-full min-w-[350px] md:min-w-[400px] mx-auto transition-all duration-300 hover:scale-[1.02]",
          "block",
          styles.shadow
        )}
      >
        <div
          className={cn(
            "bg-neutral-900 p-4 rounded-xl flex gap-4 items-center w-full",
            styles.gradient
          )}
        >
          <div
            className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-md overflow-hidden shrink-0",
              levelStyle.badgeBorder,
              levelStyle.badgeBg
            )}
          >
            <BorderBeam
              colorFrom={levelStyle.beamFrom}
              colorTo={levelStyle.beamTo}
              duration={7}
              borderWidth={2}
              className="rounded-full"
            />
            <span
              className="relative text-white text-2xl font-extrabold"
              style={{ textShadow: levelStyle.textShadow }}
            >
              {player.level}
            </span>
          </div>

          <Avatar className="w-14 h-14 bg-neutral-800 border-2 border-neutral-700 shrink-0">
            <AvatarImage src={player.profilePicture} alt={player.name ?? ""} />
            <AvatarFallback>
              {(player.name ?? "??").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold truncate">{player.name}</div>
            {player.bio && (
              <div className="text-sm italic text-neutral-400 mt-1 line-clamp-1">
                {player.bio}
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-white">
              {player.score.toLocaleString()}
            </div>
            <div className="text-sm text-neutral-400">{t("score")}</div>
          </div>
        </div>

        <ShineBorder shineColor={styles.shineColor} className="rounded-xl" />
      </Link>
    );
  });

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 {t("title")}</h2>

      <AnimatedList>{playerElements.reverse()}</AnimatedList>

      <div className="flex justify-center mt-8">
        <Button
          asChild
          className="hover:bg-neutral-800 hover:text-neutral-50"
          variant="ghost"
        >
          <Link href="/leaderboard">{t("viewTop100")}</Link>
        </Button>
      </div>
    </div>
  );
}
