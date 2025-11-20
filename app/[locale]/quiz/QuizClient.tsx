"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { BorderBeam } from "@/components/ui/border-beam";
import { Swords, BrainCircuit, Loader2, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const iconMap: any = { Swords, BrainCircuit };

export default function QuizClient({ gameModes }: { gameModes: any[] }) {
  const t = useTranslations("QuizPage");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const start = async (type: string) => {
    setLoading(type);
    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        body: JSON.stringify({ type, locale }),
      });
      const data = await res.json();
      router.push(`/quiz/${type}/${data.sessionId}`);
    } catch (e) {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {gameModes.map((mode) => {
          const Icon = iconMap[mode.iconKey];
          return (
            <button
              key={mode.key}
              onClick={() => start(mode.key)}
              disabled={!!loading}
              className="group relative block overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 p-8 text-left hover:border-purple-500/50 transition-all"
            >
              <BorderBeam
                colorFrom={mode.beamColors[0]}
                colorTo={mode.beamColors[1]}
              />
              <div className="relative z-10">
                <div className="mb-4 h-14 w-14 flex items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700">
                  <Icon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {mode.title}
                </h3>
                <p className="text-neutral-400 mb-6">{mode.description}</p>
                <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
                  {loading === mode.key ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {t("playButton")} <ChevronRight />
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
