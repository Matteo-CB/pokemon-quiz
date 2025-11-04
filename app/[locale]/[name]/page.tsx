import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { UserWithPokemons, PokemonNames } from "@/types/pokemon";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>; // 👈 params est une Promise
}) {
  const { locale, name } = await params; // 👈 on attend la Promise

  const t = await getTranslations({ locale, namespace: "PlayerProfile" });

  if (!name) {
    notFound();
  }

  const user = (await prisma.user.findUnique({
    where: { name },
    include: { pokemons: true },
  })) as UserWithPokemons | null;

  if (!user) {
    notFound();
  }

  const pokemons = user.pokemons.map((p) => ({
    ...p,
    names: (p.names ?? {}) as PokemonNames,
  }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-4xl m-auto">
      <h1 className="text-3xl font-bold mb-6">
        {t("title", { name: user.name })}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.profilePicture ?? "/default-avatar.png"}
          alt={user.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full border-2 border-purple-500"
        />
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          {user.bio && (
            <p className="text-sm italic text-neutral-400">{user.bio}</p>
          )}
          <p className="text-sm">
            {t("score")}{" "}
            <span className="font-bold text-purple-400">{user.score}</span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">{t("pokemons")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pokemons.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-900 p-4 rounded-xl flex flex-col items-center"
          >
            <Image
              src={p.spriteDefault ?? "/default.png"}
              alt={p.name}
              width={64}
              height={64}
              className="w-16 h-16 mb-2"
            />
            <p className="capitalize">{p.names[locale] ?? p.name}</p>
            {p.isShiny && <span className="text-yellow-400">✨ Shiny</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
