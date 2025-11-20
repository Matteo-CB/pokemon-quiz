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
    title: t("privacy.title"),
    description: t("privacy.description"),
  };
}

export default async function PrivacyPolicyPage({
  params: { locale },
}: PageProps): Promise<React.JSX.Element> {
  setRequestLocale(locale);
  const t = await getTranslations("PrivacyPage");

  const emailContact = "pokequizapp@gmail.com";
  const companyName = "PokeQuiz"; // Remplacé par le nom du site

  return (
    <LegalPageLayout title={t("title")}>
      <p className="text-base text-neutral-400">
        <strong>{t("lastUpdated")}</strong>
      </p>

      <LegalSection title={t("introduction.title")}>
        <p>{t("introduction.p1")}</p>
        <p>
          {t("introduction.p2_prefix")} <strong>{companyName}</strong>{" "}
          {t("introduction.p2_suffix")} <strong>{emailContact}</strong>.
        </p>
      </LegalSection>

      <LegalSection title={t("dataCollection.title")}>
        <p>{t("dataCollection.p1")}</p>
        <h4>{t("dataCollection.sectionA.title")}</h4>
        <ul>
          <li>
            <strong>{t("dataCollection.sectionA.li1_title")}</strong>{" "}
            {t("dataCollection.sectionA.li1_desc")}
          </li>
          <li>
            <strong>{t("dataCollection.sectionA.li2_title")}</strong>{" "}
            {t("dataCollection.sectionA.li2_desc")}
          </li>
        </ul>
        <h4>{t("dataCollection.sectionB.title")}</h4>
        <ul>
          <li>
            <strong>{t("dataCollection.sectionB.li1_title")}</strong>{" "}
            {t("dataCollection.sectionB.li1_desc")}
          </li>
          <li>
            <strong>{t("dataCollection.sectionB.li2_title")}</strong>{" "}
            {t("dataCollection.sectionB.li2_desc")}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("dataUsage.title")}>
        <p>{t("dataUsage.p1")}</p>
        <ul>
          <li>
            <strong>{t("dataUsage.li1_title")}</strong>{" "}
            {t("dataUsage.li1_desc")}
          </li>
          <li>
            <strong>{t("dataUsage.li2_title")}</strong>{" "}
            {t("dataUsage.li2_desc")}
          </li>
          <li>
            <strong>{t("dataUsage.li3_title")}</strong>{" "}
            {t("dataUsage.li3_desc")}
          </li>
          <li>
            <strong>{t("dataUsage.li4_title")}</strong>{" "}
            {t("dataUsage.li4_desc")}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("dataSharing.title")}>
        <p>{t("dataSharing.p1")}</p>
        <ul>
          <li>
            <strong>{t("dataSharing.li1_title")}</strong>{" "}
            {t("dataSharing.li1_desc")}
          </li>
          <li>
            <strong>{t("dataSharing.li2_title")}</strong>{" "}
            {t("dataSharing.li2_desc")}
          </li>
          <li>
            <strong>{t("dataSharing.li3_title")}</strong>{" "}
            {t("dataSharing.li3_desc")}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("userRights.title")}>
        <p>{t("userRights.p1")}</p>
        <ul>
          <li>
            <strong>{t("userRights.li1_title")}</strong>{" "}
            {t("userRights.li1_desc")}
          </li>
          <li>
            <strong>{t("userRights.li2_title")}</strong>{" "}
            {t("userRights.li2_desc")}
          </li>
          <li>
            <strong>{t("userRights.li3_title")}</strong>{" "}
            {t("userRights.li3_desc")} <strong>{emailContact}</strong>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title={t("dataSecurity.title")}>
        <p>{t("dataSecurity.p1")}</p>
      </LegalSection>

      <LegalSection title={t("childrenPolicy.title")}>
        <p>{t("childrenPolicy.p1")}</p>
      </LegalSection>

      <LegalSection title={t("modifications.title")}>
        <p>{t("modifications.p1")}</p>
      </LegalSection>

      <LegalSection title={t("contact.title")}>
        <p>
          {t("contact.p1_prefix")} <strong>{emailContact}</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
