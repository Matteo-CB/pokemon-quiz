import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Gift, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz-helpers";

const prisma = new PrismaClient();
const DAILY_LIMIT = 3;

type PageProps = {
  params: { locale: string; sessionId: string };
};

export default async function QuizResultsPage({ params }: PageProps) {
  const { locale, sessionId } = params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  const quizSession = await prisma.quizSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
  });

  if (!quizSession || !user) notFound();

  let capturedPokemon = null;
  if (quizSession.pokemonCapturedId) {
    capturedPokemon = await prisma.pokemon.findUnique({
      where: { id: quizSession.pokemonCapturedId },
    });
  }

  const t = await getTranslations("QuizPage");
  const questions = quizSession.questions as unknown as QuizQuestion[];
  const answers = quizSession.answers as Record<string, string>;

  const today = new Date();
  let dailyCount = user.dailyQuizSessions;
  if (
    user.lastQuizPlayed &&
    user.lastQuizPlayed.toDateString() !== today.toDateString()
  ) {
    dailyCount = user.dailyQuizSessions;
  }
  const remaining = Math.max(0, DAILY_LIMIT - dailyCount);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-5 py-20 max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 shadow-2xl shadow-black/30">
        <ShineBorder
          shineColor={["#A000FF", "#E060FF"]}
          className="rounded-2xl"
        />

        <div className="text-center relative z-10">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {t("results.title")}
          </h1>
          <p className="text-neutral-400 mb-8">
            {t("results.remaining", { count: remaining })}
          </p>

          {/* Cartes de Score */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm uppercase text-neutral-400">
                {t("results.xpGained")}
              </p>
              <p className="text-3xl font-bold text-purple-300">
                +{quizSession.scoreGained}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase text-neutral-400">
                {t("results.moneyGained")}
              </p>
              <p className="text-3xl font-bold text-yellow-300 flex items-center justify-center gap-2">
                <span>$</span> {quizSession.pokeMoneyGained}
              </p>
            </div>
          </div>

          {/* Carte Pokémon Capturé */}
          {capturedPokemon && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8 animate-in fade-in zoom-in duration-500">
              <h3 className="text-xl font-semibold text-green-300 mb-4 flex items-center justify-center gap-2">
                <Gift className="h-5 w-5" /> {t("results.pokemonCaptured")}
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-2">
                <Image
                  src={
                    capturedPokemon.isShiny
                      ? capturedPokemon.spriteShiny!
                      : capturedPokemon.spriteDefault!
                  }
                  alt={capturedPokemon.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  unoptimized
                />
              </div>
              <p className="text-xl font-bold capitalize">
                {capturedPokemon.name}
                {capturedPokemon.isShiny && (
                  <span className="text-yellow-400 ml-2">✨</span>
                )}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="font-bold bg-purple-600 hover:bg-purple-700"
            >
              <Link href="/quiz">{t("results.playAgain")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">{t("results.dashboard")}</Link>
            </Button>
          </div>

          {/* Section Correction */}
          <div className="text-left border-t border-neutral-800 pt-8">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-neutral-500" />
              {t("results.correctionTitle")}
            </h2>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      isCorrect
                        ? "border-green-900/30 bg-green-900/10"
                        : "border-red-900/30 bg-red-900/10"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-neutral-200 mb-2">
                          {i + 1}. {q.questionText}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isCorrect ? "text-green-400" : "text-red-400"
                          )}
                        >
                          {t("results.yourAnswer")}: {userAnswer}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm font-medium text-green-400 mt-1">
                            {t("results.correctAnswer")}: {q.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
