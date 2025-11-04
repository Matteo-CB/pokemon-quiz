import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// ✅ Singleton Prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, starter, isShiny, starterSprite } = body;

    if (!email || !password || !starter) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }
    // Vérifier si le pseudo existe déjà
    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà pris" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Récupération des données du Pokémon choisi
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${starter.toLowerCase()}`
    );
    const data = await res.json();

    // Récupération de la génération via species + noms localisés
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    const generationName = speciesData.generation.name; // ex: "generation-i"
    const generation = parseInt(generationName.split("-")[1].replace("i", "1")); // simplifié

    // 👇 On construit le dictionnaire de noms
    const namesDict: Record<string, string> = {};
    speciesData.names.forEach((n: any) => {
      namesDict[n.language.name] = n.name;
    });

    const stats = {
      hp: data.stats.find((s: any) => s.stat.name === "hp").base_stat,
      attack: data.stats.find((s: any) => s.stat.name === "attack").base_stat,
      defense: data.stats.find((s: any) => s.stat.name === "defense").base_stat,
      spAttack: data.stats.find((s: any) => s.stat.name === "special-attack")
        .base_stat,
      spDefense: data.stats.find((s: any) => s.stat.name === "special-defense")
        .base_stat,
      speed: data.stats.find((s: any) => s.stat.name === "speed").base_stat,
    };

    const types = data.types.map((t: any) => t.type.name);

    // Sprites
    const sprites = {
      spriteDefault: data.sprites.front_default,
      spriteShiny: data.sprites.front_shiny,
      spriteBack: data.sprites.back_default,
      spriteBackShiny: data.sprites.back_shiny,
      spriteHome: data.sprites.other?.home?.front_default,
      spriteDream: data.sprites.other?.["dream_world"]?.front_default,
      spriteOfficial: data.sprites.other?.["official-artwork"]?.front_default,
      spriteShowdown: data.sprites.other?.showdown?.front_default,
      spriteShowdownShiny: data.sprites.other?.showdown?.front_shiny,
    };

    // Création utilisateur + Pokémon
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        password: hashedPassword,
        profilePicture: starterSprite || sprites.spriteDefault,
        pokemons: {
          create: {
            name: data.name, // nom anglais
            names: namesDict, // 👈 dictionnaire multilingue
            nationalId: data.id,
            generation: generation || 1,
            type1: types[0],
            type2: types[1] ?? null,
            isShiny: isShiny ?? false,
            ...stats,
            ...sprites,
          },
        },
      },
      include: { pokemons: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
