import type { ApiPokemon, PokemonNames } from "@/types/pokemon";
import { cache } from "react";

interface PokeApiSpecies {
  id: number;
  name: string;
  names: { language: { name: string }; name: string }[];
}

export const getPokedexTotalCount = cache(async (): Promise<number> => {
  try {
    const res: Response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=1"
    );
    const data: { count: number } = await res.json();
    return data.count;
  } catch (error) {
    return 1025;
  }
});

export const fetchApiPokemon = cache(
  async (id: number): Promise<ApiPokemon> => {
    try {
      const speciesRes: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );

      if (!speciesRes.ok) {
        throw new Error("Failed to fetch Pokémon species data");
      }

      const species: PokeApiSpecies = await speciesRes.json();

      const namesDict: PokemonNames = {};
      species.names.forEach((n) => {
        namesDict[n.language.name] = n.name;
      });

      const spriteUrl: string = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`;

      return {
        id: species.id,
        name: species.name,
        names: namesDict,
        sprite: spriteUrl,
      };
    } catch (error) {
      return {
        id,
        name: "Missingno.",
        names: { en: "Missingno." },
        sprite: "/pokeball.png",
      };
    }
  }
);

export const fetchAllPokedex = async (): Promise<ApiPokemon[]> => {
  const total: number = await getPokedexTotalCount();

  const idsToFetch: number[] = Array.from({ length: total }, (_, i) => i + 1);

  const pokemonPromises: Promise<ApiPokemon>[] = idsToFetch.map((id) =>
    fetchApiPokemon(id)
  );

  return Promise.all(pokemonPromises);
};
