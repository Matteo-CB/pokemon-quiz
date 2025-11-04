import { Prisma } from "@prisma/client";

// Typage strict pour les noms localisés
export type PokemonNames = Record<string, string>;

// Typage d’un Pokémon avec ses noms
export type PokemonWithNames = Prisma.PokemonGetPayload<{}> & {
  names: PokemonNames;
};

// Typage d’un utilisateur avec ses pokémons
export type UserWithPokemons = Prisma.UserGetPayload<{
  include: { pokemons: true };
}> & {
  pokemons: PokemonWithNames[];
};
