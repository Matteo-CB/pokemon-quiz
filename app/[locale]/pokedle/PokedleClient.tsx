"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  PokedlePokemon,
  PokedleGuess,
  GuessComparison,
  GuessComparisonNumber,
} from "@/types/pokedle";
import { getPokedleData, PokedleNameListEntry } from "@/lib/pokedle-helpers";
import { PokedleHeader } from "./PokedleHeader";
import { PokedleInput } from "./PokedleInput";
import { PokedleGuessGrid } from "./PokedleGuessGrid";
import { PokedleGameOver } from "./PokedleGameOver";
import { PokedleInstructions } from "./PokedleInstructions";

interface PokedleClientProps {
  allPokemonNames: PokedleNameListEntry[];
  answerPokemon: PokedlePokemon;
  lastPokedleWin: string | null;
}

const MAX_ATTEMPTS: number = 20;
const CAPTURE_ATTEMPTS: number = 8;

const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const lastWinDate = new Date(dateString);
  const today = new Date();
  return lastWinDate.toDateString() === today.toDateString();
};

export default function PokedleClient({
  allPokemonNames,
  answerPokemon,
  lastPokedleWin,
}: PokedleClientProps): React.JSX.Element {
  const t = useTranslations("Pokedle");
  const locale: string = useLocale();
  const { status } = useSession();

  const [guesses, setGuesses] = useState<PokedleGuess[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rewardMessage, setRewardMessage] = useState<string>("");
  const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(() =>
    isToday(lastPokedleWin)
  );

  const answerName: string =
    answerPokemon.names[locale] ?? answerPokemon.names["en"];

  const filteredNames = useMemo((): PokedleNameListEntry[] => {
    if (inputValue.length < 2) {
      return [];
    }
    const lowerInput: string = inputValue.toLowerCase();

    return allPokemonNames
      .filter((p: PokedleNameListEntry): boolean => {
        const localName: string | undefined = p.names[locale];
        const englishName: string = p.name.toLowerCase();

        if (localName && localName.toLowerCase().includes(lowerInput)) {
          return true;
        }
        if (englishName.includes(lowerInput)) {
          return true;
        }
        return false;
      })
      .slice(0, 5);
  }, [inputValue, allPokemonNames, locale]);

  const compareTypes = (
    guessType1: string,
    guessType2: string | null,
    answerType1: string,
    answerType2: string | null
  ): GuessComparison => {
    if (guessType1 === answerType1 && guessType2 === answerType2) {
      return "correct";
    }
    if (
      guessType1 === answerType1 ||
      guessType1 === answerType2 ||
      (guessType2 && (guessType2 === answerType1 || guessType2 === answerType2))
    ) {
      return "partial";
    }
    return "incorrect";
  };

  const compareNumber = (
    guess: number,
    answer: number
  ): GuessComparisonNumber => {
    if (guess === answer) return "correct";
    if (guess < answer) return "higher";
    return "lower";
  };

  const handleGuess = async (name: string, url: string): Promise<void> => {
    if (isProcessing || isGameOver) return;
    setIsProcessing(true);
    setInputValue("");

    const pokemonId: number = parseInt(
      url.split("/").filter(Boolean).pop() ?? "0",
      10
    );
    const guessedData: PokedlePokemon | null = await getPokedleData(pokemonId);

    if (!guessedData) {
      setIsProcessing(false);
      return;
    }

    const newGuess: PokedleGuess = {
      guessName: guessedData.names[locale] ?? guessedData.name,
      sprite: guessedData.spriteDefault ?? guessedData.spriteOfficial ?? "",
      generation: guessedData.generation,
      type1: guessedData.type1,
      type2: guessedData.type2,
      height: guessedData.height,
      weight: guessedData.weight,
      generationComparison: compareNumber(
        guessedData.generation,
        answerPokemon.generation
      ),
      typeComparison: compareTypes(
        guessedData.type1,
        guessedData.type2,
        answerPokemon.type1,
        answerPokemon.type2
      ),
      heightComparison: compareNumber(guessedData.height, answerPokemon.height),
      weightComparison: compareNumber(guessedData.weight, answerPokemon.weight),
    };

    const updatedGuesses: PokedleGuess[] = [...guesses, newGuess];
    setGuesses(updatedGuesses);

    if (guessedData.nationalId === answerPokemon.nationalId) {
      setIsGameOver(true);
      setIsRevealed(true);
      setGameMessage(t("winMessage"));
      await handleWin(updatedGuesses.length);
    } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setIsGameOver(true);
      setIsRevealed(true);
      setGameMessage(t("loseMessage", { name: answerName }));
      if (status === "unauthenticated") {
        setRewardMessage(t("reward.unauthenticated"));
      }
    }

    setIsProcessing(false);
  };

  const handleWin = async (attempts: number): Promise<void> => {
    if (status !== "authenticated") {
      setRewardMessage(t("reward.unauthenticated"));
      return;
    }

    if (hasPlayedToday) {
      const calculatedScore: number = (MAX_ATTEMPTS + 1 - attempts) * 25;
      await fetch("/api/pokedle/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nationalId: answerPokemon.nationalId,
          attempts: attempts,
        }),
      });
      setRewardMessage(
        t("reward.alreadyPlayedToday", { score: calculatedScore })
      );
      return;
    }

    if (attempts > CAPTURE_ATTEMPTS) {
      const calculatedScore: number = (MAX_ATTEMPTS + 1 - attempts) * 25;
      await fetch("/api/pokedle/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nationalId: answerPokemon.nationalId,
          attempts: 99, // Force un nombre > 8
        }),
      });
      setRewardMessage(t("reward.tooManyAttempts", { score: calculatedScore }));
      setHasPlayedToday(true);
      return;
    }

    try {
      const res: Response = await fetch("/api/pokedle/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nationalId: answerPokemon.nationalId,
          attempts: attempts,
        }),
      });

      const data: {
        messageKey: string;
        isShiny: boolean;
        score: number;
        pokeMoney: number;
      } = await res.json();

      if (!res.ok) {
        setRewardMessage(t("reward.error"));
      } else {
        setRewardMessage(
          t(data.messageKey, {
            name: answerName,
            score: data.score,
            pokeMoney: data.pokeMoney,
          }) + (data.isShiny ? ` ${t("reward.shiny")}` : "")
        );
        setHasPlayedToday(true);
      }
    } catch (error) {
      setRewardMessage(t("reward.error"));
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <PokedleHeader
        title={t("title")}
        isRevealed={isRevealed}
        answerSprite={
          answerPokemon.spriteDefault ?? answerPokemon.spriteOfficial
        }
        answerName={answerName}
        silhouetteAlt={t("silhouetteAlt")}
      />

      <PokedleInstructions
        hasPlayedToday={hasPlayedToday}
        maxAttempts={MAX_ATTEMPTS}
        captureAttempts={CAPTURE_ATTEMPTS}
      />

      {!isGameOver && (
        <PokedleInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          placeholder={t("inputPlaceholder")}
          isProcessing={isProcessing}
          filteredNames={filteredNames}
          onGuess={handleGuess}
        />
      )}
      <PokedleGuessGrid guesses={guesses} />
      {isGameOver && (
        <PokedleGameOver
          gameMessage={gameMessage}
          rewardMessage={rewardMessage}
        />
      )}
    </div>
  );
}
