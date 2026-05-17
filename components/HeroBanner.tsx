"use client";

import Image from "next/image";
import { CATEGORIES } from "@/lib/resources";
import { GridIcon } from "./icons";

type HeroBannerProps = {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
};

export function HeroBanner({
  activeCategory,
  onCategoryChange,
}: HeroBannerProps) {
  return (
    <section className="relative mx-6 overflow-hidden rounded-2xl md:mx-10">
      <div className="flex min-h-[220px] flex-col md:min-h-[260px] md:flex-row">
        <div className="flex flex-[2] flex-col justify-center bg-[#2d2d2d] px-8 py-10 md:px-10 md:py-12">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            Hey Creative Individuals,
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 md:text-base">
            Dive into the Hub to simplify your design workflow and edit with
            ease. We look forward to seeing your creative content come to life!
          </p>
        </div>
        <div className="relative min-h-[180px] flex-[3] md:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="Coastal landscape"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 left-4 flex flex-wrap items-center justify-end gap-2 md:bottom-5 md:right-5 md:left-auto">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              onCategoryChange(
                activeCategory === category ? null : category,
              )
            }
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors md:px-5 md:text-sm ${
              activeCategory === category
                ? "bg-[#037EF3] text-white"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {category}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#037EF3] text-white shadow-sm transition-opacity hover:opacity-90"
          aria-label="Clear category filter"
        >
          <GridIcon />
        </button>
      </div>
    </section>
  );
}
