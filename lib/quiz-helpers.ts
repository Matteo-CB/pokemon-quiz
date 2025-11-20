import { cache } from "react";

export interface QuizQuestion {
  id: string;
  type:
    | "talent"
    | "ability"
    | "type-matchup"
    | "item"
    | "silhouette"
    | "generation";
  questionText: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  rewardContext: {
    type: "pokemon" | "none";
    ids: number[];
  };
}

export interface QuizSession {
  id: string;
  userId: string;
  questions: QuizQuestion[];
  answers: { [questionId: string]: string };
  status: "pending" | "completed";
  scoreGained: number;
  pokeMoneyGained: number;
  pokemonCapturedId?: string | null;
}

// Helpers de traduction
const getLocalizedName = (names: any[], locale: string): string => {
  const entry =
    names.find((n: any) => n.language.name === locale) ||
    names.find((n: any) => n.language.name === "en");
  return entry ? entry.name : "Unknown";
};

const getLocalizedFlavor = (entries: any[], locale: string): string => {
  const entry =
    entries.find((e: any) => e.language.name === locale) ||
    entries.find((e: any) => e.language.name === "en");
  return entry ? entry.effect || entry.flavor_text : "No description";
};

const getRandomIds = (
  count: number,
  max: number,
  exclude: number[] = []
): number[] => {
  const ids = new Set<number>();
  // Sécurité anti-boucle
  let attempts = 0;
  while (ids.size < count && attempts < 100) {
    const id = Math.floor(Math.random() * max) + 1;
    if (!exclude.includes(id)) ids.add(id);
    attempts++;
  }
  return Array.from(ids);
};

