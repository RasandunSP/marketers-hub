import type { CardSize, ResourceType } from "./resources";

export function normalizeResourceType(raw: string): ResourceType {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "");

  const map: Record<string, ResourceType> = {
    logo: "logo",
    logos: "logo",
    color: "color",
    colours: "color",
    colors: "color",
    colour: "color",
    guideline: "guideline",
    guidelines: "guideline",
    template: "template",
    templates: "template",
    photoalbum: "photoalbum",
    photoalbums: "photoalbum",
    "photo album": "photoalbum",
    aftermovie: "aftermovie",
    aftermovies: "aftermovie",
    "after-movie": "aftermovie",
    "after-movies": "aftermovie",
    animation: "animation",
    animations: "animation",
    kit: "other",
    kits: "other",
    resourcelink: "other",
    externalresource: "other",
    sociallink: "other",
    documentformat: "other",
    mastersheet: "other",
    mastersheets: "other",
    dashboard: "other",
    dashboards: "other",
  };

  return map[key] ?? "other";
}

export function getCardSize(type: ResourceType): CardSize {
  if (type === "logo") return "compact";
  if (type === "color") return "color";
  if (
    type === "guideline" ||
    type === "template" ||
    type === "photoalbum" ||
    type === "aftermovie" ||
    type === "animation"
  ) {
    return "large";
  }
  return "large";
}

export function mapCategory(type: ResourceType, rawType: string): string {
  const rawKey = rawType.trim().toLowerCase().replace(/\s+/g, " ");

  const rawCategoryMap: Record<string, string> = {
    kit: "KIT",
    "resource link": "RESOURCE LINK",
    "external resource": "EXTERNAL RESOURCE",
    "social link": "SOCIAL LINK",
    "document format": "DOCUMENT FORMAT",
    mastersheet: "MASTERSHEET",
    dashboard: "DASHBOARD",
  };

  if (rawCategoryMap[rawKey]) {
    return rawCategoryMap[rawKey];
  }

  const map: Record<ResourceType, string> = {
    logo: "LOGOS",
    color: "COLORS",
    guideline: "GUIDELINES",
    template: "TEMPLATES",
    photoalbum: "PHOTO ALBUMS",
    aftermovie: "AFTER MOVIES",
    animation: "ANIMATIONS",
    other: rawType.trim().toUpperCase() || "OTHER",
  };
  return map[type];
}

export function requiresBanner(type: ResourceType): boolean {
  if (type === "aftermovie") return false;
  return getCardSize(type) === "large";
}

export function requiresIcon(type: ResourceType): boolean {
  return type !== "color" && type !== "aftermovie";
}
