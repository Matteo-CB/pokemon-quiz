import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getPokedleData } from "@/lib/pokedle-helpers";

const prisma: PrismaClient = new PrismaClient();
const SHINY_CHANCE = 500;
const CAPTURE_ATTEMPTS: number = 8;
const MAX_ATTEMPTS: number = 20;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { nationalId, attempts }: { nationalId: number; attempts: number } =
    await request.json();

  if (!nationalId || attempts === undefined) {
    return NextResponse.json({ error: "missing_data" }, { status: 400 });
  }

  const calculatedScore: number = (MAX_ATTEMPTS + 1 - attempts) * 25;
  const calculatedPokeMoney: number = Math.max(0, 100 - (attempts - 1) * 5);

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastPokedleWin: true, pokeMoney: true, score: true },
    });

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    const currentPokeMoney: number = user.pokeMoney ?? 0;
    const currentScore: number = user.score ?? 0;

    const lastWinDate = user.lastPokedleWin;
    const today = new Date();

    if (lastWinDate && lastWinDate.toDateString() === today.toDateString()) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          score: currentScore + calculatedScore,
        },
      });
      return NextResponse.json({
        success: true,
        messageKey: "reward.alreadyPlayedToday",
        isShiny: false,
        score: calculatedScore,
        pokeMoney: 0,
      });
    }

    if (attempts > CAPTURE_ATTEMPTS) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          score: currentScore + calculatedScore,
          lastPokedleWin: new Date(),
        },
      });
      return NextResponse.json({
        success: true,
        messageKey: "reward.tooManyAttempts",
        isShiny: false,
        score: calculatedScore,
        pokeMoney: 0,
      });
    }

    const pokemonData = await getPokedleData(nationalId);
    if (!pokemonData) {
      return NextResponse.json({ error: "invalid_pokemon" }, { status: 404 });
    }

    const isShiny = Math.floor(Math.random() * SHINY_CHANCE) === 0;

    const existingPokemon = await prisma.pokemon.findFirst({
      where: {
        userId: session.user.id,
        nationalId,
      },
    });

    let message: string;
    let wonShiny = isShiny;

    if (existingPokemon) {
      if (!existingPokemon.isShiny && isShiny) {
        await prisma.pokemon.update({
          where: { id: existingPokemon.id },
          data: { isShiny: true },
        });
        message = "reward.upgrade";
      } else {
        message = "reward.alreadyOwned";
        wonShiny = existingPokemon.isShiny;
      }
    } else {
      await prisma.pokemon.create({
        data: {
          user: { connect: { id: session.user.id } },
          name: pokemonData.name,
          names: pokemonData.names,
          isShiny,
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
      });
      message = "reward.new";
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        score: currentScore + calculatedScore,
        pokeMoney: currentPokeMoney + calculatedPokeMoney,
        lastPokedleWin: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      messageKey: message,
      isShiny: wonShiny,
      score: calculatedScore,
      pokeMoney: calculatedPokeMoney,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
