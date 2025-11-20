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

  const { level }: { level: number } = await request.json();
  if (!level) {
    return NextResponse.json({ error: "missing_level" }, { status: 400 });
  }

  const reward = REWARD_LEVELS.get(level);
  if (!reward) {
    return NextResponse.json({ error: "invalid_reward" }, { status: 404 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { score: true },
    });

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    const currentLevel = getLevelFromScore(user.score);
    if (currentLevel < level) {
      return NextResponse.json({ error: "level_not_reached" }, { status: 403 });
    }

    const existingClaim = await prisma.claimedReward.findUnique({
      where: { userId_level: { userId: session.user.id, level: level } },
    });

    if (existingClaim) {
      return NextResponse.json({ error: "already_claimed" }, { status: 409 });
    }

    const pokemonData = await getPokedleData(reward.pokemonId);
    if (!pokemonData) {
      return NextResponse.json(
        { error: "pokemon_data_not_found" },
        { status: 500 }
      );
    }

    await prisma.$transaction([
      prisma.claimedReward.create({
        data: {
          userId: session.user.id,
          level: level,
        },
      }),
      prisma.pokemon.create({
        data: {
          user: { connect: { id: session.user.id } },
          name: pokemonData.name,
          names: (pokemonData.names as unknown as PokemonNames) ?? {},
          isShiny: reward.isShiny ?? false,
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
      }),
    ]);

    return NextResponse.json({ success: true, level: level });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
