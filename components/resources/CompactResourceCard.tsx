"use client";

import type { Resource } from "@/lib/resources";
import {
  BannerIconFill,
  BannerImage,
  UniformResourceShell,
} from "./card-shell";
import { CardFooterActions } from "./shared";

export function CompactResourceCard({
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
          <BannerIconFill resource={resource} />
        )
      }
      footer={<CardFooterActions resource={resource} />}
    />
  );
}
