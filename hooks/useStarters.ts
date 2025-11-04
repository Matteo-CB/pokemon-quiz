import { useEffect, useState } from "react";
import { validStarters } from "@/lib/validStarter";

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  isShiny: boolean;
}

export function useStarters(language: string) {
  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [spritesLoaded, setSpritesLoaded] = useState(false);

  useEffect(() => {
    const chosen = validStarters.sort(() => 0.5 - Math.random()).slice(0, 3);

    Promise.all(
      chosen.map(async (name) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`
        );
        const data = await res.json();

        const translatedName =
          data.names.find((n: any) => n.language.name === language)?.name ||
          data.name;

        const pokeRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );
        const pokeData = await pokeRes.json();

        const shiny = Math.floor(Math.random() * 500) === 0;
        const sprite =
          shiny && pokeData.sprites.front_shiny
            ? pokeData.sprites.front_shiny
            : pokeData.sprites.front_default;

        return {
          id: pokeData.id,
          name: translatedName,
          sprite,
          isShiny: shiny && !!pokeData.sprites.front_shiny,
        } as Pokemon;
      })
    ).then(async (results) => {
      await Promise.all(
        results.map(
          (p) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = p.sprite;
              const timer = setTimeout(() => resolve(), 3000);
              img.onload = () => {
                clearTimeout(timer);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timer);
                resolve();
              };
            })
        )
      );
      setStarters(results);
      setSpritesLoaded(true);
    });
  }, [language]);

  return { starters, spritesLoaded };
}
