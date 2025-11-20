"use client";

import { useTranslations } from "next-intl";
import { Zap, Sparkles, Trophy } from "lucide-react";
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center p-6 text-center">
    <div className="mb-4 rounded-full bg-primary/10 p-4 text-neutral-200">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="mb-2 text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function Features() {
  const t = useTranslations("HomePage.features");

  const featuresList = [
    {
      icon: Zap,
      title: t("quiz.title"),
      description: t("quiz.description"),
    },
    {
      icon: Sparkles,
      title: t("collection.title"),
      description: t("collection.description"),
    },
    {
      icon: Trophy,
      title: t("leaderboard.title"),
      description: t("leaderboard.description"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {featuresList.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
