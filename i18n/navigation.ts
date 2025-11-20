import { createNavigation } from "next-intl/navigation";

export const locales: readonly [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "ja-Hrkt",
  "ko",
  "roomaji",
  "zh-Hans",
  "zh-Hant"
] = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "ja-Hrkt",
  "ko",
  "roomaji",
  "zh-Hans",
  "zh-Hant",
];

export const defaultLocale: "en" | "fr" = "en";
export const localePrefix: "always" | "as-needed" | "never" = "as-needed";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    localePrefix,
    defaultLocale,
  });
