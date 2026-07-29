import type { LinkType } from "./resources";
import {
  getYoutubeVideoId,
  normalizeUrl,
  PARTIAL_URL_PATTERN,
} from "./link-types";
import { isLikelyWebUrl } from "./media-url";
import {
  parseGoogleDriveFileId,
  parseGoogleWorkspaceUrl,
} from "./google-preview";

const EMBEDDED_URL_PATTERN =
  /\|\s*((?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s|]*)?)\s*$/i;

function isGoogleLinkType(linkType: LinkType): boolean {
  return linkType === "google-drive";
}

function googleDriveSearchUrl(query: string): string {
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(query.trim())}`;
}

function extractEmbeddedUrl(raw: string): string | null {
  const match = raw.match(EMBEDDED_URL_PATTERN);
  if (!match?.[1]) return null;

  const candidate = match[1].trim();
  if (/^https?:\/\//i.test(candidate) || PARTIAL_URL_PATTERN.test(candidate)) {
    return normalizeUrl(candidate);
  }

  return null;
}

/** Canonical open/view URL for Google Drive and Workspace links. */
export function normalizeGoogleNavUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const folderMatch = trimmed.match(
    /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/,
  );
  if (folderMatch) {
    return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
  }

  const driveId = parseGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/view`;
  }

  const workspace = parseGoogleWorkspaceUrl(trimmed);
  if (workspace) {
    const path =
      workspace.kind === "spreadsheets"
        ? "spreadsheets"
        : workspace.kind === "presentation"
          ? "presentation"
          : "document";
    return `https://docs.google.com/${path}/d/${workspace.id}/edit`;
  }

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    const host = parsed.hostname.replace(/^www\./, "");

    if (host.includes("drive.google.com")) {
      return parsed.toString();
    }

    if (
      host === "docs.google.com" ||
      host === "slides.google.com" ||
      host === "sheets.google.com"
    ) {
      if (parsed.pathname.includes("/preview")) {
        parsed.pathname = parsed.pathname.replace("/preview", "/edit");
      }
      return parsed.toString();
    }
  } catch {
    return normalizeUrl(trimmed);
  }

  return normalizeUrl(trimmed);
}

/** Turn a sheet Link cell + Link Type into a URL suitable for copy/open/download. */
export function resolveResourceUrl(raw: string, linkType: LinkType): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const youtubeId = getYoutubeVideoId(trimmed);
  if (youtubeId || linkType === "youtube") {
    if (youtubeId) return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeGoogleNavUrl(trimmed);
  }

  const embedded = extractEmbeddedUrl(trimmed);
  if (embedded) return normalizeGoogleNavUrl(embedded);

  if (PARTIAL_URL_PATTERN.test(trimmed) || isLikelyWebUrl(trimmed)) {
    return normalizeGoogleNavUrl(normalizeUrl(trimmed));
  }

  if (isGoogleLinkType(linkType)) {
    return googleDriveSearchUrl(trimmed);
  }

  return "";
}

export function isNavigableResourceUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("#")) return false;
  return /^https?:\/\//i.test(trimmed);
}

/** Direct download URL when the resource link supports it. */
export function getResourceDownloadUrl(
  url: string,
  linkType: LinkType,
): string | null {
  if (!isNavigableResourceUrl(url)) return null;

  if (url.includes("drive.google.com/drive/search")) {
    return null;
  }

  const driveId = parseGoogleDriveFileId(url);
  if (driveId && !url.includes("/folders/")) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }

  const workspace = parseGoogleWorkspaceUrl(url);
  if (workspace) {
    const path =
      workspace.kind === "spreadsheets"
        ? "spreadsheets"
        : workspace.kind === "presentation"
          ? "presentation"
          : "document";
    const format =
      workspace.kind === "spreadsheets"
        ? "xlsx"
        : workspace.kind === "presentation"
          ? "pptx"
          : "pdf";
    return `https://docs.google.com/${path}/d/${workspace.id}/export?format=${format}`;
  }

  if (linkType === "google-drive") {
    return null;
  }

  return url;
}
