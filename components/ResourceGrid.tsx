"use client";

import { useMemo } from "react";
import type { Resource } from "@/lib/resources";
import { getComicTileClass } from "@/lib/grid-layout";
import { ResourceCardRouter } from "./resources/ResourceCardRouter";

function ResourceMosaic({
  resources,
  inFeaturedSection = false,
}: {
  resources: Resource[];
  inFeaturedSection?: boolean;
}) {
  if (resources.length === 0) return null;

  return (
    <div
      className="comic-mosaic grid grid-cols-6 gap-2.5 md:grid-cols-12 md:gap-2.5"
      style={{ gridAutoRows: "1fr" }}
    >
      {resources.map((resource) => (
        <div
          key={resource.id}
          className={`comic-tile ${getComicTileClass(resource)}`}
        >
          <ResourceCardRouter
            resource={resource}
            inFeaturedSection={inFeaturedSection}
          />
        </div>
      ))}
    </div>
  );
}

export function ResourceGrid({ resources }: { resources: Resource[] }) {
  const { featured, regular } = useMemo(() => {
    const featuredList: Resource[] = [];
    const regularList: Resource[] = [];
    for (const r of resources) {
      if (r.featured) featuredList.push(r);
      else regularList.push(r);
    }
    return { featured: featuredList, regular: regularList };
  }, [resources]);

  if (resources.length === 0) return null;

  return (
    <div className="space-y-6">
      {featured.length > 0 ? (
        <section aria-labelledby="featured-resources-heading">
          <h2
            id="featured-resources-heading"
            className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#888]"
          >
            Featured
          </h2>
          <ResourceMosaic resources={featured} inFeaturedSection />
        </section>
      ) : null}

      {regular.length > 0 ? (
        <section
          aria-labelledby={
            featured.length > 0 ? "all-resources-heading" : undefined
          }
        >
          {featured.length > 0 ? (
            <h2
              id="all-resources-heading"
              className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#888]"
            >
              All resources
            </h2>
          ) : null}
          <ResourceMosaic resources={regular} />
        </section>
      ) : null}
    </div>
  );
}
