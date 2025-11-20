import React from "react";
import { ShineBorder } from "@/components/ui/shine-border";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  children,
}: LegalPageLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10">
      <div className="relative max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/30">
        <ShineBorder
          shineColor={["#A000FF", "#C000FF", "#E060FF"]}
          className="rounded-2xl"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center">
          {title}
        </h1>

        <article
          className="prose prose-invert prose-base max-w-none
                      
                      prose-headings:font-bold prose-headings:text-white
                      prose-h3:mt-10 prose-h3:mb-4
                      prose-h4:mt-8 prose-h4:mb-2
                      
                      prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:my-5
                      
                      prose-a:text-purple-400 prose-a:transition-colors hover:prose-a:text-purple-300
                      prose-strong:text-neutral-100
                      
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5
                      prose-li:text-neutral-300 prose-li:my-2
                      
                      prose-hr:border-neutral-700 prose-hr:my-8"
        >
          {children}
        </article>
      </div>
    </div>
  );
}
