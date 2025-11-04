"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const t = useTranslations("ResetPasswordPage");

  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? t("errors.failed"));
    else {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {done ? (
        <p className="text-green-500">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder={t("newPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          />
          {error && <p className="text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-white"
          >
            {t("button")}
          </button>
        </form>
      )}
    </div>
  );
}
