import React from "react";
import type { Metadata } from "next";
import {
  getPokemonNameList,
  getPokedleData,
  type PokedleNameListEntry,
} from "@/lib/pokedle-helpers";
import { PokedlePokemon } from "@/types/pokedle";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PokedleClient from "./PokedleClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: "Pokedle",
  });
  return {
    title: t("metaTitle"),
  };
}

export default async function PokedlePage({
  params,
}: {
  params: { locale: string };
}): Promise<React.JSX.Element> {
  setRequestLocale(params.locale);
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Pokedle",
  });

  const session = await getServerSession(authOptions);
  let lastPokedleWin: Date | null = null;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { lastPokedleWin: true },
    });
    lastPokedleWin = user?.lastPokedleWin ?? null;
  }

  const allPokemonNames: PokedleNameListEntry[] = await getPokemonNameList();
  const randomId: number = Math.floor(Math.random() * 1025) + 1;
  const answerPokemon: PokedlePokemon | null = await getPokedleData(randomId);

  if (!answerPokemon || allPokemonNames.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">{t("error.title")}</h1>
        <p>{t("error.message")}</p>{" "}
      </div>
    );
  }

  return (
    <PokedleClient
      allPokemonNames={allPokemonNames}
      answerPokemon={answerPokemon}
      lastPokedleWin={lastPokedleWin?.toISOString() ?? null}
    />
  );
}
