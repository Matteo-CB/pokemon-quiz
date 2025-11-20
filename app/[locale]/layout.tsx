import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import GridBg from "@/components/GridBg";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex flex-col min-h-screen h-full relative">
        <Providers>
          <div className="fixed inset-0 -z-10">
            <GridBg />
          </div>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <main className="grow relative z-10 my-10">
              {children}
              <Toaster richColors />
            </main>
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
