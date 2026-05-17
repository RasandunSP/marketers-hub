"use client";

import type { Resource } from "@/lib/resources";
import {
  BannerImage,
  BannerLinkFallback,
  UniformResourceShell,
} from "./card-shell";
import { CardFooterActions } from "./shared";

export function LargeResourceCard({
  resource,
  inFeaturedSection = false,
}: {
  resource: Resource;
  inFeaturedSection?: boolean;
}) {
  return (
    <UniformResourceShell
      resource={resource}
      showFeaturedBadge={!inFeaturedSection}
      banner={
        resource.bannerUrl ? (
          <BannerImage src={resource.bannerUrl} alt={resource.title} />
        ) : (
          <BannerLinkFallback resource={resource} />
        )
      }
      footer={<CardFooterActions resource={resource} />}
    />
  );
}
