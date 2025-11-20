"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HowToPlay from "@/components/homepage/HowToPlay";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(t("errors.invalidCredentials"));
    } else {
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4 bg-neutral-900 p-6 rounded-xl text-neutral-50"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("email.placeholder")}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 p-2 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("password.placeholder")}
            required
          />
          <div className="mt-2 text-right">
            <a
              href="/forgot-password"
              className="text-sm text-purple-400 underline hover:text-purple-300 transition"
            >
              {t("password.forgot")}
            </a>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-purple-600 hover:bg-purple-700 transition-colors p-2 font-semibold disabled:opacity-60"
        >
          {loading ? t("buttons.loading") : t("buttons.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        {t("signup.prompt")}{" "}
        <a
          href="/signin"
          className="text-purple-400 underline hover:text-purple-300 transition"
        >
          {t("signup.link")}
        </a>
      </p>
    </div>
  );
}
