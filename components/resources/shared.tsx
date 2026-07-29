"use client";

import { useState } from "react";
import type { Resource } from "@/lib/resources";
import { resourceTypeLabel } from "@/lib/resource-labels";
import { displayUrl } from "@/lib/link-types";
import {
  getResourceDownloadUrl,
  isNavigableResourceUrl,
} from "@/lib/resolve-resource-url";
import { resourceToast } from "@/lib/resource-toast";
import { CopyIcon, DownloadIcon, ExternalLinkIcon } from "../icons";
import { LinkTypeIcon } from "./link-type-icons";

export function FeaturedBadge() {
  return (
    <span className="absolute left-0 top-0 z-20 rounded-br-lg rounded-tl-xl bg-[#037EF3] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
      Featured
    </span>
  );
}

export function TypeBadge({
  resource,
  showFeaturedBadge = true,
}: {
  resource: Resource;
  showFeaturedBadge?: boolean;
}) {
  const ribbonVisible = resource.featured && showFeaturedBadge;

  return (
    <span
      className={`absolute right-2 z-10 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm ${
        ribbonVisible ? "top-8" : "top-2"
      }`}
    >
      {resourceTypeLabel(resource.resourceType)}
    </span>
  );
}

export function ResourceIcon({
  iconUrl,
  iconBackgroundColor,
  size = "md",
}: {
  iconUrl?: string;
  iconBackgroundColor?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-9 w-9";

  if (!iconUrl) {
    return (
      <div
        className={`${dim} shrink-0 rounded-lg bg-[#037EF3]`}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/5`}
      style={{ backgroundColor: iconBackgroundColor ?? "#037EF3" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconUrl} alt="" className="h-full w-full object-contain p-0.5" />
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
  active,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`action-btn flex h-8 w-8 items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-30 ${
        active ? "action-btn--active" : ""
      }`}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function useResourceActions(resource: Resource) {
  const [copied, setCopied] = useState(false);
  const fullUrl = resource.url;
  const navigable = isNavigableResourceUrl(fullUrl);
  const valueToCopy =
    resource.resourceType === "color"
      ? (resource.hexColor ?? resource.url)
      : fullUrl;

  const handleCopy = async () => {
    if (!resource.copyable || !valueToCopy) return;
    if (resource.resourceType !== "color" && !navigable) return;
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      if (resource.resourceType === "color") {
        resourceToast.copyColor();
      } else {
        resourceToast.copyLink();
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      resourceToast.copyFailed();
    }
  };

  const handleOpen = () => {
    if (!resource.redirectable || !navigable) return;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    resourceToast.openTab();
  };

  const handleDownload = () => {
    if (!resource.downloadable) return;

    const downloadUrl = getResourceDownloadUrl(fullUrl, resource.linkType);
    if (downloadUrl) {
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.download = "";
      anchor.click();
      resourceToast.download();
      return;
    }

    if (navigable) {
      window.open(fullUrl, "_blank", "noopener,noreferrer");
      resourceToast.openTab();
    }
  };

  const displayLink =
    resource.linkLabel?.trim() ||
    (navigable ? displayUrl(fullUrl) : "Link unavailable");

  return {
    fullUrl,
    displayUrl: displayLink,
    navigable,
    copied,
    handleCopy,
    handleOpen,
    handleDownload,
  };
}

/** Unified link + actions strip — fills card width, no dead gaps */
export function CardFooter({
  resource,
  fullUrl,
  displayLink,
  copied,
  navigable,
  onCopy,
  onOpen,
  onDownload,
}: {
  resource: Resource;
  fullUrl: string;
  displayLink: string;
  copied: boolean;
  navigable: boolean;
  onCopy: () => void;
  onOpen: () => void;
  onDownload: () => void;
}) {
  if (resource.resourceType === "color") return null;

  const canCopy = resource.copyable && navigable;
  const canOpen = resource.redirectable && navigable;

  return (
    <div className="flex w-full items-stretch overflow-hidden rounded-lg bg-white ring-1 ring-black/[0.06]">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1">
        <LinkTypeIcon linkType={resource.linkType} className="h-3.5 w-3.5 shrink-0" />
        {canOpen ? (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-[10px] leading-tight text-[#888] hover:text-[#037EF3]"
          >
            {displayLink}
          </a>
        ) : (
          <span className="min-w-0 flex-1 truncate text-[10px] leading-tight text-[#888]">
            {displayLink}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center border-l border-black/[0.06] bg-[#fafafa] px-0.5 py-0.5">
        <ActionButton
          label={copied ? "Copied" : "Copy link"}
          onClick={onCopy}
          disabled={!canCopy}
          active={copied}
        >
          <CopyIcon />
        </ActionButton>
        <ActionButton
          label="Open in new tab"
          onClick={onOpen}
          disabled={!canOpen}
        >
          <ExternalLinkIcon />
        </ActionButton>
        <ActionButton
          label="Download"
          onClick={onDownload}
          disabled={!resource.downloadable}
        >
          <DownloadIcon />
        </ActionButton>
      </div>
    </div>
  );
}

export function CardFooterActions({ resource }: { resource: Resource }) {
  const {
    fullUrl,
    displayUrl,
    navigable,
    copied,
    handleCopy,
    handleOpen,
    handleDownload,
  } = useResourceActions(resource);

  return (
    <CardFooter
      resource={resource}
      fullUrl={fullUrl}
      displayLink={displayUrl}
      navigable={navigable}
      copied={copied}
      onCopy={() => void handleCopy()}
      onOpen={handleOpen}
      onDownload={handleDownload}
    />
  );
}

export function ComicPanel({
  resource,
  children,
  className = "",
  noPadding,
  showFeaturedBadge = true,
}: {
  resource: Resource;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  showFeaturedBadge?: boolean;
}) {
  return (
    <article
      className={`comic-panel relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-[#ececec] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_2px_6px_rgba(0,0,0,0.05)] ${className}`}
    >
      {resource.featured && showFeaturedBadge ? <FeaturedBadge /> : null}
      <TypeBadge resource={resource} showFeaturedBadge={showFeaturedBadge} />
      {children}
    </article>
  );
}

export function PanelBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col p-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitleBlock({
  resource,
  iconSize = "md",
  clampDesc = 2,
}: {
  resource: Resource;
  iconSize?: "sm" | "md" | "lg";
  clampDesc?: number;
}) {
  return (
    <div className="flex gap-2">
      <ResourceIcon
        iconUrl={resource.iconUrl}
        iconBackgroundColor={resource.iconBackgroundColor}
        size={iconSize}
      />
      <div className="min-w-0 flex-1">
        <h2 className="text-[13px] font-bold leading-tight text-black">
          {resource.title}
        </h2>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#777]">
          {resource.subtitle}
        </p>
      </div>
    </div>
  );
}

export function BannerHero({
  url,
  alt,
  onClick,
  overlay,
}: {
  url: string;
  alt: string;
  onClick?: () => void;
  overlay?: React.ReactNode;
}) {
  const className =
    "banner-16x9 relative block w-full shrink-0 overflow-hidden bg-[#d8d8d8]";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} className="h-full w-full object-cover" />
        {overlay}
      </button>
    );
  }

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="h-full w-full object-cover" />
      {overlay}
    </div>
  );
}
