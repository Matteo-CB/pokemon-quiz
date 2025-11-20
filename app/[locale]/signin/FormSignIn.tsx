"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validStarters } from "@/lib/validStarter";
import { useTranslations } from "next-intl";

type SignupForm = {
  email: string;
  name: string;
  password: string;
  starter?: string;
};

interface Pokemon {
  id: number;
  name: string;
  names: Record<string, string>;
  sprite: string;
  isShiny: boolean;
}

const FormSignIn = () => {
  const router = useRouter();
  const t = useTranslations("FormSignIn");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    email: "",
    name: "",
    password: "",
    starter: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  function validateName(name: string): string | null {
    if (!name) return t("errors.nameRequired"); // Utilisation de t()
    if (name.length < 3) return t("errors.nameTooShort"); // Utilisation de t()
    if (name.length > 20) return t("errors.nameTooLong"); // Utilisation de t()
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      return t("errors.nameInvalidChars"); // Utilisation de t()
    }
    return null;
  }

  useEffect(() => {
    const chosen = validStarters.sort(() => 0.5 - Math.random()).slice(0, 3);

    Promise.all(
      chosen.map(async (name) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const namesDict: Record<string, string> = {};
        speciesData.names.forEach((n: any) => {
          namesDict[n.language.name] = n.name;
        });

        const shiny = Math.floor(Math.random() * 500) === 0;

        const sprite =
          shiny && data.sprites.front_shiny
            ? data.sprites.front_shiny
            : data.sprites.front_default;

        return {
          id: data.id,
          name: data.name,
          names: namesDict,
          sprite,
          isShiny: shiny && !!data.sprites.front_shiny,
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
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError(t("errors.missingFields"));
      return;
    }
    if (form.password.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }
    if (!selected) {
      setError(t("errors.noStarter"));
      return;
    }
    const nameError = validateName(form.name);
    if (nameError) {
      setError(nameError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          starter: selected.name,
          isShiny: selected.isShiny,
          starterSprite: selected.sprite,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("errors.signupFailed"));
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(t("errors.server"));
    } finally {
      setLoading(false);
    }
  }

  if (!spritesLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative w-16 h-16 animate-spin">
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-500 to-pink-500 [clip-path:polygon(50%_0%,100%_0%,100%_100%,50%_100%)]"></div>
          <div className="absolute inset-0 rounded-full bg-neutral-50 [clip-path:polygon(0%_0%,50%_0%,50%_100%,0%_100%)]"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black -translate-x-1/2"></div>
          <div className="absolute inset-0 rounded-full border-4 border-black"></div>
        </div>

        <p className="mt-4 text-neutral-300 text-lg">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-neutral-900 p-6 rounded-xl text-neutral-50 mx-2"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-200"
          >
            {t("email.label")}
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("email.placeholder")}
            required
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-200"
          >
            {t("name.label")}
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("name.placeholder")}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-200"
          >
            {t("password.label")}
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("password.placeholder")}
            required
          />
        </div>

        <div>
          <p className="font-semibold mb-2">{t("starter.choose")}</p>
          <div className="flex gap-4 justify-center">
            {starters.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => {
                  setSelected(p);
                  setForm((f) => ({ ...f, starter: p.name }));
                }}
                className={`p-2 rounded-xl border-2 transition ${
                  selected?.id === p.id
                    ? p.isShiny
                      ? "border-yellow-400 drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
                      : "border-purple-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={p.sprite}
                  alt={p.name}
                  className="w-24 h-24 object-contain"
                />
                <p className="capitalize text-sm text-center">
                  {p.names?.fr ?? p.name}{" "}
                  {p.isShiny && (
                    <span className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400">
                      ✨
                    </span>
                  )}
                </p>
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-neutral-400 text-center">
          {t("starter.shinyInfo")}
        </p>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-purple-600 hover:bg-purple-700 transition-colors p-2 font-semibold disabled:opacity-60"
        >
          {loading ? t("buttons.loading") : t("buttons.submit")}
        </button>
        <p className="text-xs text-neutral-500 text-center px-4">
          {t("agreement.prefix")}{" "}
          <a
            href="/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 underline hover:text-purple-300 transition"
          >
            {t("agreement.terms")}
          </a>{" "}
          {t("agreement.and")}{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 underline hover:text-purple-300 transition"
          >
            {t("agreement.policy")}
          </a>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        {t("login.prompt")}{" "}
        <a
          href="/login"
          className="text-purple-400 underline hover:text-purple-300 transition"
        >
          {t("login.link")}
        </a>
      </p>
    </div>
  );
};

export default FormSignIn;
