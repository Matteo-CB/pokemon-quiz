"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BorderBeam } from "@/components/ui/border-beam";

type Props = {
  pokeMoney: number;
};

export function PokeMoneyCard({ pokeMoney }: Props) {
  const t = useTranslations("DashboardPage");

  return (
    <div
      className={cn(
        "group relative overflow-hidden mb-8 bg-linear-to-br from-neutral-900 to-neutral-950",
        "border border-neutral-700 p-6 rounded-2xl flex items-center gap-6",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:shadow-yellow-500/20 hover:border-yellow-600/50"
      )}
    >
      <div
        className="absolute inset-0 opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(234, 179, 8, 0.15), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg overflow-hidden",
          "border-yellow-600 bg-yellow-950/80 transition-all duration-300 ease-in-out",
          "group-hover:border-yellow-500"
        )}
      >
        <Image
          src="/pokemoney.png"
          alt="PokéMoney"
          width={64}
          height={64}
          className={cn(
            "w-16 h-16 object-contain drop-shadow-lg",
            "transition-transform duration-300 ease-in-out group-hover:scale-110"
          )}
          unoptimized
        />
        <BorderBeam
          colorFrom="#FFD700"
          colorTo="#FDE047"
          duration={5}
          borderWidth={3}
          className="rounded-full"
        />
      </div>

      <div className="z-10">
        <h2 className="text-lg font-semibold text-neutral-300">
          {t("pokeMoneyBalance")}
        </h2>
        <p
          className="text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-b from-yellow-300 to-yellow-500"
          style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.4)" }}
        >
          {pokeMoney.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
