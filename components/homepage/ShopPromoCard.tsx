"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShineBorder } from "@/components/ui/shine-border";
import { Store, Sparkles } from "lucide-react";
import Image from "next/image";

export function ShopPromoCard() {
  const t = useTranslations("HomePage.shopPromo");

  return (
    <div className="mt-16 w-full max-w-3xl mx-auto">
      <Link href="/shop" className="group">
        <div className="relative flex flex-col md:flex-row items-center justify-center rounded-2xl border border-neutral-700 bg-linear-to-br from-neutral-900 to-neutral-950 p-8 shadow-2xl shadow-black/30 transition-all duration-300 group-hover:shadow-yellow-500/20 group-hover:border-yellow-600/50">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left z-10">
            <Image
              src="/pokemoney.png"
              alt="PokéMoney"
              width={80}
              height={80}
              className="w-20 h-20 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />
            <div>
              <h3 className="text-3xl font-extrabold text-white">
                {t("title")}
              </h3>
              <p className="text-lg text-neutral-300 mt-1">{t("subtitle")}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-2 text-yellow-400 shrink-0 z-10">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">{t("shinyBoost")}</span>
          </div>

          <ShineBorder
            className="rounded-2xl"
            shineColor={["#FFD700", "#FDE047", "#BF953F"]}
            borderWidth={2}
          />
        </div>
      </Link>
    </div>
  );
}
