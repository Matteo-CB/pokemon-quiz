"use client";

import { useTranslations } from "next-intl";
import ProfileForm from "./ProfileForm";
import PokemonGrid from "./PokemonGrid";
import { PokemonWithNames } from "@/types/pokemon";
import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import { LevelProgressCard } from "@/components/ui/LevelProgressCard";
import { PokeMoneyCard } from "@/components/PokeMoneyCard";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type UserWithTypedPokemons = User & {
  pokemons: PokemonWithNames[];
};

type Props = {
  session: Session | null;
  user: UserWithTypedPokemons | null;
  currentLevel: number;
  currentLevelScore: number;
  nextLevelScore: number;
};

export default function DashboardClient({
  session,
  user,
  currentLevel,
  currentLevelScore,
  nextLevelScore,
}: Props) {
  const t = useTranslations("DashboardPage");

  if (!session) return <div>{t("accessDenied")}</div>;
  if (!user) return <div>{t("userNotFound")}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 md:px-10 px-5 py-10 max-w-6xl m-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button
          asChild
          variant="ghost"
          className="mt-4 hover:bg-neutral-800 hover:text-neutral-50 md:mt-0 w-full md:w-auto"
        >
          <Link href={`/${user.name}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            {t("viewProfileButton")}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <LevelProgressCard
          currentLevel={currentLevel}
          currentScore={user.score}
          currentLevelScore={currentLevelScore}
          nextLevelScore={nextLevelScore}
        />
        <PokeMoneyCard pokeMoney={user.pokeMoney} />
      </div>

      <ProfileForm user={user} />
      <PokemonGrid pokemons={user.pokemons} />
    </div>
  );
}
