"use client";
import AvatarSelector from "./AvatarSelector";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShineBorder } from "@/components/ui/shine-border";
import type { User } from "@prisma/client";
import type { PokemonWithNames } from "@/types/pokemon";

type ProfileFormProps = {
  user: User & { pokemons: PokemonWithNames[] };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [bio, setBio] = useState(user.bio ?? "");
  const t = useTranslations("ProfileForm");

  return (
    <div className="relative w-full">
      <ShineBorder
        shineColor={["#A000FF", "#C000FF", "#E060FF"]}
        className="rounded-2xl"
      />
      <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

        <form
          action="/api/user/update"
          method="POST"
          className="flex flex-col md:flex-row gap-6"
        >
          <div className="w-full md:w-1/3">
            <AvatarSelector user={user} />
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-neutral-300">
                {t("pseudo")}
              </label>
              <Input
                type="text"
                name="name"
                defaultValue={user.name ?? ""}
                className="bg-neutral-800 border-neutral-700 focus:ring-purple-500"
                disabled
              />
              {/*
                --- CORRECTION ---
                Ajout d'un champ caché pour que le 'name' soit quand même envoyé au serveur
              */}
              <input type="hidden" name="name" defaultValue={user.name ?? ""} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-neutral-300">
                {t("bio")}
              </label>
              <Textarea
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={40}
                className="bg-neutral-800 border-neutral-700 resize-none focus:ring-purple-500"
              />
              <div className="text-xs text-neutral-400 mt-1 text-right">
                {bio.length}/40 {t("characters")}
              </div>
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full md:w-auto md:self-end"
            >
              {t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
