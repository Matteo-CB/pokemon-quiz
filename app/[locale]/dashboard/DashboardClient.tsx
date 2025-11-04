"use client";

import { useTranslations } from "next-intl";
import ProfileForm from "./ProfileForm";
import PokemonGrid from "./PokemonGrid";
import { PokemonWithNames } from "@/types/pokemon";

type Props = {
  session: any | null;
  user: any | null;
  pokemons: PokemonWithNames[];
};

export default function DashboardClient({ session, user, pokemons }: Props) {
  const t = useTranslations("DashboardPage");

  if (!session) return <div>{t("accessDenied")}</div>;
  if (!user) return <div>{t("userNotFound")}</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 md:px-10 px-5 py-10 max-w-6xl m-auto">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="mb-6 bg-neutral-900 p-4 rounded-xl">
        <p className="text-lg">
          {t("currentScore")}{" "}
          <span className="font-bold text-purple-400">{user.score}</span>
        </p>
      </div>

      <ProfileForm user={user} />
      <PokemonGrid pokemons={pokemons} />
    </div>
  );
}
