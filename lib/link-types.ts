import type { LinkType } from "./resources";

export function parseLinkType(raw: string): LinkType {
  const key = raw.trim().toLowerCase().replace(/\s+/g, " ");

  const map: Record<string, LinkType> = {
    other: "other",
    aiesec: "aiesec",
    "google drive": "google-drive",
    gdrive: "google-drive",
    "google sheet": "google-drive",
    "google sheets": "google-drive",
    "google slide": "google-drive",
    "google slides": "google-drive",
    canva: "canva",
    github: "github",
    web: "web",
    website: "web",
    facebook: "facebook",
    flicker: "flickr",
    flickr: "flickr",
    instagram: "instagram",
    linkedin: "linkedin",
    x: "x",
    twitter: "x",
    youtube: "youtube",
  };

  return map[key] ?? "other";
}

export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return id;
      const embed = parsed.pathname.match(/\/embed\/([^/]+)/);
      if (embed) return embed[1];
      const shorts = parsed.pathname.match(/\/shorts\/([^/]+)/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Standard thumbnail for after-movie cards (banner field may be a YouTube URL). */
export function getYoutubeThumbnailUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

export function parseHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)) {
    return trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
  }
  if (/^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(trimmed)) {
    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  }
  return null;
}
