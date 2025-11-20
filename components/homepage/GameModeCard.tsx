"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { ShineBorder } from "../ui/shine-border";

interface GameModeCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  disabled?: boolean;
}

export function GameModeCard({
  href,
  icon: Icon,
  title,
  description,
  disabled = false,
}: GameModeCardProps): React.JSX.Element {
  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-lg border p-6 shadow-xl",
        "border-neutral-700 bg-neutral-900/50",
        "transition-all duration-300 ease-in-out", // Ajout de ease-in-out pour une transition plus douce
        disabled
          ? "cursor-not-allowed opacity-50 grayscale"
          : "hover:border-purple-500 hover:shadow-purple-500/20 hover:-translate-y-1" // Effet de survol: bordure violette, ombre légère, et légère élévation
      )}
    >
      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-purple-400">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>

      <ShineBorder
        className="rounded-lg"
        shineColor={["#A000FF", "#C000FF"]}
        borderWidth={1}
      />
    </div>
  );

  if (disabled) {
    return <div className="group w-full h-full">{content}</div>;
  }

  return (
    <Link href={href} className="group w-full h-full block">
      {content}
    </Link>
  );
}
