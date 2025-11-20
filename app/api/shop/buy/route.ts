import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getPokedleData } from "@/lib/pokedle-helpers";
import { PokemonNames } from "@/types/pokemon";

const prisma: PrismaClient = new PrismaClient();

interface BuyRequest {
  pokemonId: number;
  isShiny: boolean;
  price: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { pokemonId, isShiny, price }: BuyRequest = await request.json();
  if (!pokemonId || price === undefined) {
    return NextResponse.json({ error: "missing_data" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        pokemons: {
          where: { nationalId: pokemonId, isShiny: isShiny },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    if (user.pokeMoney < price) {
      return NextResponse.json({ error: "not_enough_money" }, { status: 403 });
    }

    if (user.pokemons.length > 0) {
      return NextResponse.json({ error: "already_owned" }, { status: 409 });
    }

    const pokemonData = await getPokedleData(pokemonId);
    if (!pokemonData) {
      return NextResponse.json(
        { error: "pokemon_data_not_found" },
        { status: 500 }
      );
    }

    const newPokeMoney = user.pokeMoney - price;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { pokeMoney: newPokeMoney },
      }),
      prisma.pokemon.create({
        data: {
          user: { connect: { id: session.user.id } },
          name: pokemonData.name,
          names: (pokemonData.names as unknown as PokemonNames) ?? {},
          isShiny: isShiny,
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

    return NextResponse.json({ success: true, newPokeMoney });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
