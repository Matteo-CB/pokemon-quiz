"use client";

import Image from "next/image";
import { useState } from "react";

interface ShowdownSpriteProps {
  src: string;
  alt: string;
}

export function ShowdownSprite({ src, alt }: ShowdownSpriteProps) {
  const [size, setSize] = useState<32 | 64 | null>(null);

  // Dimensions calculées
  const dimension = size === 64 ? 128 : 96;

  return (
    <Image
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className="pixelated"
      unoptimized
      style={{
        width: "auto", // ✅ indique que la largeur s’adapte
        height: "auto", // ✅ indique que la hauteur s’adapte
      }}
      onLoad={(event) => {
        const img = event.currentTarget as HTMLImageElement;
        if (img.naturalWidth === 64) {
          setSize(64);
        } else {
          setSize(32);
        }
      }}
    />
  );
}
