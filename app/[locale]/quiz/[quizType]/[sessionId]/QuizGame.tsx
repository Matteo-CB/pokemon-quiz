"use client";

import React, { useState, useEffect, useReducer, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Loader2,
  Clock,
  Swords,
  Wrench,
  Calculator,
  BrainCircuit,
  Map,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { BorderBeam } from "@/components/ui/border-beam";
import Image from "next/image";
import type { QuizSessionData } from "./page";

const TIMER_DURATION: number = 20;

// Icônes par type de question
const questionTypeIcons: Record<string, LucideIcon> = {
  talent: Swords,
  ability: Wrench,
  "type-matchup": Calculator,
  item: HelpCircle,
  silhouette: HelpCircle,
  generation: Map,
  culture: BrainCircuit,
};

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  answers: { [questionId: string]: string };
  timer: number;
  status: "playing" | "submitting" | "completed";
  isAnswered: boolean;
}

type QuizAction =
  | { type: "SELECT_ANSWER"; payload: string }
  | { type: "TIMER_TICK" }
  | { type: "GOTO_NEXT" };

const initialState: QuizState = {
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answers: {},
  timer: TIMER_DURATION,
  status: "playing",
  isAnswered: false,
};

const createQuizReducer = (questionsCount: number) => {
  return (state: QuizState, action: QuizAction): QuizState => {
    if (state.status !== "playing" && state.status !== "submitting") {
      return state;
    }

    switch (action.type) {
      case "SELECT_ANSWER":
        if (state.isAnswered) return state;
        return {
          ...state,
          selectedAnswer: action.payload,
          isAnswered: true,
        };

      case "GOTO_NEXT": {
        if (state.currentQuestionIndex >= questionsCount - 1) {
          return { ...state, status: "submitting" };
        }
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          selectedAnswer: null,
          isAnswered: false,
          timer: TIMER_DURATION,
        };
      }

      case "TIMER_TICK": {
        if (state.isAnswered) return state;

        if (state.timer > 1) {
          return { ...state, timer: state.timer - 1 };
        }
        return {
          ...state,
          selectedAnswer: "TIMEOUT",
          isAnswered: true,
          timer: 0,
        };
      }

      default:
        return state;
    }
  };
};

export default function QuizGame({
  initialSessionData,
}: {
  initialSessionData: QuizSessionData;
}) {
  const t = useTranslations("QuizPage");
  const router = useRouter();

  const quizReducer = useMemo(
    () => createQuizReducer(initialSessionData.questions.length),
    [initialSessionData.questions.length]
  );

  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    if (state.status !== "playing" || state.isAnswered) return;

    const interval = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status, state.isAnswered]);

  useEffect(() => {
    if (state.isAnswered && state.status === "playing") {
      const timeout = setTimeout(() => {
        dispatch({ type: "GOTO_NEXT" });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [state.isAnswered, state.status]);

  useEffect(() => {
    if (state.status === "submitting") {
      const submitQuiz = async () => {
        try {
          const currentQ =
            initialSessionData.questions[state.currentQuestionIndex];
          const finalAnswers = { ...state.answers };
          if (!finalAnswers[currentQ.id]) {
            finalAnswers[currentQ.id] = state.selectedAnswer || "TIMEOUT";
          }

          const res = await fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: initialSessionData.sessionId,
              answers: finalAnswers,
            }),
          });

          const result = await res.json();
          if (res.ok) {
            router.replace(`/quiz/results/${initialSessionData.sessionId}`);
          } else {
            console.error("Submission failed", result);
          }
        } catch (error) {
          console.error("Network error", error);
        }
      };
      submitQuiz();
    }
  }, [
    state.status,
    state.answers,
    state.selectedAnswer,
    state.currentQuestionIndex,
    initialSessionData,
    router,
  ]);

  if (state.status === "submitting" || state.status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-xl text-neutral-300 mt-4">{t("submitting")}</p>
      </div>
    );
  }

  const question = initialSessionData.questions[state.currentQuestionIndex];
  const progress =
    ((state.currentQuestionIndex + 1) / initialSessionData.questions.length) *
    100;
  const TypeIcon = questionTypeIcons[question.type] ?? Swords;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl shadow-black/30 overflow-hidden">
        <BorderBeam colorFrom="#A000FF" colorTo="#E060FF" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <TypeIcon className="h-5 w-5" />
              <span>{t(`types.${question.type}`)}</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 font-semibold font-mono",
                state.timer < 5 ? "text-red-500" : "text-neutral-300"
              )}
            >
              <Clock className="h-5 w-5" />
              <span>{state.timer}s</span>
            </div>
          </div>

          <Progress value={progress} className="mb-6 h-3" />

          <p className="text-sm text-neutral-400 mb-2">
            {t("questionCount", {
              current: state.currentQuestionIndex + 1,
              total: initialSessionData.questions.length,
            })}
          </p>

          {question.imageUrl && (
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src={question.imageUrl}
                alt="Quiz visual"
                fill
                className={cn(
                  "object-contain transition-all duration-500",
                  question.type === "silhouette" && !state.isAnswered
                    ? "brightness-0 invert-[.1]"
                    : "brightness-100"
                )}
                unoptimized
              />
            </div>
          )}

          <h2 className="text-2xl font-semibold text-white min-h-[80px] mb-8 text-center flex items-center justify-center">
            {question.questionText}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => {
              let variantClass =
                "bg-neutral-800 border-neutral-700 hover:bg-neutral-700";

              if (state.isAnswered) {
                if (option === question.correctAnswer) {
                  variantClass = "bg-green-600 border-green-500 text-white";
                } else if (state.selectedAnswer === option) {
                  variantClass = "bg-red-600 border-red-500 text-white";
                } else {
                  variantClass = "opacity-50 border-neutral-800";
                }
              } else if (state.selectedAnswer === option) {
                variantClass = "bg-purple-600 border-purple-500 text-white";
              }

              return (
                <Button
                  key={option}
                  variant="outline"
                  disabled={state.isAnswered}
                  className={cn(
                    "h-auto py-4 text-base whitespace-normal justify-start text-left transition-all duration-200",
                    variantClass
                  )}
                  onClick={() =>
                    dispatch({ type: "SELECT_ANSWER", payload: option })
                  }
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
