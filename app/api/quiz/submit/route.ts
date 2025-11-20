import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getPokedleData } from "@/lib/pokedle-helpers";
import type { QuizQuestion } from "@/lib/quiz-helpers";

const prisma = new PrismaClient();
const SCORE_PER_QUESTION = 150;
const POKEMONEY_PER_QUESTION = 10;
const CAPTURE_CHANCE = 1 / 3;
const SHINY_CHANCE = 1 / 500;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { sessionId, answers } = await request.json();

  try {
    const quizSession = await prisma.quizSession.findFirst({
      where: { id: sessionId, userId: session.user.id },
    });

    if (!quizSession || quizSession.status === "completed") {
      return NextResponse.json({ error: "invalid_session" }, { status: 400 });
    }

    const questions = quizSession.questions as unknown as QuizQuestion[];
    let correctAnswers = 0;
    let potentialCaptures: number[] = [];

    questions.forEach((q) => {
      // Validation stricte : une seule réponse possible
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
        if (q.rewardContext?.ids && q.rewardContext.ids.length > 0) {
          potentialCaptures.push(...q.rewardContext.ids);
        }
      }
    });

    const scoreGained = quizSession.isRewardEligible
      ? correctAnswers * SCORE_PER_QUESTION
      : 0;
    const pokeMoneyGained = quizSession.isRewardEligible
      ? correctAnswers * POKEMONEY_PER_QUESTION
      : 0;

    let capturedPokemonId = null;
    let capturedPokemonIsShiny = false;

    if (
      quizSession.isRewardEligible &&
      potentialCaptures.length > 0 &&
      Math.random() < CAPTURE_CHANCE
    ) {
      const randomId =
        potentialCaptures[Math.floor(Math.random() * potentialCaptures.length)];
      const isShiny = Math.random() < SHINY_CHANCE;
      const data = await getPokedleData(randomId);

      if (data) {
        const newPokemon = await prisma.pokemon.create({
          data: {
            user: { connect: { id: session.user.id } },
            name: data.name,
            names: data.names as any,
            isShiny,
            nationalId: data.nationalId,
            generation: data.generation,
            type1: data.type1,
            type2: data.type2,
            hp: data.hp,
            attack: data.attack,
            defense: data.defense,
            spAttack: data.spAttack,
            spDefense: data.spDefense,
            speed: data.speed,
            spriteDefault: data.spriteDefault,
            spriteShiny: data.spriteShiny,
            spriteShowdown: data.spriteShowdown,
            spriteShowdownShiny: data.spriteShowdownShiny,
          },
        });
        capturedPokemonId = newPokemon.id;
        capturedPokemonIsShiny = isShiny;
      }
    }

    if (quizSession.isRewardEligible) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          score: { increment: scoreGained },
          pokeMoney: { increment: pokeMoneyGained },
          dailyQuizSessions: { increment: 1 },
          lastQuizPlayed: new Date(),
        },
      });
    } else {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { lastQuizPlayed: new Date() },
      });
    }

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        answers: answers,
        scoreGained,
        pokeMoneyGained,
        pokemonCapturedId: capturedPokemonId,
      },
    });

    return NextResponse.json({
      sessionId,
      correctAnswers,
      totalQuestions: questions.length,
      scoreGained,
      pokeMoneyGained,
      capturedPokemonId,
      capturedPokemonIsShiny,
    });
  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
