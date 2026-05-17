import type { Resource } from "./resources";
import { linkTypeLabel, resourceTypeLabel } from "./resource-labels";
import { displayUrl, normalizeUrl } from "./link-types";

export function resourceSearchText(resource: Resource): string {
  const parts = [
    resource.title,
    resource.subtitle,
    resource.url,
    resource.hexColor ?? "",
    resource.category,
    resource.linkType,
    linkTypeLabel(resource.linkType),
    resourceTypeLabel(resource.resourceType),
    displayUrl(normalizeUrl(resource.url)),
  ];
  return parts.join(" ").toLowerCase();
}

export function matchesResourceSearch(resource: Resource, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return resourceSearchText(resource).includes(q);
}
