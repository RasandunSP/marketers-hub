import {
  getGoogleDriveThumbnailUrl,
  getGoogleWorkspacePreviewPageUrl,
  parseGoogleDriveFileId,
  parseGoogleWorkspaceUrl,
} from "./google-preview";
import {
  getYoutubeThumbnailUrl,
  getYoutubeVideoId,
  normalizeUrl,
} from "./link-types";
import { isGoogleHost, isLikelyImageUrl, isLikelyWebUrl } from "./media-url";

const OG_CACHE_TTL_MS = 10 * 60 * 1000;
const OG_FETCH_TIMEOUT_MS = 4500;

const ogImageCache = new Map<string, { value: string | null; expiresAt: number }>();

function getCachedOgImage(key: string): string | null | undefined {
  const hit = ogImageCache.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    ogImageCache.delete(key);
    return undefined;
  }
  return hit.value;
}

function setCachedOgImage(key: string, value: string | null) {
  ogImageCache.set(key, { value, expiresAt: Date.now() + OG_CACHE_TTL_MS });
}

/** Sync preview URLs (YouTube, Drive thumbnail API, direct images). */
export function resolveStaticPreviewUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (isLikelyImageUrl(trimmed)) {
    return normalizeUrl(trimmed);
  }

  const youtubeThumb = getYoutubeThumbnailUrl(trimmed);
  if (youtubeThumb) return youtubeThumb;

  const driveId = parseGoogleDriveFileId(trimmed);
  if (driveId) return getGoogleDriveThumbnailUrl(driveId);

  return null;
}

async function fetchOpenGraphImage(pageUrl: string): Promise<string | null> {
  const cacheKey = pageUrl;
  const cached = getCachedOgImage(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OG_FETCH_TIMEOUT_MS);

    const response = await fetch(pageUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (compatible; MarketersHub/1.0; +https://aiesec.lk)",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      setCachedOgImage(cacheKey, null);
      return null;
    }

    const html = await response.text();
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const image = match[1].replace(/&amp;/g, "&");
        setCachedOgImage(cacheKey, image);
        return image;
      }
    }

    setCachedOgImage(cacheKey, null);
    return null;
  } catch {
    setCachedOgImage(cacheKey, null);
    return null;
  }
}

/** Drive → thumbnail API; Docs/Slides/Sheets → OG image from /preview page. */
export async function resolvePreviewUrl(url: string): Promise<string | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const staticPreview = resolveStaticPreviewUrl(trimmed);
  if (staticPreview) return staticPreview;

  const workspace = parseGoogleWorkspaceUrl(trimmed);
  if (workspace) {
    const previewPage = getGoogleWorkspacePreviewPageUrl(workspace);
    const ogImage = await fetchOpenGraphImage(previewPage);
    if (ogImage) return ogImage;
  }

  if (isGoogleHost(trimmed)) {
    const driveId = parseGoogleDriveFileId(trimmed);
    if (driveId) return getGoogleDriveThumbnailUrl(driveId);

    const ogFromLink = await fetchOpenGraphImage(normalizeUrl(trimmed));
    if (ogFromLink) return ogFromLink;
  }

  if (isLikelyWebUrl(trimmed)) {
    const ogFromUrl = await fetchOpenGraphImage(normalizeUrl(trimmed));
    if (ogFromUrl) return ogFromUrl;
  }

  return null;
}

export function supportsLinkPreview(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  return (
    isLikelyImageUrl(trimmed) ||
    Boolean(getYoutubeVideoId(trimmed)) ||
    Boolean(parseGoogleDriveFileId(trimmed)) ||
    Boolean(parseGoogleWorkspaceUrl(trimmed)) ||
    isGoogleHost(trimmed) ||
    isLikelyWebUrl(trimmed)
  );
}
