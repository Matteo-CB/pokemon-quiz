"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AvatarSelector({ user }: { user: any }) {
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);
  const t = useTranslations("AvatarSelector");

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar actuel */}
      <div className="w-28 h-28 bg-neutral-800 border-2 border-purple-500 rounded-full flex items-center justify-center overflow-hidden">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={user.profilePicture || "/pokeball.png"}
            alt={user.name ?? ""}
            className="object-contain w-full h-full"
          />
          <AvatarFallback>
            {(user.name ?? "??").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Sélection du Pokémon */}
      <div className="bg-neutral-800 p-4 rounded-md">
        <p className="font-semibold mb-2">{t("choosePokemon")}</p>
        <div className="grid grid-cols-4 gap-3">
          {user.pokemons.map((p: any) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setSelectedPokemon(p)}
              className={`p-2 rounded-md border-2 transition flex flex-col items-center ${
                selectedPokemon?.id === p.id
                  ? "border-purple-500"
                  : "border-transparent"
              }`}
            >
              <Image
                src={p.spriteDefault ?? "/pokeball.png"}
                alt={p.name}
                width={64}
                height={64}
                unoptimized
                className="object-contain"
              />
              <p className="text-xs capitalize mt-1">{p.names?.fr ?? p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sprites du Pokémon sélectionné */}
      {selectedPokemon && (
        <details className="bg-neutral-800 p-4 rounded-md open">
          <summary className="cursor-pointer font-semibold">
            {t("changeAvatar", {
              name: selectedPokemon.names?.fr ?? selectedPokemon.name,
            })}
          </summary>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {(() => {
              const baseSprites = [
                selectedPokemon.spriteDefault,
                selectedPokemon.spriteBack,
                selectedPokemon.spriteHome,
                selectedPokemon.spriteDream,
                selectedPokemon.spriteOfficial,
                selectedPokemon.spriteShowdown,
              ].filter(Boolean);

              const shinySprites = selectedPokemon.isShiny
                ? [
                    selectedPokemon.spriteShiny,
                    selectedPokemon.spriteBackShiny,
                    selectedPokemon.spriteShowdownShiny,
                  ].filter(Boolean)
                : [];

              const sprites = [...baseSprites, ...shinySprites];

              return sprites.map((spriteUrl: string, idx: number) => (
                <label
                  key={`${selectedPokemon.id}-${idx}`}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <input
                    type="radio"
                    name="profilePicture"
                    value={spriteUrl}
                    defaultChecked={user.profilePicture === spriteUrl}
                    className="hidden peer"
                  />
                  <div className="w-20 h-20 flex items-center justify-center bg-neutral-900 rounded-md border-2 border-transparent peer-checked:border-purple-500 cursor-pointer">
                    <Image
                      src={spriteUrl}
                      alt={selectedPokemon.name}
                      width={80}
                      height={80}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs mt-1">
                    {selectedPokemon.names?.fr ?? selectedPokemon.name}
                  </span>
                </label>
              ));
            })()}
          </div>
        </details>
      )}
    </div>
  );
}
