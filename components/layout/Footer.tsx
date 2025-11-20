"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import React from "react";

export default function Footer(): React.JSX.Element {
  const t: (key: string) => string = useTranslations("Footer");

  return (
    <footer className="border-t border-neutral-800 bg-background/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p>{t("copyright")}</p>
            <p>
              {t("madeBy")}{" "}
              <a
                href={t("creatorLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                {t("creatorName")}
              </a>
              .
            </p>
            <p>
              {t("hostedBy")}{" "}
              <a
                href={t("vercelLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Vercel
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/legal-notice" className="hover:underline">
              {t("legalNotice")}
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms-of-use" className="hover:underline">
              {t("termsOfUse")}
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-muted-foreground">
          <p>
            {t("poweredBy")}{" "}
            <a
              href={t("nextjsLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </a>{" "}
            &{" "}
            <a
              href={t("pokeapiLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              PokéAPI
            </a>
            .
          </p>
          <p className="mt-2">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
