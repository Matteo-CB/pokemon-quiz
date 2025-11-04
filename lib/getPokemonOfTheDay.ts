export interface PokemonStat {
  name: string;
  value: number;
}

export interface LocalizedName {
  name: string;
  language: string;
}

export interface LocalizedDescription {
  text: string;
  language: string;
}

export interface PokemonOfTheDay {
  id: number;
  names: LocalizedName[];
  descriptions: LocalizedDescription[];
  stats: PokemonStat[];
  sprite: string;
  shiny: string;
  type1: string;
  type2?: string | null;
}

// --- Types de la PokéAPI ---
interface PokeAPIStat {
  base_stat: number;
  stat: { name: string };
}

interface PokeAPIType {
  slot: number;
  type: { name: string };
}

interface PokeAPISprites {
  other: {
    showdown: {
      front_default: string;
      front_shiny: string;
    };
  };
}

interface PokeAPIPokemon {
  id: number;
  name: string;
  stats: PokeAPIStat[];
  types: PokeAPIType[];
  sprites: PokeAPISprites;
  species: { url: string };
}

interface PokeAPISpeciesName {
  name: string;
  language: { name: string };
}

interface PokeAPISpeciesFlavorText {
  flavor_text: string;
  language: { name: string };
}

interface PokeAPISpecies {
  names: PokeAPISpeciesName[];
  flavor_text_entries: PokeAPISpeciesFlavorText[];
}

// --- Fonction principale ---
export async function getPokemonOfTheDay(
  locale: string
): Promise<PokemonOfTheDay> {
  const today: Date = new Date();
  const dayOfYear: number = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const totalPokemon: number = 1010;
  const pokemonId: number = (dayOfYear % totalPokemon) + 1;

  // Données principales
  const res: Response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon data for ID ${pokemonId}`);
  }
  const data: PokeAPIPokemon = await res.json();

  // Données espèces (noms + descriptions)
  const speciesRes: Response = await fetch(data.species.url);
  if (!speciesRes.ok) {
    throw new Error(`Failed to fetch species data for Pokémon ID ${pokemonId}`);
  }
  const speciesData: PokeAPISpecies = await speciesRes.json();

  // Construction de l’objet final
  return {
    id: data.id,
    names: speciesData.names.map((n) => ({
      name: n.name,
      language: n.language.name,
    })),
    descriptions: speciesData.flavor_text_entries.map((e) => ({
      text: e.flavor_text.replace(/\n|\f/g, " "),
      language: e.language.name,
    })),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    sprite: data.sprites.other.showdown.front_default,
    shiny: data.sprites.other.showdown.front_shiny,
    type1: data.types.find((t) => t.slot === 1)?.type.name ?? "unknown",
    type2: data.types.find((t) => t.slot === 2)?.type.name ?? null,
  };
}
