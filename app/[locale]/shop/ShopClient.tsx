"use client";

import React, { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { User, Pokemon } from "@prisma/client";
import type { ShopItem } from "@/lib/shop-helpers";
import type { PokedlePokemon } from "@/types/pokedle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Check,
  AlertTriangle,
  BadgePercent,
  Loader2,
  Gift,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { toast } from "sonner";

type TFunction = (key: string, values?: any) => string;

interface ShopClientProps {
  user: User;
  shopItems: ShopItem[];
  ownedPokemonSet: Set<string>;
}

const getRarityStyle = (type: ShopItem["type"], isShiny: boolean = false) => {
  if (isShiny) {
    return {
      bg: "bg-linear-to-br from-neutral-900 to-yellow-950/60",
      border: "border-yellow-500/50",
      beamFrom: "#FFD700",
      beamTo: "#FDE047",
      shadow: "shadow-yellow-500/20",
      priceText: "text-yellow-300",
    };
  }
  switch (type) {
    case "rare":
      return {
        bg: "bg-gradient-to-br from-neutral-900 to-purple-950/60",
        border: "border-purple-500/50",
        beamFrom: "#A000FF",
        beamTo: "#E060FF",
        shadow: "shadow-purple-500/20",
        priceText: "text-purple-300",
      };
    case "strong":
      return {
        bg: "bg-gradient-to-br from-neutral-900 to-blue-950/60",
        border: "border-blue-500/50",
        beamFrom: "#007BFF",
        beamTo: "#00BFFF",
        shadow: "shadow-blue-500/20",
        priceText: "text-blue-300",
      };
    default:
      return {
        bg: "bg-neutral-900",
        border: "border-neutral-700",
        beamFrom: null,
        beamTo: null,
        shadow: "shadow-neutral-800/20",
        priceText: "text-neutral-300",
      };
  }
};

function ShopItemCard({
  item,
  onBuy,
  isOwned,
  isAffordable,
  isPending,
  locale,
  t,
}: {
  item: ShopItem;
  onBuy: (item: ShopItem) => void;
  isOwned: boolean;
  isAffordable: boolean;
  isPending: boolean;
  locale: string;
  t: TFunction;
}) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const style = getRarityStyle(item.type, item.isShiny);
  const name = item.pokemon.names[locale] ?? item.pokemon.name;
  const sprite = item.isShiny
    ? item.pokemon.spriteShiny
    : item.pokemon.spriteDefault;

  const handleBuyClick = async () => {
    setIsProcessing(true);
    await onBuy(item);
    setIsProcessing(false);
  };

  const isDisabled = isPending || isProcessing || isOwned || !isAffordable;

  let buttonText = t("buy");
  if (isOwned) buttonText = t("owned");
  else if (!isAffordable) buttonText = t("tooExpensive");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between shadow-xl transition-all duration-300",
        style.bg,
        style.border,
        style.shadow,
        isDisabled && "opacity-70"
      )}
    >
      {style.beamFrom && (
        <BorderBeam
          colorFrom={style.beamFrom}
          colorTo={style.beamTo}
          duration={5}
        />
      )}

      <div className="text-center">
        <div className="w-32 h-32 mx-auto flex items-center justify-center mb-4">
          <Image
            src={sprite ?? "/pokeball.png"}
            alt={name}
            width={128}
            height={128}
            className={cn(
              "object-contain transition-transform duration-300 group-hover:scale-105",
              item.isShiny && "drop-shadow-[0_0_8px_rgba(253,224,71,0.7)]"
            )}
            unoptimized
          />
        </div>
        <h3 className="text-2xl font-bold capitalize text-white">{name}</h3>
        {item.isShiny && (
          <p className="text-sm font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400 animate-pulse">
            ✨ {t("shiny")}
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Image
            src="/pokemoney.png"
            alt="PokéMoney"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
            unoptimized
          />
          <p className={cn("text-3xl font-extrabold", style.priceText)}>
            {item.price.toLocaleString(locale)}
          </p>
        </div>

        <Button
          onClick={handleBuyClick}
          disabled={isDisabled}
          className={cn(
            "w-full font-semibold text-lg",
            isOwned
              ? "bg-green-600 hover:bg-green-600"
              : "bg-purple-600 hover:bg-purple-700",
            !isAffordable && !isOwned && "bg-red-600 hover:bg-red-600"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isOwned ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <Gift className="h-5 w-5 mr-2" />
          )}
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default function ShopClient({
  user,
  shopItems,
  ownedPokemonSet,
}: ShopClientProps): React.JSX.Element {
  const t = useTranslations("ShopPage");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [currentMoney, setCurrentMoney] = useState<number>(user.pokeMoney ?? 0);
  const [purchasedItems, setPurchasedItems] =
    useState<Set<string>>(ownedPokemonSet);

  const handlePurchase = async (item: ShopItem): Promise<void> => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/shop/buy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pokemonId: item.pokemon.nationalId,
            isShiny: item.isShiny,
            price: item.price,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "purchase_failed");
        }

        setCurrentMoney(data.newPokeMoney);
        setPurchasedItems((prev) =>
          new Set(prev).add(`${item.pokemon.nationalId}:${item.isShiny}`)
        );
        toast.success(
          t("toast.success", {
            name: item.pokemon.names[locale] ?? item.pokemon.name,
          })
        );
      } catch (error: any) {
        console.error(error);
        toast.error(t(`toast.${error.message || "purchase_failed"}`));
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500 mb-2">
          {t("title")}
        </h1>
        <p className="text-lg text-neutral-300">{t("subtitle")}</p>
      </div>

      <div className="relative overflow-hidden mb-8 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/pokemoney.png"
            alt="PokéMoney"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            unoptimized
          />
          <div>
            <h2 className="text-lg font-semibold text-neutral-300">
              {t("yourBalance")}
            </h2>
            <p className="text-3xl font-extrabold text-yellow-300">
              {currentMoney.toLocaleString(locale)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg">
          <BadgePercent className="h-5 w-5" />
          <p className="text-sm font-semibold">{t("shinyBoost")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map((item: ShopItem) => {
          const isOwned = purchasedItems.has(
            `${item.pokemon.nationalId}:${item.isShiny}`
          );
          return (
            <ShopItemCard
              key={`${item.pokemon.nationalId}-${item.isShiny}`}
              item={item}
              onBuy={handlePurchase}
              isOwned={isOwned}
              isAffordable={currentMoney >= item.price}
              isPending={isPending}
              locale={locale}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}
