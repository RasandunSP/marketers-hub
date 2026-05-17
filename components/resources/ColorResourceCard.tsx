"use client";

import { useState } from "react";
import type { Resource } from "@/lib/resources";
import { resourceToast } from "@/lib/resource-toast";
import { CopyIcon } from "../icons";
import { ComicPanel } from "./shared";

export function ColorResourceCard({
  resource,
  inFeaturedSection = false,
}: {
  resource: Resource;
  inFeaturedSection?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const hex = resource.hexColor ?? resource.url;

  const handleCopy = async () => {
    if (!resource.copyable) return;
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      resourceToast.copyColor();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      resourceToast.copyFailed();
    }
  };

  return (
    <ComicPanel
      resource={resource}
      noPadding
      showFeaturedBadge={!inFeaturedSection}
      className="comic-panel--uniform"
    >
      <div
        className="banner-16x9 relative w-full shrink-0"
        style={{ backgroundColor: hex }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <h2 className="text-[13px] font-bold text-white drop-shadow-sm">
            {resource.title}
          </h2>
          <p className="mt-0.5 line-clamp-2 text-[10px] text-white/90">
            {resource.subtitle}
          </p>
        </div>
      </div>

      <div className="card-bottom-zone">
        <div className="flex items-center gap-1 overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.06]">
          <span className="min-w-0 flex-1 truncate px-2.5 py-2 font-mono text-[11px] font-bold text-[#333]">
            {hex.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!resource.copyable}
            className={`action-btn flex h-9 w-9 shrink-0 items-center justify-center border-l border-black/[0.06] bg-[#fafafa] disabled:opacity-35 ${
              copied ? "action-btn--active" : ""
            }`}
            aria-label={copied ? "Copied" : "Copy hex"}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    </ComicPanel>
  );
}
