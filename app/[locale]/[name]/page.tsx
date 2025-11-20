import { PrismaClient, User, Pokemon } from "@prisma/client";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { PokemonNames } from "@/types/pokemon";
import PlayerProfileClient from "./PlayerProfileClient";

const prisma = new PrismaClient();

type PageProps = {
  params: Promise<{ locale: string; name: string }>;
};

type PokemonWithTypedNames = Pokemon & { names: PokemonNames };

export default async function PlayerProfilePage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, name } = await params;
  setRequestLocale(locale);

  if (!name) {
    notFound();
  }

  const decodedName = decodeURIComponent(name);

  const user = await prisma.user.findUnique({
    where: { name: decodedName },
    include: {
      pokemons: {
        orderBy: { nationalId: "asc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const pokemons: PokemonWithTypedNames[] = user.pokemons.map((p) => ({
    ...p,
    names: (p.names ?? {}) as PokemonNames,
  }));

  const userWithTypedPokemons = { ...user, pokemons };

  return <PlayerProfileClient user={userWithTypedPokemons} />;
}
