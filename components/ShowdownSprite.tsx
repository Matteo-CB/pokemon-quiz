"use client";

import Image from "next/image";
import { useState } from "react";

interface ShowdownSpriteProps {
  src: string;
  alt: string;
}

export function ShowdownSprite({ src, alt }: ShowdownSpriteProps) {
  const [size, setSize] = useState<32 | 64 | null>(null);

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
        width: "auto",
        height: "auto",
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
