"use client";

import { ShineBorder } from "@/components/ui/shine-border";

type TFunction = (key: string, values?: any) => string;

interface PokedexHeaderProps {
  t: TFunction;
  obtainedCount: number;
  totalCount: number;
}

export default function PokedexHeader({
  t,
  obtainedCount,
  totalCount,
}: PokedexHeaderProps): React.JSX.Element {
  const percentage: number =
    totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-900 to-neutral-950 p-6 shadow-2xl shadow-black/30 mb-10">
      <ShineBorder
        shineColor={["#A000FF", "#C000FF", "#E060FF"]}
        className="rounded-2xl"
      />
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-1">
            {t("title")}
          </h1>
          <p className="text-lg text-neutral-300">
            {t("subtitle", {
              count: obtainedCount,
              total: totalCount,
            })}
          </p>
        </div>
        <div className="w-full md:w-1/3 shrink-0">
          <div className="flex justify-between text-sm text-neutral-400 mb-1">
            <span>{t("progress")}</span>
            <span className="font-semibold text-white">{percentage}%</span>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden border border-neutral-600">
            <div
              className="bg-linear-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
