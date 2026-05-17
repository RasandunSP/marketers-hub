"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { ResourceCard } from "@/components/ResourceCard";
import { RESOURCES } from "@/lib/resources";

export function MarketersHub() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const matchesCategory = !category || r.category === category;
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.url.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        query={query}
        onQueryChange={setQuery}
        searchRef={searchRef}
      />
      <HeroBanner activeCategory={category} onCategoryChange={setCategory} />
      <main className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:gap-12">
          <div className="flex w-full flex-col gap-5 lg:max-w-md xl:max-w-lg">
            {filtered.length > 0 ? (
              filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <p className="rounded-2xl bg-[#f0f0f0] p-6 text-center text-sm text-[#888]">
                No resources match your search.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
