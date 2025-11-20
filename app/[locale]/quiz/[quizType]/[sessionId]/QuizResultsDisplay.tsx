"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/ui/shine-border";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift } from "lucide-react";

type SubmitResult = {
  sessionId: string;
  correctAnswers: number;
  totalQuestions: number;
  scoreGained: number;
  pokeMoneyGained: number;
  capturedPokemonId: string | null;
  capturedPokemonIsShiny: boolean;
};

export default function QuizResultsDisplay({
  results,
}: {
  results: SubmitResult;
}) {
  const t = useTranslations("QuizPage");
  const locale = useLocale();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-900 to-neutral-950 p-8 shadow-2xl shadow-black/30 text-center">
      <ShineBorder
        shineColor={["#A000FF", "#C000FF", "#E060FF"]}
        className="rounded-2xl"
      />

      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-4xl font-extrabold text-white mb-4">
        {t("results.title")}
      </h1>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 mb-6">
        <p className="text-2xl text-neutral-300 mb-2">
          {t("results.score", {
            correct: results.correctAnswers,
            total: results.totalQuestions,
          })}
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-left">
            <p className="text-sm uppercase text-neutral-400">
              {t("results.xpGained")}
            </p>
            <p className="text-2xl font-bold text-purple-300">
              + {results.scoreGained.toLocaleString(locale)} XP
            </p>
          </div>
          <div className="border-l border-neutral-700" />
          <div className="text-left">
            <p className="text-sm uppercase text-neutral-400">
              {t("results.moneyGained")}
            </p>
            <p className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
              <Image
                src="/pokemoney.png"
                alt="PokéMoney"
                width={24}
                height={24}
                unoptimized
              />
              + {results.pokeMoneyGained.toLocaleString(locale)}
            </p>
          </div>
        </div>
      </div>

      {results.capturedPokemonId && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-xl font-semibold text-green-300 mb-4 flex items-center justify-center gap-2">
            <Gift className="h-5 w-5" />
            {t("results.pokemonCaptured")}
          </h3>
          <p>ID: {results.capturedPokemonId}</p>
          {results.capturedPokemonIsShiny && (
            <span className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400 ml-2 animate-pulse">
              ✨ Shiny!
            </span>
          )}
        </div>
      )}

      {!results.capturedPokemonId && (
        <p className="text-base text-neutral-400 mb-6">
          {t("results.noReward")}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="font-semibold" size="lg">
          <Link href="/quiz">{t("results.playAgain")}</Link>
        </Button>
        <Button asChild variant="outline" className="font-semibold" size="lg">
          <Link href="/dashboard">{t("results.dashboard")}</Link>
        </Button>
      </div>
    </div>
  );
}
