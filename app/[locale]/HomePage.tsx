"use client";

import HeroButtons from "@/components/HeroButtons";
import ListPlayers from "@/components/ListPlayers";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import Features from "@/components/homepage/Features";
import { useTranslations } from "next-intl";
import HowToPlay from "@/components/homepage/HowToPlay";
import { ShineBorder } from "@/components/ui/shine-border";
import React from "react";
import { useSession } from "next-auth/react";
import HomepageStarters from "@/components/homepage/HomepageStarters";
import GameModes from "@/components/homepage/GameModes";
import { ShopPromoCard } from "@/components/homepage/ShopPromoCard";

interface HomePageProps {
  children: React.ReactNode;
}

export default function HomePage({
  children,
}: HomePageProps): React.JSX.Element {
  const t: (key: string) => string = useTranslations("HomePage");
  const { status } = useSession();
  const shadowColor: string = "white";

  return (
    <div className="container mx-auto px-4">
      <section className="relative overflow-hidden flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-semibold select-none">
          Poke
          <LineShadowText className="italic mb-8" shadowColor={shadowColor}>
            Quiz
          </LineShadowText>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
          {t("subtitle")}
        </p>
        <div className="mt-4">
          <HeroButtons />
        </div>

        {status === "authenticated" && <ShopPromoCard />}
        {status === "unauthenticated" && <HomepageStarters />}
      </section>

      <GameModes />

      <section className="py-0 flex flex-col items-center">{children}</section>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("featuresTitle")}
        </h2>
        <Features />
      </section>

      <section className="py-16 relative bg-linear-to-br from-neutral-900 to-neutral-950 rounded-lg">
        <ShineBorder shineColor={["#7B2FF7", "#F107A3", "#FF6FB5"]} />
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("howToPlayTitle")}
        </h2>
        <HowToPlay pageName="HomePage" />
      </section>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("leaderboardTitle")}
        </h2>
        <ListPlayers />
      </section>
    </div>
  );
}
