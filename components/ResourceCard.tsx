"use client";

import Image from "next/image";
import { useState } from "react";
import type { Resource, ResourceAction } from "@/lib/resources";
import {
  AiesecMark,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "./icons";

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#555] shadow-sm transition-colors hover:bg-[#fafafa] hover:text-[#333]"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function PrimaryActionIcon({ action }: { action: ResourceAction }) {
  if (action === "copy") return <CopyIcon />;
  if (action === "external") return <ExternalLinkIcon />;
  return <DownloadIcon />;
}

function BlueBookPreview({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-[#037EF3] px-6 py-12">
      <div className="absolute right-4 top-4 text-white/90">
        <AiesecMark className="h-6 w-6" />
      </div>
      <p className="text-center text-2xl font-bold tracking-wide text-white md:text-[1.75rem]">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-2 text-center text-[10px] font-medium tracking-widest text-white/75">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = resource.url.startsWith("http")
    ? resource.url
    : `https://${resource.url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handlePrimary = () => {
    if (resource.primaryAction === "copy") {
      void handleCopy();
      return;
    }
    if (resource.primaryAction === "external") {
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const primaryLabel =
    resource.primaryAction === "copy"
      ? copied
        ? "Copied"
        : "Copy link"
      : "Open link";

  return (
    <article className="rounded-[18px] bg-[#f0f0f0] p-4 md:p-5">
      <div className="flex items-start gap-3">
        <Image
          src="/aiesec-logo.svg"
          alt=""
          width={36}
          height={36}
          className="mt-0.5 shrink-0"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-black md:text-[15px]">
            {resource.title}
          </h2>
          <p className="mt-0.5 truncate text-xs text-[#999] md:text-sm">
            {resource.subtitle}
          </p>
        </div>
        <ActionButton label={primaryLabel} onClick={handlePrimary}>
          <PrimaryActionIcon action={resource.primaryAction} />
        </ActionButton>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
            <LinkIcon className="shrink-0 text-[#ccc]" />
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xs text-[#bbb] hover:text-[#037EF3] md:text-sm"
            >
              {resource.url}
            </a>
          </div>

          {resource.preview.type === "bluebook" ? (
            <BlueBookPreview
              title={resource.preview.title}
              subtitle={resource.preview.subtitle}
            />
          ) : null}
        </div>

        {resource.showDownload ? (
          <ActionButton label="Download" onClick={handleDownload}>
            <DownloadIcon />
          </ActionButton>
        ) : null}
      </div>
    </article>
  );
}
