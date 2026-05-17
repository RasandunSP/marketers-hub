import { parseCsv } from "./csv";
import { GOOGLE_SHEET_CSV_URL } from "./sheet-config";
import type { Resource } from "./resources";
import { CATEGORIES } from "./resources";
import { parseHexColor, parseLinkType, normalizeUrl } from "./link-types";
import {
  getCardSize,
  mapCategory,
  normalizeResourceType,
  requiresBanner,
  requiresIcon,
} from "./resource-types";

const COL = {
  resourceType: 0,
  icon: 1,
  iconBg: 2,
  banner: 3,
  title: 4,
  description: 5,
  linkType: 6,
  link: 7,
  copyable: 8,
  redirectable: 9,
  downloadable: 10,
  feature: 11,
  confirmPush: 13,
  doubleConfirm: 14,
} as const;

function isTruthy(value: string | undefined): boolean {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "yes" || normalized === "1";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateRow(
  row: string[],
  type: ReturnType<typeof normalizeResourceType>,
): string | null {
  if (!isTruthy(row[COL.confirmPush]) || !isTruthy(row[COL.doubleConfirm])) {
    return "not confirmed";
  }

  if (!row[COL.title]?.trim() || !row[COL.description]?.trim()) {
    return "missing title or description";
  }

  if (type === "color") {
    const hex =
      parseHexColor(row[COL.link] ?? "") ??
      parseHexColor(row[COL.iconBg] ?? "");
    if (!hex) return "color requires valid hex in Link or Icon Background Color";
    return null;
  }

  if (requiresIcon(type) && !row[COL.icon]?.trim()) {
    return "icon required";
  }

  if (requiresBanner(type) && !row[COL.banner]?.trim()) {
    return "banner required (16:9 image URL)";
  }

  if (!row[COL.link]?.trim()) {
    return "link required";
  }

  return null;
}

function rowToResource(row: string[], index: number): Resource | null {
  const rawType = row[COL.resourceType]?.trim() ?? "";
  if (!rawType || rawType.toLowerCase() === "resource type") return null;

  const resourceType = normalizeResourceType(rawType);
  const validationError = validateRow(row, resourceType);
  if (validationError) return null;

  const title = row[COL.title].trim();
  const description = row[COL.description].trim();
  const linkType = parseLinkType(row[COL.linkType] ?? "Other");
  const icon = row[COL.icon]?.trim();
  const iconBg = row[COL.iconBg]?.trim();
  const banner = row[COL.banner]?.trim();

  if (resourceType === "color") {
    const hex =
      parseHexColor(row[COL.link] ?? "") ??
      parseHexColor(row[COL.iconBg] ?? "") ??
      "#000000";

    return {
      id: `${slugify(title) || "color"}-${index}`,
      resourceType,
      cardSize: "color",
      title,
      subtitle: description,
      url: hex,
      category: mapCategory(resourceType, rawType),
      linkType,
      copyable: isTruthy(row[COL.copyable]),
      redirectable: false,
      downloadable: false,
      featured: isTruthy(row[COL.feature]),
      hexColor: hex,
      iconBackgroundColor: hex,
    };
  }

  const url = normalizeUrl(row[COL.link].trim());

  return {
    id: `${slugify(title) || "resource"}-${index}`,
    resourceType,
    cardSize: getCardSize(resourceType),
    title,
    subtitle: description,
    url,
    category: mapCategory(resourceType, rawType),
    linkType,
    copyable: isTruthy(row[COL.copyable]),
    redirectable: isTruthy(row[COL.redirectable]),
    downloadable: isTruthy(row[COL.downloadable]),
    featured: isTruthy(row[COL.feature]),
    iconUrl: icon || undefined,
    iconBackgroundColor: iconBg || undefined,
    bannerUrl: banner || undefined,
  };
}

export function rowsToResources(rows: string[][]): Resource[] {
  const resources = rows
    .map((row, index) => rowToResource(row, index))
    .filter((r): r is Resource => r !== null);

  return resources.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

export async function fetchResourcesFromSheet(): Promise<{
  resources: Resource[];
  fetchedAt: string;
}> {
  const response = await fetch(GOOGLE_SHEET_CSV_URL, {
    cache: "no-store",
    headers: { Accept: "text/csv" },
  });

  if (!response.ok) {
    throw new Error(`Sheet fetch failed (${response.status})`);
  }

  const csv = await response.text();
  const rows = parseCsv(csv);

  return {
    resources: rowsToResources(rows),
    fetchedAt: new Date().toISOString(),
  };
}

export function getCategoriesFromResources(resources: Resource[]): string[] {
  const present = new Set(resources.map((r) => r.category));
  const ordered = CATEGORIES.filter((c) => present.has(c));
  const extras = [...present].filter(
    (c) => !CATEGORIES.includes(c as (typeof CATEGORIES)[number]),
  );
  return [...ordered, ...extras.sort()];
}
