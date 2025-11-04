import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const profilePicture = formData.get("profilePicture") as string; // 👈 récupéré

  try {
    await prisma.user.update({
      where: { email: session.user?.email ?? "" },
      data: {
        name,
        bio,
        profilePicture, // 👈 sauvegardé
      },
    });

    const baseUrl = new URL(req.url);
    return NextResponse.redirect(new URL("/dashboard", baseUrl.origin));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
