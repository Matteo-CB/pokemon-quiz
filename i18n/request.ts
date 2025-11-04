// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
export const SUPPORTED_LOCALES = [
  "fr",
  "en",
  "de",
  "es",
  "it",
  "ja",
  "ja-Hrkt",
  "ko",
  "roomaji",
  "zh-Hans",
  "zh-Hant",
];

export const DEFAULT_LOCALE = "fr";
export default getRequestConfig(async () => {
  // Pour l’instant, fixe la locale à 'fr' (on pourra améliorer avec cookies ou routing)
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
