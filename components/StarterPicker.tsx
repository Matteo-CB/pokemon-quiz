"use client";
import { Pokemon } from "@/hooks/useStarters";
import { useTranslations } from "next-intl";

interface StarterPickerProps {
  starters: Pokemon[];
  selected: Pokemon | null;
  onSelect: (p: Pokemon) => void;
}

export function StarterPicker({
  starters,
  selected,
  onSelect,
}: StarterPickerProps) {
  const t = useTranslations("StarterPicker");

  return (
    <div>
      <p className="font-semibold mb-2">{t("chooseStarter")}</p>
      <div className="flex gap-4">
        {starters.map((p) => (
          <button
            type="button"
            key={p.id}
            onClick={() => onSelect(p)}
            className={`p-2 rounded-xl border-2 transition ${
              selected?.id === p.id ? "border-pink-500" : "border-transparent"
            }`}
          >
            <img src={p.sprite} alt={p.name} />
            <p className="capitalize text-sm">
              {p.name} {p.isShiny && "✨"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
