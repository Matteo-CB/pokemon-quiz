import { PokemonWithNames } from "@/types/pokemon";

export function getPokemonName(
  pokemon: PokemonWithNames,
  locale: string
): string {
  return pokemon.names?.[locale] ?? pokemon.name;
}
