import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import {
  generateStrategicQuestions,
  generateCultureQuestions,
} from "@/lib/quiz-helpers";

const prisma = new PrismaClient();
const DAILY_QUIZ_LIMIT = 3;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { type, locale } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user)
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });

    const today = new Date();
    let dailyCount = user.dailyQuizSessions;
    const lastPlayed = user.lastQuizPlayed
      ? new Date(user.lastQuizPlayed)
      : null;

    if (!lastPlayed || lastPlayed.toDateString() !== today.toDateString()) {
      dailyCount = 0;
      await prisma.user.update({
        where: { id: user.id },
        data: { dailyQuizSessions: 0 },
      });
    }

    const isRewardEligible = dailyCount < DAILY_QUIZ_LIMIT;
    let questions;

    if (type === "culture") {
      questions = await generateCultureQuestions(locale, 10);
    } else {
      questions = await generateStrategicQuestions(locale, 10);
    }

    const newSession = await prisma.quizSession.create({
      data: {
        userId: session.user.id,
        type: type,
        questions: questions as any,
        status: "pending",
        isRewardEligible: isRewardEligible,
      },
    });

    return NextResponse.json({
      sessionId: newSession.id,
      questions: questions,
      isRewardEligible: isRewardEligible,
    });
  } catch (error) {
    console.error("Quiz Start Error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
