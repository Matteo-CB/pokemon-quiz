import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient, User, Pokemon } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDailyShopItems, ShopItem } from "@/lib/shop-helpers";
import type { PokemonNames } from "@/types/pokemon";
import ShopClient from "./ShopClient";

const prisma: PrismaClient = new PrismaClient();

type PageProps = {
  params: { locale: string };
};

type PokemonWithTypedNames = Pokemon & { names: PokemonNames };

export default async function ShopPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const t = await getTranslations("ShopPage");

  const [user, shopItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        pokemons: {
          select: { nationalId: true, isShiny: true },
        },
      },
    }),
    getDailyShopItems(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const ownedPokemonSet: Set<string> = new Set(
    user.pokemons.map((p) => `${p.nationalId}:${p.isShiny}`)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-10 max-w-7xl mx-auto">
      <ShopClient
        user={user}
        shopItems={shopItems}
        ownedPokemonSet={ownedPokemonSet}
      />
    </div>
  );
}
