export interface PokedlePokemon {
  nationalId: number;
  name: string;
  names: Record<string, string>;
  generation: number;
  type1: string;
  type2: string | null;
  height: number;
  weight: number;

  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;

  spriteDefault: string | null;
  spriteShiny: string | null;
  spriteBack: string | null;
  spriteBackShiny: string | null;
  spriteHome: string | null;
  spriteDream: string | null;
  spriteOfficial: string | null;
  spriteShowdown: string | null;
  spriteShowdownShiny: string | null;
}

export type GuessComparison = "correct" | "incorrect" | "partial";
export type GuessComparisonNumber = "correct" | "higher" | "lower";

export interface PokedleGuess {
  guessName: string;
  sprite: string;

  generation: number;
  type1: string;
  type2: string | null;
  height: number;
  weight: number;

  generationComparison: GuessComparisonNumber;
  typeComparison: GuessComparison;
  heightComparison: GuessComparisonNumber;
  weightComparison: GuessComparisonNumber;
}
