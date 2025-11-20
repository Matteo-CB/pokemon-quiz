import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import QuizGame from "./QuizGame";
import type { QuizQuestion } from "@/lib/quiz-helpers";

const prisma = new PrismaClient();

type PageProps = {
  // Notez que params est maintenant une Promise
  params: Promise<{
    locale: string;
    quizType: string;
    sessionId: string;
  }>;
};

export interface QuizSessionData {
  sessionId: string;
  questions: QuizQuestion[];
  isRewardEligible: boolean;
}

export default async function QuizGamePage({ params }: PageProps) {
  // --- CORRECTION CRITIQUE : AWAIT PARAMS ---
  const { locale, sessionId, quizType } = await params;

  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const quizSession = await prisma.quizSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id,
      // On filtre aussi par type pour être sûr
      type: quizType,
    },
  });

  if (!quizSession) {
    notFound();
  }

  // Si le quiz est déjà fini, on redirige vers les résultats
  if (quizSession.status === "completed") {
    redirect(`/quiz/results/${sessionId}`);
  }

  const sessionData: QuizSessionData = {
    sessionId: quizSession.id,
    questions: (quizSession.questions as unknown as QuizQuestion[]) ?? [],
    isRewardEligible: quizSession.isRewardEligible,
  };

  const t = await getTranslations("QuizPage");

  // Vérification de sécurité pour le titre
  const titleKey =
    quizType === "strategic" || quizType === "culture"
      ? `${quizType}.title`
      : "title"; // Fallback générique

  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
          {t(titleKey)}
        </h1>
      </div>
      <QuizGame initialSessionData={sessionData} />
    </div>
  );
}
