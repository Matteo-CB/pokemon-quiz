import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalPageLayout from "../LegalPageLayout";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: { locale: string };
};

const siteOwnerName = "Matteo CHANTÉ-BIYIKLI";
const siteOwnerAddress = "32 chemin de combes 84150 Jonquières";
const siteOwnerPhone = "06 41 37 84 41";
const siteOwnerEmail = "pokequizapp@gmail.com";

const hostName = "Vercel";
const hostCompany = "Vercel Inc.";
const hostAddress = "340 S Lemon Ave #4133, Walnut, CA 91789, USA";
const hostContact = "privacy@vercel.com";

const LegalSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-8">
    <h3>{title}</h3>
    {children}
  </section>
);

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("legal.title"),
    description: t("legal.description"),
  };
}

export default async function LegalNoticePage({
  params: { locale },
}: PageProps): Promise<React.JSX.Element> {
  setRequestLocale(locale);
  const t = await getTranslations("LegalNoticePage");
  const tTerms = await getTranslations("TermsPage");

  return (
    <LegalPageLayout title={t("title")}>
      <p className="text-base text-neutral-400">{t("lastUpdated")}</p>

      <LegalSection title={t("editorTitle")}>
        <p>
          {t("editorName")} <strong>{siteOwnerName}</strong>
        </p>
        <p>
          {t("editorAddress")} <strong>{siteOwnerAddress}</strong>
        </p>
        <p>
          {t("editorPhone")} <strong>{siteOwnerPhone}</strong>
        </p>
        <p>
          {t("editorEmail")} <strong>{siteOwnerEmail}</strong>
        </p>
        <hr />
        <p>
          {t("publishingDirector")} <strong>{siteOwnerName}</strong>
        </p>
      </LegalSection>

      <LegalSection title={t("hostingTitle")}>
        <p>
          {t("hostName")} <strong>{hostName}</strong>
        </p>
        <p>
          {t("hostCompany")} <strong>{hostCompany}</strong>
        </p>
        <p>
          {t("hostAddress")} <strong>{hostAddress}</strong>
        </p>
        <p>
          {t("hostContact")} <strong>{hostContact}</strong>
        </p>
      </LegalSection>

      <LegalSection title={t("privacyTitle")}>
        <p>
          {t("privacyContent")}{" "}
          <Link href="/privacy-policy">{t("privacyLinkText")}</Link>.
        </p>
      </LegalSection>

      <LegalSection title={t("ipTitle")}>
        <p>{tTerms("intellectualProperty.sectionA.p1")}</p>
        <p>
          {tTerms("intellectualProperty.sectionB.p1_prefix")}{" "}
          <strong>{tTerms("intellectualProperty.sectionB.p1_bold")}</strong>{" "}
          {tTerms("intellectualProperty.sectionB.p1_suffix")}{" "}
          <a
            href={tTerms("intellectualProperty.sectionB.p1_link_url")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tTerms("intellectualProperty.sectionB.p1_link_text")}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
