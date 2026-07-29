"use client";

import { useState } from "react";
import type { Resource } from "@/lib/resources";
import {
  canOpenResource,
  openResourceInNewTab,
} from "@/lib/resolve-resource-url";
import { resourceToast } from "@/lib/resource-toast";
import { LinkTypeIcon } from "./link-type-icons";
import { ComicPanel, ResourceIcon } from "./shared";

/** Shared shell: 16:9 media + title overlay + fixed-height action strip (matches color cards). */
export function UniformResourceShell({
  resource,
  showFeaturedBadge = true,
  banner,
  footer,
}: {
  resource: Resource;
  showFeaturedBadge?: boolean;
  banner: React.ReactNode;
  footer: React.ReactNode;
}) {
  const openOnClick = canOpenResource(resource);

  const handleBannerClick = () => {
    if (!openOnClick) return;
    if (openResourceInNewTab(resource)) {
      resourceToast.openTab();
    }
  };

  return (
    <ComicPanel
      resource={resource}
      noPadding
      showFeaturedBadge={showFeaturedBadge}
      className="comic-panel--uniform"
    >
      <div
        role={openOnClick ? "link" : undefined}
        tabIndex={openOnClick ? 0 : undefined}
        onClick={openOnClick ? handleBannerClick : undefined}
        onKeyDown={
          openOnClick
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleBannerClick();
                }
              }
            : undefined
        }
        className={`banner-16x9 relative w-full shrink-0 overflow-hidden bg-[#d6d6d6] ${
          openOnClick ? "cursor-pointer" : ""
        }`}
      >
        {banner}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/25 to-black/5"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-2.5">
          <h2 className="line-clamp-1 text-[13px] font-bold leading-tight text-white drop-shadow-sm">
            {resource.title}
          </h2>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/90">
            {resource.subtitle}
          </p>
        </div>
      </div>
      <div className="card-bottom-zone">{footer}</div>
    </ComicPanel>
  );
}

export function BannerImage({
  src,
  alt,
  resource,
  className = "",
}: {
  src: string;
  alt: string;
  resource: Resource;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <BannerLinkFallback resource={resource} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

/** Logo / link cards without a sheet banner */
export function BannerIconFill({ resource }: { resource: Resource }) {
  const bg = resource.iconBackgroundColor ?? "#037EF3";

  if (resource.iconUrl) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: bg }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resource.iconUrl}
          alt=""
          className="max-h-[55%] max-w-[55%] object-contain drop-shadow-md"
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <LinkTypeIcon linkType={resource.linkType} className="h-12 w-12 text-white/90" />
    </div>
  );
}

export function BannerLinkFallback({ resource }: { resource: Resource }) {
  const bg = resource.iconBackgroundColor ?? "#037EF3";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      {resource.iconUrl ? (
        <ResourceIcon
          iconUrl={resource.iconUrl}
          iconBackgroundColor={resource.iconBackgroundColor}
          size="lg"
        />
      ) : (
        <LinkTypeIcon linkType={resource.linkType} className="h-11 w-11 text-white/90" />
      )}
    </div>
  );
}
