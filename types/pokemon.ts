import { Prisma } from "@prisma/client";

export type PokemonNames = Record<string, string>;

export type PokemonWithNames = Prisma.PokemonGetPayload<{}> & {
  names: PokemonNames;
};

export type UserWithPokemons = Prisma.UserGetPayload<{
  include: { pokemons: true };
}> & {
  pokemons: PokemonWithNames[];
};

export interface ApiPokemon {
  id: number;
  name: string;
  names: PokemonNames;
  sprite: string;
}

export interface DisplayPokemon {
  apiData: ApiPokemon;
  obtainedData: PokemonWithNames | null;
}
