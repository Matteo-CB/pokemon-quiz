"use client";
import AvatarSelector from "./AvatarSelector";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ProfileForm({ user }: { user: any }) {
  const [bio, setBio] = useState(user.bio ?? "");
  const t = useTranslations("ProfileForm");

  return (
    <div className="flex justify-center w-full">
      <div className="bg-neutral-900 p-6 rounded-xl mb-8 w-full max-w-6xl">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>

        <form
          action="/api/user/update"
          method="POST"
          className="flex flex-col gap-6"
        >
          {/* Avatar */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-6xl">
              <AvatarSelector user={user} />
            </div>
          </div>

          {/* Pseudo */}
          <div>
            <label className="block text-sm mb-1">{t("pseudo")}</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name ?? ""}
              className="w-full bg-neutral-800 p-2 rounded-md"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm mb-1">{t("bio")}</label>
            <textarea
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={40}
              className="w-full bg-neutral-800 p-2 rounded-md resize-none"
            />
            <div className="text-xs text-neutral-400 mt-1 text-right">
              {bio.length}/40 {t("characters")}
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-semibold"
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
}
