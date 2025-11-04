import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: expires,
    },
  });

  // 👉 Envoi réel de l'email
  await sendPasswordResetEmail(user.email, token);

  return NextResponse.json({ ok: true });
}
