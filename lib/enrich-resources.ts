import type { Resource, ResourceType } from "./resources";
import { getYoutubeThumbnailUrl } from "./link-types";
import { isLikelyImageUrl } from "./media-url";
import { resolvePreviewUrl, resolveStaticPreviewUrl } from "./link-preview";

async function resolveBannerForResource(
  resourceType: ResourceType,
  link: string,
  explicitBanner?: string,
): Promise<string | undefined> {
  const banner = explicitBanner?.trim();

  if (resourceType === "aftermovie") {
    return (
      (banner ? getYoutubeThumbnailUrl(banner) ?? banner : undefined) ??
      getYoutubeThumbnailUrl(link) ??
      banner ??
      undefined
    );
  }

  if (banner && isLikelyImageUrl(banner)) {
    return normalizeBannerImageUrl(banner);
  }

  if (banner) {
    const fromBanner =
      resolveStaticPreviewUrl(banner) ?? (await resolvePreviewUrl(banner));
    if (fromBanner) return fromBanner;
  }

  const fromLink = await resolvePreviewUrl(link);
  if (fromLink) return fromLink;

  if (banner && isLikelyImageUrl(banner)) return banner;

  return banner || undefined;
}

async function resolveIconForResource(
  explicitIcon?: string,
): Promise<string | undefined> {
  const icon = explicitIcon?.trim();
  if (!icon) return undefined;

  if (isLikelyImageUrl(icon)) {
    return icon;
  }

  const staticPreview = resolveStaticPreviewUrl(icon);
  if (staticPreview) return staticPreview;

  const preview = await resolvePreviewUrl(icon);
  return preview ?? icon;
}

function normalizeBannerImageUrl(url: string): string {
  return url.trim();
}

export async function enrichResourceMedia(resource: Resource): Promise<Resource> {
  if (resource.resourceType === "color") {
    return resource;
  }

  const [bannerUrl, iconUrl] = await Promise.all([
    resolveBannerForResource(
      resource.resourceType,
      resource.url,
      resource.bannerUrl,
    ),
    resolveIconForResource(resource.iconUrl),
  ]);

  return {
    ...resource,
    bannerUrl,
    iconUrl,
  };
}

export async function enrichResourcesMedia(
  resources: Resource[],
): Promise<Resource[]> {
  return Promise.all(resources.map((r) => enrichResourceMedia(r)));
}
