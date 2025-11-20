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
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
