import { setRequestLocale, getTranslations } from "next-intl/server";
import QuizClient from "./QuizClient";
import React from "react";
import { CalendarClock, Gift, Star } from "lucide-react";

type PageProps = {
  params: { locale: string };
};

export default async function QuizMenuPage({ params }: PageProps) {
  setRequestLocale(params.locale);
  const t = await getTranslations("QuizPage");

  const gameModes = [
    {
      key: "strategic",
      title: t("strategic.title"),
      description: t("strategic.description"),
      iconKey: "Swords",
      beamColors: ["#A000FF", "#E060FF"],
    },
    {
      key: "culture",
      title: t("culture.title"),
      description: t("culture.description"),
      iconKey: "BrainCircuit",
      beamColors: ["#00A0FF", "#60E0FF"],
    },
  ];

  return (
    <div className="py-20 max-w-5xl mx-auto px-4">
      {/* En-tête de la page */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Client pour la sélection du mode */}
      <QuizClient gameModes={gameModes} />

      {/* Section Règles & Récompenses (Restaurée) */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 mt-16">
        <div
          className="absolute inset-0 opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(160, 0, 255, 0.15), transparent 50%)",
          }}
          aria-hidden="true"
        />
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {t("rewards.title")}
        </h2>
        <ul className="space-y-4 max-w-2xl mx-auto">
          <li className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
              <CalendarClock className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {t("rewards.li1_title")}
              </h4>
              <p className="text-neutral-300">{t("rewards.li1_desc")}</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
              <Gift className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {t("rewards.li2_title")}
              </h4>
              <p className="text-neutral-300">{t("rewards.li2_desc")}</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">
                {t("rewards.li3_title")}
              </h4>
              <p className="text-neutral-300">{t("rewards.li3_desc")}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
