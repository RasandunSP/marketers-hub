"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { ResourceGrid } from "@/components/ResourceGrid";
import { useResources } from "@/hooks/useResources";
import { getCategoriesFromResources } from "@/lib/sheet";
import { matchesResourceSearch } from "@/lib/search-resources";

export function MarketersHub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { resources, loading, refreshing, error, lastUpdated, refresh } =
    useResources();

  const categories = useMemo(
    () => getCategoriesFromResources(resources),
    [resources],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of resources) {
      counts[r.category] = (counts[r.category] ?? 0) + 1;
    }
    return counts;
  }, [resources]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesCategory = !category || r.category === category;
      return matchesCategory && matchesResourceSearch(r, query);
    });
  }, [query, category, resources]);

  return (
    <div className="hub-app min-h-screen bg-[#f7f7f7]">
      <Header
        query={query}
        onQueryChange={setQuery}
        searchRef={searchRef}
      />
      <HeroBanner />
      <CategoryFilter
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        counts={categoryCounts}
        totalCount={resources.length}
      />
      <main className="px-5 py-4 md:px-8 md:py-5">
        <div className="mx-auto w-full max-w-none">
          {refreshing && resources.length > 0 ? (
            <p className="mb-3 text-center text-[11px] font-medium text-[#037EF3]">
              Updating resources…
            </p>
          ) : null}

          {loading && resources.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-center text-[13px] text-[#888] shadow-sm">
              Loading resources…
            </p>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-2 font-medium text-[#037EF3] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : null}

          {!loading && filtered.length > 0 ? (
            <ResourceGrid resources={filtered} />
          ) : null}

          {!loading && !error && filtered.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-center text-[13px] text-[#888] shadow-sm">
              {resources.length === 0
                ? "No resources published yet. Set both “Confirm Push to Marketers Hub” and “Double Confirm” to TRUE in the sheet."
                : "No resources match your search or filter."}
            </p>
          ) : null}

          {lastUpdated && resources.length > 0 ? (
            <p className="mt-4 text-center text-[10px] text-[#aaa]">
              Last updated{" "}
              {new Date(lastUpdated).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
