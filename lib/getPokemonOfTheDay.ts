import { getTranslations } from "next-intl/server";

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
    "official-artwork": {
      front_default: string;
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

// Fonction helper pour récupérer un Pokémon spécifique
async function fetchPokemonData(id: number): Promise<PokemonOfTheDay> {
  // 1. Fetch des données de base
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    next: { revalidate: 3600 }, // Cache pour 1 heure
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon data for ID ${id}`);
  }
  const data: PokeAPIPokemon = await res.json();

  // 2. Fetch des données de l'espèce (noms, descriptions)
  const speciesRes = await fetch(data.species.url, {
    next: { revalidate: 3600 },
  });

  if (!speciesRes.ok) {
    throw new Error(`Failed to fetch species data for Pokémon ID ${id}`);
  }
  const speciesData: PokeAPISpecies = await speciesRes.json();

  // 3. Construction de l'objet
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
    // Fallback sur l'artwork officiel si le sprite showdown manque
    sprite:
      data.sprites.other.showdown.front_default ||
      data.sprites.other["official-artwork"].front_default,
    shiny: data.sprites.other.showdown.front_shiny,
    type1: data.types.find((t) => t.slot === 1)?.type.name ?? "unknown",
    type2: data.types.find((t) => t.slot === 2)?.type.name ?? null,
  };
}

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
  const FALLBACK_ID = 25; // Pikachu

  try {
    // Tentative de récupération du Pokémon du jour
    return await fetchPokemonData(pokemonId);
  } catch (error) {
    console.error(
      `Error fetching Daily Pokemon (ID: ${pokemonId}). Falling back to Pikachu.`,
      error
    );
    // Si ça échoue, on retourne le fallback (Pikachu) pour ne pas crash le site
    try {
      return await fetchPokemonData(FALLBACK_ID);
    } catch (fallbackError) {
      // Si même Pikachu échoue, on lance l'erreur critique
      throw new Error("Critical: PokeAPI is completely unreachable.");
    }
  }
}
