import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { score: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        profilePicture: true,
        score: true,
        bio: true,
      },
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
