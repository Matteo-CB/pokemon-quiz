import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { REWARD_LEVELS, getLevelFromScore } from "@/lib/leveling-system";
import { getPokedleData } from "@/lib/pokedle-helpers";
import { PokemonNames } from "@/types/pokemon";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { levels }: { levels: number[] } = await request.json();
  if (!levels || !Array.isArray(levels) || levels.length === 0) {
    return NextResponse.json({ error: "missing_levels" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { score: true, claimedRewards: { select: { level: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    const currentLevel = getLevelFromScore(user.score);
    const claimedLevelsSet = new Set(user.claimedRewards.map((r) => r.level));

    const rewardsToProcess = levels
      .map((level) => ({
        level,
        reward: REWARD_LEVELS.get(level),
      }))
      .filter(
        ({ level, reward }) =>
          reward && currentLevel >= level && !claimedLevelsSet.has(level)
      );

    if (rewardsToProcess.length === 0) {
      return NextResponse.json(
        { error: "no_valid_rewards_to_claim" },
        { status: 400 }
      );
    }

    const prismaOperations: any[] = [];
    const pokemonDataPromises = rewardsToProcess.map(({ reward }) =>
      getPokedleData(reward!.pokemonId)
    );
    const allPokemonData = await Promise.all(pokemonDataPromises);

    for (let i = 0; i < rewardsToProcess.length; i++) {
      const { level, reward } = rewardsToProcess[i];
      const pokemonData = allPokemonData[i];

      if (!pokemonData) {
        console.error(
          `Failed to fetch data for reward Pokémon ID: ${reward!.pokemonId}`
        );
        continue;
      }

      prismaOperations.push(
        prisma.claimedReward.create({
          data: {
            userId: session.user.id,
            level: level,
          },
        })
      );

      prismaOperations.push(
        prisma.pokemon.create({
          data: {
            user: { connect: { id: session.user.id } },
            name: pokemonData.name,
            names: (pokemonData.names as unknown as PokemonNames) ?? {},
            isShiny: reward!.isShiny ?? false,
            nationalId: pokemonData.nationalId,
            generation: pokemonData.generation,
            type1: pokemonData.type1,
            type2: pokemonData.type2,
            hp: pokemonData.hp,
            attack: pokemonData.attack,
            defense: pokemonData.defense,
            spAttack: pokemonData.spAttack,
            spDefense: pokemonData.spDefense,
            speed: pokemonData.speed,
            spriteDefault: pokemonData.spriteDefault,
            spriteShiny: pokemonData.spriteShiny,
            spriteBack: pokemonData.spriteBack,
            spriteBackShiny: pokemonData.spriteBackShiny,
            spriteHome: pokemonData.spriteHome,
            spriteDream: pokemonData.spriteDream,
            spriteOfficial: pokemonData.spriteOfficial,
            spriteShowdown: pokemonData.spriteShowdown,
            spriteShowdownShiny: pokemonData.spriteShowdownShiny,
          },
        })
      );
    }

    await prisma.$transaction(prismaOperations);

    return NextResponse.json({
      success: true,
      claimedCount: rewardsToProcess.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
