import { normalizeUrl } from "./link-types";

const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|#|$)/i;

const IMAGE_HOST_SNIPPETS = [
  "i.ibb.co",
  "imgur.com",
  "i.imgur.com",
  "images.unsplash.com",
  "googleusercontent.com",
  "cdn.discordapp.com",
  "pbs.twimg.com",
];

/** URLs that can be used directly in <img src>. */
export function isLikelyImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    const path = parsed.pathname.toLowerCase();

    if (IMAGE_EXTENSION.test(path)) return true;
    if (path.includes("/thumbnail")) return true;
    if (IMAGE_HOST_SNIPPETS.some((h) => parsed.hostname.includes(h))) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export function isGoogleHost(url: string): boolean {
  try {
    const host = new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
    return (
      host === "drive.google.com" ||
      host === "docs.google.com" ||
      host === "slides.google.com" ||
      host === "sheets.google.com"
    );
  } catch {
    return false;
  }
}

/** HTTP(S) URLs with a real hostname (excludes sheet labels like "Brand Resources"). */
export function isLikelyWebUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;

  try {
    const parsed = new URL(normalizeUrl(trimmed));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

    const host = parsed.hostname.replace(/^www\./, "");
    if (!host || !host.includes(".")) return false;

    return /^[a-z0-9.-]+$/i.test(host);
  } catch {
    return false;
  }
}
