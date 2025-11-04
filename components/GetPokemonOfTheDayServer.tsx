import { ReactElement } from "react";
import { getPokemonOfTheDay, PokemonOfTheDay } from "@/lib/getPokemonOfTheDay";
import GetPokemonOfTheDayClient from "./GetPokemonOfTheDayClient";

interface Props {
  locale: string;
}

// Composant serveur Next.js
export default async function GetPokemonOfTheDayServer({
  locale,
}: Props): Promise<ReactElement> {
  const pokemon: PokemonOfTheDay = await getPokemonOfTheDay(locale);

  return <GetPokemonOfTheDayClient pokemon={pokemon} />;
}
