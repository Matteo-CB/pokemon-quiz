"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const t = useTranslations("ForgotPasswordPage");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {sent ? (
        <p className="text-green-500">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t("email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          />
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
