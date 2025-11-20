"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface PokedleGameOverProps {
  gameMessage: string;
  rewardMessage: string;
}

export const PokedleGameOver: React.FC<PokedleGameOverProps> = ({
  gameMessage,
  rewardMessage,
}) => {
  const { status } = useSession();
  const t = useTranslations("Pokedle");

  return (
    <div className="mt-8 text-center bg-linear-to-br from-neutral-800 to-neutral-900 border border-neutral-700 p-6 rounded-lg max-w-md mx-auto shadow-xl">
      <h2 className="text-4xl font-extrabold mb-4">{gameMessage}</h2>
      <p className="text-xl text-neutral-200 mb-6">{rewardMessage}</p>
      {status === "unauthenticated" && (
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            className="transition-transform duration-200 hover:scale-105"
          >
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="transition-transform duration-200 hover:scale-105"
          >
            <Link href="/signin">{t("signin")}</Link>
          </Button>
        </div>
      )}
      {status === "authenticated" && (
        <Button
          asChild
          className="transition-transform duration-200 hover:scale-105"
        >
          <Link href="/pokedex">{t("viewPokedex")}</Link>
        </Button>
      )}
    </div>
  );
};
