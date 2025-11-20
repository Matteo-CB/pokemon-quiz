"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  </div>
);

type PageName = "HomePage" | "LoginPage" | "SignInPage" | "DashboardPage";

interface HowToPlayProps {
  pageName: PageName;
}

interface StepData {
  title: string;
  description: string;
}

export default function HowToPlay({
  pageName,
}: HowToPlayProps): React.JSX.Element {
  const t: (key: string) => string = useTranslations("HomePage.howToPlay");
  const tAlt: (key: string) => string = useTranslations("AltText");

  const steps: StepData[] = [
    {
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      title: t("step3.title"),
      description: t("step3.description"),
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/3 flex justify-center order-2 md:order-1">
          <Image
            src="/mysdibule.png"
            alt={tAlt("mysdibule")}
            width={300}
            height={300}
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full md:w-2/3 order-1 md:order-2">
          <div className="flex flex-col gap-8">
            {steps.map(
              (step: StepData, index: number): React.JSX.Element => (
                <Step
                  key={index}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