export const generateStrategicQuestions = async (
  locale: string,
  count: number = 10
): Promise<QuizQuestion[]> => {
  const questions: QuizQuestion[] = [];
  const usedIds = new Set<string>();

  while (questions.length < count) {
    const category = Math.random();

    try {
      // 1. TALENTS (Abilities)
      if (category < 0.25) {
        const id = Math.floor(Math.random() * 250) + 1;
        if (usedIds.has(`ab-${id}`)) continue;

        const res = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
        if (!res.ok) continue;
        const data = await res.json();

        const name = getLocalizedName(data.names, locale);
        const desc = getLocalizedFlavor(data.effect_entries, locale).replace(
          name,
          "???"
        );

        const wrongIds = getRandomIds(3, 250, [id]);
        const wrongNames = await Promise.all(
          wrongIds.map(async (wid) => {
            const r = await fetch(`https://pokeapi.co/api/v2/ability/${wid}`);
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `ab-${id}`,
          type: "talent",
          questionText: desc,
          options: [name, ...wrongNames].sort(() => 0.5 - Math.random()),
          correctAnswer: name,
          rewardContext: {
            type: "pokemon",
            ids: data.pokemon.map((p: any) =>
              parseInt(p.pokemon.url.split("/")[6])
            ),
          },
        });
        usedIds.add(`ab-${id}`);

        // 2. CAPACITÉS (Moves)
      } else if (category < 0.5) {
        const id = Math.floor(Math.random() * 800) + 1;
        if (usedIds.has(`mv-${id}`)) continue;

        const res = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
        if (!res.ok) continue;
        const data = await res.json();
        if (!data.power) continue;

        const name = getLocalizedName(data.names, locale);
        const desc = getLocalizedFlavor(
          data.flavor_text_entries,
          locale
        ).replace(name, "???");

        const wrongIds = getRandomIds(3, 800, [id]);
        const wrongNames = await Promise.all(
          wrongIds.map(async (wid) => {
            const r = await fetch(`https://pokeapi.co/api/v2/move/${wid}`);
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `mv-${id}`,
          type: "ability",
          questionText: desc,
          options: [name, ...wrongNames].sort(() => 0.5 - Math.random()),
          correctAnswer: name,
          rewardContext: {
            type: "pokemon",
            ids: data.learned_by_pokemon
              ? data.learned_by_pokemon.map((p: any) =>
                  parseInt(p.url.split("/")[6])
                )
              : [],
          },
        });
        usedIds.add(`mv-${id}`);

        // 3. TYPES (Type Matchup) - UNIQUE RÉPONSE GARANTIE
      } else if (category < 0.75) {
        const id = Math.floor(Math.random() * 18) + 1;
        if (usedIds.has(`tp-${id}`)) continue;

        const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
        if (!res.ok) continue;
        const data = await res.json();

        const typeName = getLocalizedName(data.names, locale);
        const relations = data.damage_relations;
        const weakTo = relations.double_damage_from;

        if (weakTo.length === 0) continue;

        // On choisit UNE faiblesse au hasard qui sera la BONNE réponse
        const weakness = weakTo[Math.floor(Math.random() * weakTo.length)];
        const resW = await fetch(weakness.url);
        const dataW = await resW.json();
        const weaknessName = getLocalizedName(dataW.names, locale);

        // LOGIQUE CRUCIALE : On récupère les IDs de TOUTES les faiblesses
        // pour les exclure des mauvaises réponses.
        const allWeaknessIds = weakTo.map((w: any) =>
          parseInt(w.url.split("/")[6])
        );

        // On génère 3 mauvaises réponses qui ne sont NI le type lui-même, NI AUCUNE de ses faiblesses
        const excludeList = [id, ...allWeaknessIds];
        const wrongIds = getRandomIds(3, 18, excludeList);

        const wrongNames = await Promise.all(
          wrongIds.map(async (wid) => {
            const r = await fetch(`https://pokeapi.co/api/v2/type/${wid}`);
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `tp-${id}`,
          type: "type-matchup",
          questionText:
            locale === "fr"
              ? `Le type ${typeName} est faible contre quel type ?`
              : `Type ${typeName} is weak against which type?`,
          options: [weaknessName, ...wrongNames].sort(
            () => 0.5 - Math.random()
          ),
          correctAnswer: weaknessName,
          rewardContext: {
            type: "pokemon",
            ids: data.pokemon.map((p: any) =>
              parseInt(p.pokemon.url.split("/")[6])
            ),
          },
        });
        usedIds.add(`tp-${id}`);

        // 4. OBJETS (Items)
      } else {
        const id = Math.floor(Math.random() * 1000) + 1;
        if (usedIds.has(`it-${id}`)) continue;

        const res = await fetch(`https://pokeapi.co/api/v2/item/${id}`);
        if (!res.ok) continue;
        const data = await res.json();

        if (data.category.name.includes("tm") || !data.sprites.default)
          continue;

        const name = getLocalizedName(data.names, locale);
        const desc = getLocalizedFlavor(
          data.flavor_text_entries,
          locale
        ).replace(name, "???");

        const wrongIds = getRandomIds(3, 1000, [id]);
        const wrongNames = await Promise.all(
          wrongIds.map(async (wid) => {
            const r = await fetch(`https://pokeapi.co/api/v2/item/${wid}`);
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `it-${id}`,
          type: "item",
          questionText: desc,
          options: [name, ...wrongNames].sort(() => 0.5 - Math.random()),
          correctAnswer: name,
          rewardContext: { type: "none", ids: [] },
        });
        usedIds.add(`it-${id}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return questions;
};

export const generateCultureQuestions = async (
  locale: string,
  count: number = 10
): Promise<QuizQuestion[]> => {
  const questions: QuizQuestion[] = [];
  const usedIds = new Set<string>();
  const maxPokemon = 1010;

  while (questions.length < count) {
    const isSilhouette = Math.random() > 0.3;
    const id = Math.floor(Math.random() * maxPokemon) + 1;

    if (usedIds.has(`cl-${id}`)) continue;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const resSpec = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );

      if (!res.ok || !resSpec.ok) continue;

      const data = await res.json();
      const species = await resSpec.json();
      const name = getLocalizedName(species.names, locale);
      const img =
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default;

      if (isSilhouette && img) {
        const wrongIds = getRandomIds(3, maxPokemon, [id]);
        const wrongNames = await Promise.all(
          wrongIds.map(async (wid) => {
            const r = await fetch(
              `https://pokeapi.co/api/v2/pokemon-species/${wid}`
            );
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `sil-${id}`,
          type: "silhouette",
          questionText:
            locale === "fr" ? "Quel est ce Pokémon ?" : "Who's that Pokémon?",
          imageUrl: img,
          options: [name, ...wrongNames].sort(() => 0.5 - Math.random()),
          correctAnswer: name,
          rewardContext: { type: "pokemon", ids: [id] },
        });
      } else {
        const genName = species.generation.name;
        const resGen = await fetch(species.generation.url);
        const dataGen = await resGen.json();
        const properGenName = getLocalizedName(dataGen.names, locale);

        const wrongGens = [
          "generation-i",
          "generation-ii",
          "generation-iii",
          "generation-iv",
          "generation-v",
          "generation-vi",
          "generation-vii",
          "generation-viii",
          "generation-ix",
        ]
          .filter((g) => g !== genName)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const wrongGenNames = await Promise.all(
          wrongGens.map(async (g) => {
            const r = await fetch(`https://pokeapi.co/api/v2/generation/${g}`);
            const d = await r.json();
            return getLocalizedName(d.names, locale);
          })
        );

        questions.push({
          id: `gen-${id}`,
          type: "generation",
          questionText:
            locale === "fr"
              ? `De quelle génération vient ${name} ?`
              : `Which generation is ${name} from?`,
          options: [properGenName, ...wrongGenNames].sort(
            () => 0.5 - Math.random()
          ),
          correctAnswer: properGenName,
          rewardContext: { type: "pokemon", ids: [id] },
        });
      }
      usedIds.add(`cl-${id}`);
    } catch (e) {
      console.error(e);
    }
  }
  return questions;
};
