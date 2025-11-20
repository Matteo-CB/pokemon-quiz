import FormSignIn from "./FormSignIn";
import Features from "@/components/homepage/Features";
import HowToPlay from "@/components/homepage/HowToPlay";
import { ShineBorder } from "@/components/ui/shine-border";
import { getTranslations } from "next-intl/server";
import React from "react";

interface PageProps {
  params: {
    locale: string;
  };
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = params;
  const t = await getTranslations({
    locale,
    namespace: "HomePage",
  });

  return (
    <div className="container mx-auto px-4">
      <FormSignIn />

      <section className="py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("featuresTitle")}
        </h2>
        <Features />
      </section>

      <section className="py-16 relative bg-linear-to-br from-neutral-900 to-neutral-950 rounded-lg mb-24">
        <ShineBorder shineColor={["#7B2FF7", "#F107A3", "#FF6FB5"]} />
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("howToPlayTitle")}
        </h2>
        <HowToPlay pageName="HomePage" />
      </section>
    </div>
  );
}
