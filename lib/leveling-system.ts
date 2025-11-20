import type { PokemonNames } from "@/types/pokemon";

// C'est la DÉFINITION de base dans votre Map
export interface RewardDefinition {
  pokemonId: number;
  isShiny?: boolean;
  type: "normal" | "pseudo" | "legendary" | "mythical";
}

// C'est l'objet ENRICHI que le client s'attend à recevoir
export interface EnrichedRewardPokemon {
  pokemonId: number;
  isShiny?: boolean;
  type: "normal" | "pseudo" | "legendary" | "mythical";
  name: string; // Ajouté
  names: PokemonNames; // Ajouté
}

const SCORE_CONSTANT: number = 18;
const EXPONENT: number = 2.5;

export const getTotalScoreForLevel = (level: number): number => {
  if (level === 0) return 0;
  return Math.floor(SCORE_CONSTANT * level ** EXPONENT);
};

export const getLevelFromScore = (score: number): number => {
  if (score < getTotalScoreForLevel(1)) return 0;
  return Math.max(0, Math.floor((score / SCORE_CONSTANT) ** (1 / EXPONENT)));
};

// Votre liste de 110 récompenses, sans doublons
export const REWARD_LEVELS: Map<number, RewardDefinition> = new Map([
  [2, { pokemonId: 19, type: "normal" }], // Rattata
  [4, { pokemonId: 16, type: "normal" }], // Roucool
  [6, { pokemonId: 172, type: "normal" }], // Pichu
  [8, { pokemonId: 10, type: "normal" }], // Chenipan
  [10, { pokemonId: 13, type: "normal" }], // Aspicot
  [12, { pokemonId: 41, type: "normal" }], // Nosferapti
  [14, { pokemonId: 52, type: "normal" }], // Miaouss
  [16, { pokemonId: 1, type: "normal" }], // Bulbizarre
  [18, { pokemonId: 4, type: "normal" }], // Salamèche
  [20, { pokemonId: 7, type: "normal" }], // Carapuce
  [22, { pokemonId: 29, type: "normal" }], // Nidoran♀
  [24, { pokemonId: 32, type: "normal" }], // Nidoran♂
  [26, { pokemonId: 37, type: "normal" }], // Goupix
  [28, { pokemonId: 50, type: "normal" }], // Taupiqueur
  [30, { pokemonId: 60, type: "normal" }], // Ptitard
  [32, { pokemonId: 66, type: "normal" }], // Machoc
  [34, { pokemonId: 74, type: "normal" }], // Racaillou
  [36, { pokemonId: 81, type: "normal" }], // Magnéti
  [38, { pokemonId: 92, type: "normal" }], // Fantominus
  [40, { pokemonId: 95, type: "normal" }], // Onix
  [42, { pokemonId: 104, type: "normal" }], // Osselait
  [44, { pokemonId: 116, type: "normal" }], // Hypotrempe
  [46, { pokemonId: 123, type: "normal" }], // Insécateur
  [48, { pokemonId: 127, type: "normal" }], // Scarabrute
  [50, { pokemonId: 129, isShiny: true, type: "normal" }], // Magicarpe Shiny
  [52, { pokemonId: 1007, type: "normal" }], // Minidraco de Galar
  [54, { pokemonId: 137, type: "normal" }], // Porygon
  [56, { pokemonId: 143, type: "normal" }], // Ronflex
  [58, { pokemonId: 152, type: "normal" }], // Germignon
  [60, { pokemonId: 1011, type: "normal" }], // Axoloto de Paldea
  [62, { pokemonId: 158, type: "normal" }], // Kaiminus
  [64, { pokemonId: 175, type: "normal" }], // Togepi
  [66, { pokemonId: 196, type: "normal" }], // Mentali
  [68, { pokemonId: 197, type: "normal" }], // Noctali
  [70, { pokemonId: 212, type: "normal" }], // Cizayox
  [72, { pokemonId: 1008, type: "normal" }], // Caninos de Hisui
  [74, { pokemonId: 235, type: "normal" }], // Queulorior
  [76, { pokemonId: 252, type: "normal" }], // Arcko
  [78, { pokemonId: 255, type: "normal" }], // Poussifeu
  [80, { pokemonId: 258, type: "normal" }], // Gobou
  [82, { pokemonId: 280, type: "normal" }], // Tarsal
  [84, { pokemonId: 246, type: "pseudo" }], // Embrylex
  [86, { pokemonId: 304, type: "normal" }], // Galekid
  [88, { pokemonId: 359, type: "normal" }], // Absol
  [90, { pokemonId: 133, isShiny: true, type: "normal" }], // Évoli Shiny
  [92, { pokemonId: 371, type: "pseudo" }], // Draby
  [94, { pokemonId: 387, type: "normal" }], // Tortipouss
  [96, { pokemonId: 390, type: "normal" }], // Ouisticram
  [98, { pokemonId: 393, type: "normal" }], // Tiplouf
  [100, { pokemonId: 447, type: "normal" }], // Riolu
  [102, { pokemonId: 442, type: "normal" }], // Spiritomb
  [104, { pokemonId: 374, type: "pseudo" }], // Terhal
  [106, { pokemonId: 403, type: "normal" }], // Lixy
  [108, { pokemonId: 443, type: "pseudo" }], // Griknot
  [110, { pokemonId: 495, type: "normal" }], // Vipélierre
  [112, { pokemonId: 498, type: "normal" }], // Gruikui
  [114, { pokemonId: 501, type: "normal" }], // Moustillon
  [116, { pokemonId: 570, type: "normal" }], // Zorua
  [118, { pokemonId: 149, isShiny: true, type: "pseudo" }], // Dracolosse Shiny
  [120, { pokemonId: 633, type: "pseudo" }], // Solochi
  [122, { pokemonId: 650, type: "normal" }], // Marisson
  [124, { pokemonId: 653, type: "normal" }], // Feunnec
  [126, { pokemonId: 656, type: "normal" }], // Grenousse
  [128, { pokemonId: 144, type: "legendary" }], // Artikodin
  [130, { pokemonId: 145, type: "legendary" }], // Électhor
  [132, { pokemonId: 146, type: "legendary" }], // Sulfura
  [134, { pokemonId: 704, type: "pseudo" }], // Mucuscule
  [136, { pokemonId: 722, type: "normal" }], // Brindibou
  [138, { pokemonId: 725, type: "normal" }], // Flamiaou
  [140, { pokemonId: 728, type: "normal" }], // Otaquin
  [142, { pokemonId: 376, isShiny: true, type: "pseudo" }], // Métalosse Shiny
  [144, { pokemonId: 888, type: "legendary" }], // Zacian
  [146, { pokemonId: 889, type: "legendary" }], // Zamazenta
  [148, { pokemonId: 243, type: "legendary" }], // Raikou
  [150, { pokemonId: 244, type: "legendary" }], // Entei
  [152, { pokemonId: 245, type: "legendary" }], // Suicune
  [154, { pokemonId: 906, type: "normal" }], // Poussacha
  [156, { pokemonId: 909, type: "normal" }], // Chochodile
  [158, { pokemonId: 912, type: "normal" }], // Coiffeton
  [160, { pokemonId: 890, type: "legendary" }], // Éthernatos
  [162, { pokemonId: 785, type: "normal" }], // Tokorico
  [164, { pokemonId: 491, type: "mythical" }], // Darkrai
  [166, { pokemonId: 492, type: "mythical" }], // Shaymin
  [168, { pokemonId: 648, type: "mythical" }], // Meloetta
  [170, { pokemonId: 483, type: "legendary" }], // Dialga
  [172, { pokemonId: 484, type: "legendary" }], // Palkia
  [174, { pokemonId: 644, type: "legendary" }], // Zekrom
  [176, { pokemonId: 643, type: "legendary" }], // Reshiram
  [178, { pokemonId: 383, type: "legendary" }], // Groudon
  [180, { pokemonId: 384, isShiny: true, type: "legendary" }], // Rayquaza Shiny
  [181, { pokemonId: 251, isShiny: true, type: "mythical" }], // Célébi Shiny
  [182, { pokemonId: 382, type: "legendary" }], // Kyogre
  [183, { pokemonId: 385, isShiny: true, type: "mythical" }], // Jirachi Shiny
  [184, { pokemonId: 250, type: "legendary" }], // Ho-Oh
  [185, { pokemonId: 386, isShiny: true, type: "mythical" }], // Deoxys Shiny
  [186, { pokemonId: 150, type: "legendary" }], // Mewtwo
  [187, { pokemonId: 490, isShiny: true, type: "mythical" }], // Manaphy Shiny
  [188, { pokemonId: 487, type: "legendary" }], // Giratina
  [189, { pokemonId: 491, isShiny: true, type: "mythical" }], // Darkrai Shiny
  [190, { pokemonId: 249, isShiny: true, type: "legendary" }], // Lugia Shiny
  [191, { pokemonId: 492, isShiny: true, type: "mythical" }], // Shaymin Shiny
  [192, { pokemonId: 719, type: "mythical" }], // Diancie
  [193, { pokemonId: 494, isShiny: true, type: "mythical" }], // Victini Shiny
  [194, { pokemonId: 721, type: "mythical" }], // Volcanion
  [195, { pokemonId: 649, isShiny: true, type: "mythical" }], // Genesect Shiny
  [196, { pokemonId: 151, isShiny: true, type: "mythical" }], // Mew Shiny
  [197, { pokemonId: 720, isShiny: true, type: "mythical" }], // Hoopa Shiny
  [198, { pokemonId: 802, type: "mythical" }], // Marshadow
  [199, { pokemonId: 807, isShiny: true, type: "mythical" }], // Zeraora Shiny
  [200, { pokemonId: 493, type: "mythical" }], // Arceus
]);
