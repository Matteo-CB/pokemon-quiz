import React from "react";
import { cn } from "@/lib/utils";

interface PokedleHeaderProps {
  title: string;
  isRevealed: boolean;
  answerSprite: string | null;
  answerName: string;
  silhouetteAlt: string;
}

// URL directe et fiable vers le sprite de Pikachu
const PIKACHU_SPRITE_URL: string =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

export const PokedleHeader: React.FC<PokedleHeaderProps> = ({
  title,
  isRevealed,
  answerSprite,
  answerName,
  silhouetteAlt,
}) => {
  // Détermine quelle URL de sprite utiliser
  const spriteToShow: string | null = isRevealed
    ? answerSprite // Si révélé : montre le sprite de la réponse
    : PIKACHU_SPRITE_URL; // Sinon : montre le sprite de Pikachu

  // Détermine le texte alt
  const altText: string = isRevealed ? answerName : silhouetteAlt;

  return (
    <>
      <h1 className="text-5xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500">
        {title}
      </h1>
      <div className="relative h-48 w-48 mx-auto mb-8">
        <img
          src={spriteToShow ?? ""}
          alt={altText}
          width={192}
          height={192}
          className={cn(
            "h-48 w-48 object-contain transition-all duration-500 ease-in-out",
            isRevealed ? "opacity-100" : "filter brightness-0 opacity-60"
          )}
        />
      </div>
    </>
  );
};
