import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalPageLayout from "../LegalPageLayout";
import type { Metadata } from "next";

type PageProps = {
  params: { locale: string };
};

// Petit composant helper pour structurer le contenu
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
    title: t("terms.title"),
    description: t("terms.description"),
  };
}

export default async function TermsOfUsePage({
  params: { locale },
}: PageProps): Promise<React.JSX.Element> {
  setRequestLocale(locale);
  const t = await getTranslations("TermsPage");

  const emailContact = "pokequizapp@gmail.com";

  return (
    <LegalPageLayout title={t("title")}>
      <p className="text-base text-neutral-400">
        <strong>{t("lastUpdated")}</strong>
      </p>
      <p>{t("introduction.p1")}</p>

      <LegalSection title={t("acceptance.title")}>
        <p>{t("acceptance.p1")}</p>
      </LegalSection>

      <LegalSection title={t("userAccount.title")}>
        <p>{t("userAccount.p1")}</p>
        <ul>
          <li>{t("userAccount.li1")}</li>
          <li>{t("userAccount.li2")}</li>
          <li>{t("userAccount.li3")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("intellectualProperty.title")}>
        <h4>{t("intellectualProperty.sectionA.title")}</h4>
        <p>{t("intellectualProperty.sectionA.p1")}</p>
        <h4>{t("intellectualProperty.sectionB.title")}</h4>
        <p>
          {t("intellectualProperty.sectionB.p1_prefix")}{" "}
          <strong>{t("intellectualProperty.sectionB.p1_bold")}</strong>{" "}
          {t("intellectualProperty.sectionB.p1_suffix")}{" "}
          <a
            href={t("intellectualProperty.sectionB.p1_link_url")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("intellectualProperty.sectionB.p1_link_text")}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title={t("userContent.title")}>
        <p>{t("userContent.p1")}</p>
      </LegalSection>

      <LegalSection title={t("virtualCurrency.title")}>
        <p>{t("virtualCurrency.p1")}</p>
        <ul>
          <li>
            {t("virtualCurrency.li1_prefix")}{" "}
            <strong>{t("virtualCurrency.li1_bold")}</strong>
            {t("virtualCurrency.li1_suffix")}
          </li>
          <li>{t("virtualCurrency.li2")}</li>
          <li>{t("virtualCurrency.li3")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("conductRules.title")}>
        <p>{t("conductRules.p1")}</p>
        <ul>
          <li>{t("conductRules.li1")}</li>
          <li>{t("conductRules.li2")}</li>
          <li>{t("conductRules.li3")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("termination.title")}>
        <p>{t("termination.p1")}</p>
      </LegalSection>

      <LegalSection title={t("liabilityLimit.title")}>
        <p>{t("liabilityLimit.p1")}</p>
      </LegalSection>

      <LegalSection title={t("applicableLaw.title")}>
        <p>{t("applicableLaw.p1")}</p>
      </LegalSection>

      <LegalSection title={t("contact.title")}>
        <p>
          {t("contact.p1_prefix")} <strong>{emailContact}</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
