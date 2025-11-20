import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient, Pokemon } from "@prisma/client";
import { setRequestLocale } from "next-intl/server";
import type { ApiPokemon, DisplayPokemon, PokemonNames } from "@/types/pokemon";
import { fetchAllPokedex } from "@/lib/pokedex-helpers";
import PokedexClient from "./PokedexClient";

const prisma: PrismaClient = new PrismaClient();

type PageProps = {
  params: Promise<{ locale: string }>;
};

type PokemonWithTypedNames = Pokemon & { names: PokemonNames };

export default async function PokedexPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userWithPokemons = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      pokemons: {
        orderBy: [
          { nationalId: "asc" },
          { isShiny: "desc" }, // Trie pour que les shinies soient en premier
        ],
      },
    },
  });

  const obtainedPokemonMap: Map<number, PokemonWithTypedNames> = new Map();
  userWithPokemons?.pokemons.forEach((p: Pokemon) => {
    const typedPokemon = { ...p, names: (p.names ?? {}) as PokemonNames };
    // Si la Map n'a pas ce Pokémon, ou si le Pokémon actuel est shiny,
    // on l'ajoute/l'écrase.
    if (!obtainedPokemonMap.has(p.nationalId) || p.isShiny) {
      obtainedPokemonMap.set(p.nationalId, typedPokemon);
    }
  });

  const apiPokemons: ApiPokemon[] = await fetchAllPokedex();
  const totalPokemon: number = apiPokemons.length;

  const displayList: DisplayPokemon[] = apiPokemons.map(
    (apiMon: ApiPokemon) => {
      const obtainedData = obtainedPokemonMap.get(apiMon.id);
      return {
        apiData: apiMon,
        obtainedData: obtainedData ?? null,
      };
    }
  );

  return (
    <PokedexClient
      displayList={displayList}
      totalCount={totalPokemon}
      obtainedCount={obtainedPokemonMap.size}
    />
  );
}
