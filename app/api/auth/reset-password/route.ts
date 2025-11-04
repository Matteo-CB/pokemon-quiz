import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!reset || reset.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}
