import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { PokemonWithNames, PokemonNames } from "@/types/pokemon";
import DashboardClient from "./DashboardClient";
import {
  getLevelFromScore,
  getTotalScoreForLevel,
} from "@/lib/leveling-system";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const defaultLevelScore = getTotalScoreForLevel(1);

  if (!session) {
    return (
      <DashboardClient
        session={null}
        user={null}
        currentLevel={0}
        currentLevelScore={0}
        nextLevelScore={defaultLevelScore}
      />
    );
  }

  const userWithRawPokemons = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: { pokemons: true },
  });

  if (!userWithRawPokemons) {
    return (
      <DashboardClient
        session={session}
        user={null}
        currentLevel={0}
        currentLevelScore={0}
        nextLevelScore={defaultLevelScore}
      />
    );
  }

  const correctlyTypedPokemons: PokemonWithNames[] =
    userWithRawPokemons.pokemons.map((p) => ({
      ...p,
      names: (p.names ?? {}) as PokemonNames,
    }));

  const user = {
    ...userWithRawPokemons,
    pokemons: correctlyTypedPokemons,
  };

  const currentLevel = getLevelFromScore(user.score);
  const currentLevelScore = getTotalScoreForLevel(currentLevel);
  const nextLevelScore = getTotalScoreForLevel(currentLevel + 1);

  return (
    <DashboardClient
      session={session}
      user={user}
      currentLevel={currentLevel}
      currentLevelScore={currentLevelScore}
      nextLevelScore={nextLevelScore}
    />
  );
}
