"use client";

import { useTranslations } from "next-intl";
import { GameModeCard } from "./GameModeCard";
import { Swords, Puzzle, BookMarked, Users, Trophy } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface GameMode {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  disabled?: boolean;
}

export default function GameModes(): React.JSX.Element {
  const t: (key: string) => string = useTranslations("HomePage.gameModes");

  const modes: GameMode[] = [
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
      href: "/pokedex",
      icon: BookMarked,
      title: t("pokedex.title"),
      description: t("pokedex.description"),
    },
    {
      href: "/friends-quiz",
      icon: Users,
      title: t("friends.title"),
      description: t("friends.description"),
      disabled: true, // Ajout de la prop disabled
    },
    {
      href: "/rewards",
      icon: Trophy,
      title: t("rewards.title"),
      description: t("rewards.description"),
    },
  ];

  return (
    <section className="pb-12 mb-12 w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {modes.map(
          (mode: GameMode, index: number): React.JSX.Element => (
            <div
              key={mode.href}
              className={cn(index === modes.length - 1 ? "md:col-span-2" : "")}
            >
              <GameModeCard
                href={mode.href}
                icon={mode.icon}
                title={mode.title}
                description={mode.description}
                disabled={mode.disabled}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}
