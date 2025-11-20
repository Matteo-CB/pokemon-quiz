import { PokedlePokemon } from "@/types/pokedle";
import { PokemonNames } from "@/types/pokemon";
import { getPokedleData } from "./pokedle-helpers";

// --- NOUVELLES LISTES COMPLÈTES ---

// 90+ Pokémon communs, starters, et populaires
const COMMON_IDS: number[] = [
  1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48,
  50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 90, 92, 95, 96,
  98, 100, 102, 104, 109, 111, 114, 116, 118, 120, 129, 133, 137, 152, 155, 158,
  161, 163, 165, 167, 170, 172, 173, 174, 175, 179, 183, 187, 190, 191, 193,
  200, 209, 215, 228, 261, 263, 276, 280, 298, 304, 359, 403, 570, 700,
];

// 30+ Pokémon "Forts" : Pseudos-Légendaires (base), Fossiles, et Pokémon puissants
const STRONG_IDS: number[] = [
  106, 107, 112, 113, 115, 123, 127, 128, 131, 138, 140, 142, 143, 147, 212,
  214, 227, 235, 246, 371, 374, 443, 447, 448, 633, 637, 704, 782, 885, 996,
];

// 60+ Pokémon "Rares" : Légendaires et Fabuleux
const RARE_IDS: number[] = [
  144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380,
  381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488,
  490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647,
  648, 649, 716, 717, 718, 719, 720, 721, 785, 786, 787, 788, 789, 790, 791,
  792, 800, 801, 802, 807, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897,
  898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1017, 1025,
];

// --- LE RESTE DU FICHIER RESTE INCHANGÉ ---

export interface ShopItem {
  pokemon: PokedlePokemon;
  basePrice: number;
  isShiny: boolean;
  price: number;
  type: "common" | "strong" | "rare";
}

function seededRandom(seed: number): number {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDailySeed(): number {
  const date = new Date();
  return (
    date.getUTCFullYear() * 10000 +
    (date.getUTCMonth() + 1) * 100 +
    date.getUTCDate()
  );
}

function selectRandomItem<T>(seed: number, array: T[]): T {
  return array[Math.floor(seededRandom(seed) * array.length)];
}

export async function getDailyShopItems(): Promise<ShopItem[]> {
  const seed = getDailySeed();

  const shopDefinitions = [
    {
      id: selectRandomItem(seed + 1, COMMON_IDS),
      basePrice: 100,
      type: "common" as const,
    },
    {
      id: selectRandomItem(seed + 2, COMMON_IDS),
      basePrice: 100,
      type: "common" as const,
    },
    {
      id: selectRandomItem(seed + 3, STRONG_IDS),
      basePrice: 500,
      type: "strong" as const,
    },
    {
      id: selectRandomItem(seed + 4, RARE_IDS),
      basePrice: 1200,
      type: "rare" as const,
    },
  ];

  const shinyIndex = Math.floor(seededRandom(seed + 5) * 4);

  const pokemonDataPromises = shopDefinitions.map((def) =>
    getPokedleData(def.id)
  );
  const pokemonData = await Promise.all(pokemonDataPromises);

  return pokemonData.map((pokemon, index) => {
    if (!pokemon) throw new Error("Failed to fetch shop Pokémon data");

    const def = shopDefinitions[index];
    const isShiny = index === shinyIndex;
    const price = isShiny ? def.basePrice * 5 : def.basePrice;

    return {
      pokemon,
      basePrice: def.basePrice,
      isShiny,
      price,
      type: def.type,
    };
  });
}
