import type { LinkType, Resource } from "./resources";
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

const TRAILING_URL_PATTERN =
  /(?:^|\s|\|)((?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s|,)]+)*)\s*$/i;

/** Verified profile / resource URLs for common sheet labels. */
const KNOWN_LINK_LABELS: Record<string, string> = {
  "asl facebook": "https://www.facebook.com/AIESECinSriLanka",
  "asl instagram": "https://www.instagram.com/aiesec_srilanka",
  "asl linkedin": "https://www.linkedin.com/company/aiesec-sri-lanka",
  "asl x": "https://x.com/AIESECSriLanka",
  "asl tiktok": "https://www.tiktok.com/@aiesec.srilanka",
  "asl medium": "https://aiesec.medium.com",
  "asl youtube": "https://www.youtube.com/@AIESECinSriLanka",
  "aiesec hub": "https://aiesechub.squarespace.com",
};

const GOOGLE_LINK_TYPES = new Set<LinkType>(["google-drive"]);
const SOCIAL_LINK_TYPES = new Set<LinkType>([
  "facebook",
  "instagram",
  "linkedin",
  "x",
  "youtube",
  "flickr",
]);

function googleDriveSearchUrl(query: string): string {
  return `https://drive.google.com/drive/search?q=${encodeURIComponent(query.trim())}`;
}

function resolveSocialFallback(linkType: LinkType, label: string): string {
  const query = encodeURIComponent(
    label.replace(/\b(ASL|AIESEC)\b/gi, "AIESEC Sri Lanka").trim() || label.trim(),
  );

  switch (linkType) {
    case "facebook":
      return `https://www.facebook.com/search/top?q=${query}`;
    case "instagram":
      return `https://www.instagram.com/explore/search/keyword/?q=${query}`;
    case "linkedin":
      return `https://www.linkedin.com/search/results/all/?keywords=${query}`;
    case "x":
      return `https://x.com/search?q=${query}&src=typed_query`;
    case "youtube":
      return `https://www.youtube.com/results?search_query=${query}`;
    case "flickr":
      return `https://www.flickr.com/search/?text=${query}`;
    default:
      return googleDriveSearchUrl(label);
  }
}

function extractEmbeddedUrl(raw: string): string | null {
  const pipeMatch = raw.match(EMBEDDED_URL_PATTERN);
  if (pipeMatch?.[1]) {
    const candidate = pipeMatch[1].trim();
    if (/^https?:\/\//i.test(candidate) || PARTIAL_URL_PATTERN.test(candidate)) {
      return normalizeUrl(candidate);
    }
  }

  const trailingMatch = raw.match(TRAILING_URL_PATTERN);
  if (trailingMatch?.[1]) {
    const candidate = trailingMatch[1].trim();
    if (/^https?:\/\//i.test(candidate) || PARTIAL_URL_PATTERN.test(candidate)) {
      return normalizeUrl(candidate);
    }
  }

  return null;
}

/** Keep sheet URLs intact; only normalize bare Google IDs when needed. */
function normalizeGoogleOpenUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
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
    return `https://docs.google.com/${path}/d/${workspace.id}/view`;
  }

  return trimmed;
}

/**
 * Resolve the sheet Link cell to a navigable URL.
 * 1. Use exact http(s) URLs from the sheet when present.
 * 2. Extract embedded domain paths (e.g. "Title | aiesec.lk/path").
 * 3. Fall back to known social profiles or Drive search for label-only rows.
 */
export function resolveResourceUrl(raw: string, linkType: LinkType): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const known = KNOWN_LINK_LABELS[trimmed.toLowerCase()];
  if (known) return known;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const youtubeId = getYoutubeVideoId(trimmed);
  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  const embedded = extractEmbeddedUrl(trimmed);
  if (embedded) return normalizeGoogleOpenUrl(embedded);

  if (PARTIAL_URL_PATTERN.test(trimmed) || isLikelyWebUrl(trimmed)) {
    return normalizeGoogleOpenUrl(normalizeUrl(trimmed));
  }

  if (GOOGLE_LINK_TYPES.has(linkType)) {
    return googleDriveSearchUrl(trimmed);
  }

  if (SOCIAL_LINK_TYPES.has(linkType)) {
    return resolveSocialFallback(linkType, trimmed);
  }

  if (
    linkType === "other" ||
    linkType === "aiesec" ||
    linkType === "canva" ||
    linkType === "web"
  ) {
    return googleDriveSearchUrl(trimmed);
  }

  return googleDriveSearchUrl(trimmed);
}

export function isNavigableResourceUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("#")) return false;
  return /^https?:\/\//i.test(trimmed);
}

export function canOpenResource(resource: Resource): boolean {
  return (
    resource.resourceType !== "color" &&
    resource.redirectable &&
    isNavigableResourceUrl(resource.url)
  );
}

export function openResourceInNewTab(resource: Resource): boolean {
  if (!canOpenResource(resource)) return false;
  window.open(resource.url, "_blank", "noopener,noreferrer");
  return true;
}

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

export function getResourceCopyValue(resource: Resource): string {
  if (resource.resourceType === "color") {
    return resource.hexColor ?? resource.url;
  }

  const label = resource.linkLabel?.trim() ?? "";
  if (/^https?:\/\//i.test(label)) {
    return label;
  }

  if (isNavigableResourceUrl(resource.url)) {
    return resource.url;
  }

  return label || resource.url;
}
