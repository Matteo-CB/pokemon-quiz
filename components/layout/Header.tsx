"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter as useIntlRouter } from "@/i18n/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { LineShadowText } from "../ui/line-shadow-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import React, { useTransition } from "react";

const Logo: React.FC = () => (
  <Link
    href="/"
    className="text-2xl font-bold transition-opacity hover:opacity-80"
  >
    Poke
    <LineShadowText className="italic" shadowColor={"white"}>
      Quiz
    </LineShadowText>
  </Link>
);

interface LocaleInfo {
  code: string;
  nameKey: string;
}

const locales: LocaleInfo[] = [
  { code: "de", nameKey: "de" },
  { code: "en", nameKey: "en" },
  { code: "es", nameKey: "es" },
  { code: "fr", nameKey: "fr" },
  { code: "it", nameKey: "it" },
  { code: "ja", nameKey: "ja" },
  { code: "ja-Hrkt", nameKey: "ja-Hrkt" },
  { code: "ko", nameKey: "ko" },
  { code: "roomaji", nameKey: "roomaji" },
  { code: "zh-Hans", nameKey: "zh-Hans" },
  { code: "zh-Hant", nameKey: "zh-Hant" },
];

const LocaleSwitcher: React.FC = () => {
  const intlRouter: ReturnType<typeof useIntlRouter> = useIntlRouter();
  const nextRouter: ReturnType<typeof useNextRouter> = useNextRouter();
  const pathname: string = usePathname();
  const currentLocale: string = useLocale();
  const t: (key: string) => string = useTranslations("Locales");
  const tHeader: (key: string) => string = useTranslations("Header");
  const [isPending, startTransition] = useTransition();

  const switchLocale = (locale: string): void => {
    startTransition((): void => {
      intlRouter.replace(pathname, { locale: locale });
      nextRouter.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">{tHeader("changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map(
          (locale: LocaleInfo): React.JSX.Element => (
            <DropdownMenuItem
              key={locale.code}
              onClick={(): void => switchLocale(locale.code)}
              disabled={currentLocale === locale.code || isPending}
            >
              {t(locale.nameKey)}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Header(): React.JSX.Element {
  const { data: session, status } = useSession();
  const t: (key: string) => string = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 backdrop-blur bg-neutral-950 supports-backdrop-filter:bg-background/5">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex gap-4">
            <Link
              href="/quiz"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {t("quizLink")}
            </Link>
            <Link
              href="/pokedex"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {t("collectionLink")}
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-100"
            >
              {t("shopLink")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <>
              <span className="hidden sm:inline text-sm text-neutral-300">
                {t("welcome")}, {session.user?.name || t("trainerFallback")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(): Promise<undefined> => signOut()}
              >
                {t("signOut")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">{t("signUp")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
