"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Info, Clock, Gift, CheckCircle } from "lucide-react";

interface PokedleInstructionsProps {
  hasPlayedToday: boolean;
  maxAttempts: number;
  captureAttempts: number;
}

const CountdownTimer: React.FC = () => {
  const t = useTranslations("Pokedle");
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
      const diff = tomorrow.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <Clock className="h-5 w-5 text-blue-400" />
      <span className="font-semibold">
        {t("reward.countdown", { time: timeLeft })}
      </span>
    </div>
  );
};

export const PokedleInstructions: React.FC<PokedleInstructionsProps> = ({
  hasPlayedToday,
  maxAttempts,
  captureAttempts,
}) => {
  const t = useTranslations("Pokedle");

  return (
    <div className="relative bg-neutral-800/50 border border-neutral-700 rounded-lg p-6 mb-8 shadow-inner max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-neutral-300">
              {t("rules.attempts", { max: maxAttempts })}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Gift className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-neutral-300">
              {t("rules.capture", { max: captureAttempts })}
            </p>
          </div>
        </div>

        <div className="md:w-px bg-neutral-700" />

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            {t("reward.dailyTitle")}
          </p>
          <div
            className={cn(
              "w-full text-center px-4 py-3 rounded-lg border",
              hasPlayedToday
                ? "bg-neutral-800 border-neutral-700 text-blue-400"
                : "bg-green-500/10 border-green-500/30 text-green-300"
            )}
          >
            {hasPlayedToday ? (
              <CountdownTimer />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="font-semibold">{t("reward.available")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
