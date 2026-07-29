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
          <div
            className="absolute inset-0 z-0"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe
              src={`${embedUrl}?autoplay=1`}
              title={resource.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {resource.bannerUrl ? (
              <BannerImage src={resource.bannerUrl} alt="" resource={resource} />
            ) : (
              <BannerLinkFallback resource={resource} />
            )}
            <div
              className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center bg-black/25"
              aria-hidden
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPlaying(true);
              }}
              className="absolute left-1/2 top-1/2 z-[4] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#037EF3] text-white shadow-lg ring-2 ring-white/30"
              aria-label={`Play ${resource.title}`}
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </>
        )
      }
      footer={<CardFooterActions resource={resource} />}
    />
  );
}
