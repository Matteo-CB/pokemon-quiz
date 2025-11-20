"use client";

import React, { ElementType } from "react";
import {
  IconBug,
  IconDark,
  IconDragon,
  IconElectric,
  IconFairy,
  IconFighting,
  IconFire,
  IconFlying,
  IconGhost,
  IconGrass,
  IconGround,
  IconIce,
  IconNormal,
  IconPoison,
  IconPsychic,
  IconRock,
  IconSteel,
  IconWater,
} from "@pokemonle/icons-react";

const typeIconMap: Record<string, ElementType> = {
  bug: IconBug,
  dark: IconDark,
  dragon: IconDragon,
  electric: IconElectric,
  fairy: IconFairy,
  fighting: IconFighting,
  fire: IconFire,
  flying: IconFlying,
  ghost: IconGhost,
  grass: IconGrass,
  ground: IconGround,
  ice: IconIce,
  normal: IconNormal,
  poison: IconPoison,
  psychic: IconPsychic,
  rock: IconRock,
  steel: IconSteel,
  water: IconWater,
};

const PokemonTypeIcon = ({
  type,
  className,
}: {
  type: string | null;
  className?: string;
}) => {
  if (!type) return <span>-</span>;
  const IconComponent = typeIconMap[type];
  return IconComponent ? (
    <IconComponent className={className} />
  ) : (
    <span>{type}</span>
  );
};

export default PokemonTypeIcon;
