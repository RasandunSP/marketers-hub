"use client";

import type { Resource } from "@/lib/resources";
import { AfterMovieResourceCard } from "./AfterMovieResourceCard";
import { ColorResourceCard } from "./ColorResourceCard";
import { CompactResourceCard } from "./CompactResourceCard";
import { LargeResourceCard } from "./LargeResourceCard";

export function ResourceCardRouter({
  resource,
  inFeaturedSection = false,
}: {
  resource: Resource;
  inFeaturedSection?: boolean;
}) {
  const sectionProps = { inFeaturedSection };

  switch (resource.resourceType) {
    case "logo":
      return <CompactResourceCard resource={resource} {...sectionProps} />;
    case "color":
      return (
        <ColorResourceCard
          resource={resource}
          inFeaturedSection={inFeaturedSection}
        />
      );
    case "aftermovie":
      return <AfterMovieResourceCard resource={resource} {...sectionProps} />;
    case "guideline":
    case "template":
    case "photoalbum":
    case "animation":
    case "other":
    default:
      return <LargeResourceCard resource={resource} {...sectionProps} />;
  }
}
