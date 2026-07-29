"use client";

import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex min-h-[150px] flex-col md:min-h-[175px] md:flex-row">
        <div className="flex w-full min-w-0 flex-col justify-center bg-[#2d2d2d] px-6 py-5 md:w-[34%] md:shrink-0 md:px-8 md:py-6">
          <h1 className="w-full text-lg font-bold leading-snug text-white md:text-xl lg:text-2xl">
            Hey Creative Individuals,
          </h1>
          <p className="mt-2 w-full text-xs leading-relaxed text-white/90 md:text-[13px]">
            Dive into the Hub to simplify your design workflow and edit with
            ease. We look forward to seeing your creative content come to life!
          </p>
        </div>
        <div className="relative min-h-[120px] w-full md:w-[66%] md:min-h-0">
          <Image
            src="/banners/mhub-banner.jpg"
            alt="Fuelling the creator in you - AIESEC in Sri Lanka Marketers HUB"
            fill
            unoptimized
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      </div>
    </section>
  );
}
