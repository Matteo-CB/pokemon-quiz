import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient, User } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  REWARD_LEVELS,
  getLevelFromScore,
  getTotalScoreForLevel,
  type RewardDefinition,
  type EnrichedRewardPokemon,
} from "@/lib/leveling-system";
import RewardsClient from "./RewardsClient";
import { getPokedleData } from "@/lib/pokedle-helpers"; // Importez votre helper
import type { PokemonNames } from "@/types/pokemon";

const prisma: PrismaClient = new PrismaClient();

type PageProps = {
  params: { locale: string };
};

export default async function RewardsPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const t = await getTranslations("RewardsPage");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      claimedRewards: {
        select: { level: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const currentLevel: number = getLevelFromScore(user.score);
  const nextLevelScore: number = getTotalScoreForLevel(currentLevel + 1);
  const currentLevelScore: number = getTotalScoreForLevel(currentLevel);

  const progress: number =
    nextLevelScore > currentLevelScore
      ? ((user.score - currentLevelScore) /
          (nextLevelScore - currentLevelScore)) *
        100
      : 0;

  const claimedLevels: Set<number> = new Set(
    user.claimedRewards.map((r) => r.level)
  );

  // --- CORRECTION ICI ---
  // 1. Récupérer les définitions de base
  const rewardDefinitions: [number, RewardDefinition][] = Array.from(
    REWARD_LEVELS.entries()
  );

  // 2. Appeler l'API pour chaque Pokémon dans la liste
  const allPokemonData = await Promise.all(
    rewardDefinitions.map(([, def]) => getPokedleData(def.pokemonId))
  );

  // 3. Créer la liste "enrichie" que le client attend
  const allRewards: [number, EnrichedRewardPokemon][] = rewardDefinitions.map(
    ([level, def], index) => {
      const apiData = allPokemonData[index];

      const finalReward: EnrichedRewardPokemon = {
        pokemonId: def.pokemonId,
        isShiny: def.isShiny,
        type: def.type,
        name: apiData?.name ?? "Error",
        names: (apiData?.names as PokemonNames) ?? { fr: "Erreur" },
      };

      return [level, finalReward];
    }
  );
  // --- FIN DE LA CORRECTION ---

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-5xl mx-auto">
      <RewardsClient
        user={user}
        locale={locale}
        allRewards={allRewards}
        initialClaimedLevels={claimedLevels}
        initialCurrentLevel={currentLevel}
        scoreToNextLevel={nextLevelScore}
        currentScoreProgress={progress}
      />
    </div>
  );
}
