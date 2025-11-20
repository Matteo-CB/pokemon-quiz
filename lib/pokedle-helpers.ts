import { PokedlePokemon } from "@/types/pokedle";
import { cache } from "react";

interface PokeAPIName {
  name: string;
  url: string;
}

interface PokeAPISpecies {
  id: number;
  name: string;
  generation: { name: string };
  names: { language: { name: string }; name: string }[];
  flavor_text_entries: {
    language: { name: string };
    flavor_text: string;
  }[];
}

interface PokeAPIDetails {
  id: number;
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    back_default: string | null;
    back_shiny: string | null;
    other?: {
      home?: { front_default: string | null };
      dream_world?: { front_default: string | null };
      ["official-artwork"]?: { front_default: string | null };
      showdown?: { front_default: string | null; front_shiny: string | null };
    };
  };
  types: {
    slot: number;
    type: { name: string };
  }[];
}

export interface PokedleNameListEntry {
  name: string;
  url: string;
  names: Record<string, string>;
}

export const getPokemonNameList = cache(
  async (): Promise<PokedleNameListEntry[]> => {
    try {
      const listRes: Response = await fetch(
        "https://pokeapi.co/api/v2/pokemon-species?limit=1025"
      );
      if (!listRes.ok) throw new Error("Failed to fetch species list");

      const listData: { results: PokeAPIName[] } = await listRes.json();

      const allSpeciesData: (PokedleNameListEntry | null)[] = await Promise.all(
        listData.results.map(async (species: PokeAPIName) => {
          try {
            const res: Response = await fetch(species.url);
            if (!res.ok) throw new Error(`Failed to fetch ${species.name}`);

            const data: PokeAPISpecies = await res.json();
            const namesDict: Record<string, string> = {};
            data.names.forEach((n) => {
              namesDict[n.language.name] = n.name;
            });

            const pokemonUrl: string = `https://pokeapi.co/api/v2/pokemon/${data.id}/`;

            return {
              name: species.name,
              url: pokemonUrl,
              names: namesDict,
            };
          } catch {
            return null;
          }
        })
      );

      return allSpeciesData.filter(
        (p): p is PokedleNameListEntry => p !== null
      );
    } catch {
      return [];
    }
  }
);

export const getPokedleData = cache(
  async (id: number): Promise<PokedlePokemon | null> => {
    try {
      const [speciesRes, detailsRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      ]);

      if (!speciesRes.ok || !detailsRes.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      const species: PokeAPISpecies = await speciesRes.json();
      const details: PokeAPIDetails = await detailsRes.json();

      const namesDict: Record<string, string> = {};
      species.names.forEach((n) => {
        namesDict[n.language.name] = n.name;
      });

      const type1 =
        details.types.find((t) => t.slot === 1)?.type.name ?? "normal";
      const type2 = details.types.find((t) => t.slot === 2)?.type.name ?? null;

      const stats = {
        hp: details.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0,
        attack:
          details.stats.find((s) => s.stat.name === "attack")?.base_stat ?? 0,
        defense:
          details.stats.find((s) => s.stat.name === "defense")?.base_stat ?? 0,
        spAttack:
          details.stats.find((s) => s.stat.name === "special-attack")
            ?.base_stat ?? 0,
        spDefense:
          details.stats.find((s) => s.stat.name === "special-defense")
            ?.base_stat ?? 0,
        speed:
          details.stats.find((s) => s.stat.name === "speed")?.base_stat ?? 0,
      };

      const sprites = {
        spriteDefault: details.sprites.front_default,
        spriteShiny: details.sprites.front_shiny,
        spriteBack: details.sprites.back_default,
        spriteBackShiny: details.sprites.back_shiny,
        spriteHome: details.sprites.other?.home?.front_default ?? null,
        spriteDream: details.sprites.other?.dream_world?.front_default ?? null,
        spriteOfficial:
          details.sprites.other?.["official-artwork"]?.front_default ?? null,
        spriteShowdown: details.sprites.other?.showdown?.front_default ?? null,
        spriteShowdownShiny:
          details.sprites.other?.showdown?.front_shiny ?? null,
      };

      const generationMap: Record<string, number> = {
        "generation-i": 1,
        "generation-ii": 2,
        "generation-iii": 3,
        "generation-iv": 4,
        "generation-v": 5,
        "generation-vi": 6,
        "generation-vii": 7,
        "generation-viii": 8,
        "generation-ix": 9,
      };

      return {
        nationalId: species.id,
        name: species.name,
        names: namesDict,
        generation: generationMap[species.generation.name] ?? 0,
        type1,
        type2,
        height: details.height / 10,
        weight: details.weight / 10,
        ...stats,
        ...sprites,
      };
    } catch {
      return null;
    }
  }
);
