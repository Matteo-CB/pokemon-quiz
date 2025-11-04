"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedList } from "@/components/ui/animated-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShineBorder } from "./ui/shine-border";

interface Player {
  id: string;
  name: string;
  score: number;
  profilePicture: string;
  bio?: string;
}

export default function ListPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const t = useTranslations("ListPlayers");

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch("/api/users/top");
        if (!res.ok) throw new Error("Failed to fetch players");
        const data: Player[] = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Erreur chargement joueurs :", err);
      }
    }
    loadPlayers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🏆 {t("title")} {/* ex: "Top 3 joueurs" */}
      </h2>

      <AnimatedList>
        {players.map((player) => (
          <div
            key={player.id}
            className="relative mb-4 p-0 flex items-center gap-4 cursor-pointer bg-neutral-900 rounded-xl w-full min-w-[350px] md:min-w-[400px] mx-auto"
          >
            <div className="bg-neutral-900 p-4 min-h-32 rounded-xl flex gap-4 items-center w-full">
              <Avatar className="w-14 h-14 bg-neutral-800">
                <AvatarImage
                  src={player.profilePicture}
                  alt={player.name ?? ""}
                />
                <AvatarFallback>
                  {(player.name ?? "??").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="text-lg font-semibold">{player.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t("score")}: {player.score}
                </div>
                {player.bio && (
                  <div className="text-sm italic text-neutral-600 mt-1 line-clamp-2">
                    {player.bio}
                  </div>
                )}
              </div>

              <ShineBorder shineColor={["#7B2FF7", "#F107A3", "#FF6FB5"]} />
            </div>
          </div>
        ))}
      </AnimatedList>
    </div>
  );
}
