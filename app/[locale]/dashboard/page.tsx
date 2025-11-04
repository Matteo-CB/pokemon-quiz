import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import DashboardClient from "./DashboardClient";
import { PokemonWithNames } from "@/types/pokemon";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // On passe juste une info minimale au client
    return <DashboardClient session={null} user={null} pokemons={[]} />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: { pokemons: true },
  });

  if (!user) {
    return <DashboardClient session={session} user={null} pokemons={[]} />;
  }

  const pokemons: PokemonWithNames[] = user.pokemons.map((p) => ({
    ...p,
    names: (p.names ?? {}) as Record<string, string>,
  }));

  return <DashboardClient session={session} user={user} pokemons={pokemons} />;
}
