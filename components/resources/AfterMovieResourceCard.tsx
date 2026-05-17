"use client";

import { useState } from "react";
import type { Resource } from "@/lib/resources";
import { getYoutubeEmbedUrl } from "@/lib/link-types";
import { BannerImage, BannerLinkFallback, UniformResourceShell } from "./card-shell";
import { CardFooterActions } from "./shared";

export function AfterMovieResourceCard({
  resource,
  inFeaturedSection = false,
}: {
  resource: Resource;
  inFeaturedSection?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getYoutubeEmbedUrl(resource.url);

  return (
    <UniformResourceShell
      resource={resource}
      showFeaturedBadge={!inFeaturedSection}
      banner={
        playing && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={resource.title}
            className="absolute inset-0 z-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {resource.bannerUrl ? (
              <BannerImage src={resource.bannerUrl} alt="" />
            ) : (
              <BannerLinkFallback resource={resource} />
            )}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 z-[3] flex items-center justify-center bg-black/25 transition hover:bg-black/35"
              aria-label={`Play ${resource.title}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#037EF3] text-white shadow-lg ring-2 ring-white/30">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </>
        )
      }
      footer={<CardFooterActions resource={resource} />}
    />
  );
}
