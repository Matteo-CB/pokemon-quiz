import React from "react";
import { PokedleNameListEntry } from "@/lib/pokedle-helpers";
import { useLocale } from "next-intl";

interface PokedleInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder: string;
  isProcessing: boolean;
  filteredNames: PokedleNameListEntry[];
  onGuess: (name: string, url: string) => void;
}

export const PokedleInput: React.FC<PokedleInputProps> = ({
  inputValue,
  onInputChange,
  placeholder,
  isProcessing,
  filteredNames,
  onGuess,
}) => {
  const locale = useLocale();

  return (
    <div className="relative mb-4 max-w-md mx-auto">
      <input
        type="text"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onInputChange(e.target.value)
        }
        placeholder={placeholder}
        disabled={isProcessing}
        className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
      />
      {filteredNames.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg p-1 space-y-1">
          {filteredNames.map((p: PokedleNameListEntry) => (
            <button
              key={p.name}
              className="w-full text-left p-3 hover:bg-neutral-700 capitalize transition-colors duration-150 rounded-md"
              onClick={() => onGuess(p.name, p.url)}
            >
              {p.names[locale] ?? p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
