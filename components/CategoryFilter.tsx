"use client";

import { CATEGORIES } from "@/lib/resources";

type CategoryFilterProps = {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  counts: Record<string, number>;
  totalCount: number;
};

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  counts,
  totalCount,
}: CategoryFilterProps) {
  const pills =
    categories.length > 0 ? categories : [...CATEGORIES];

  return (
    <div className="border-b border-[#eee] bg-white px-5 py-3 md:px-9">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#999]">
          Filter by type
        </p>
        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterPill
            label="All"
            count={totalCount}
            active={activeCategory === null}
            onClick={() => onCategoryChange(null)}
          />
          {pills.map((category) => (
            <FilterPill
              key={category}
              label={category}
              count={counts[category] ?? 0}
              active={activeCategory === category}
              onClick={() =>
                onCategoryChange(
                  activeCategory === category ? null : category,
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-wide transition-all md:text-xs ${
        active
          ? "bg-[#037EF3] text-white shadow-md shadow-[#037EF3]/25 ring-2 ring-[#037EF3]/30"
          : "bg-[#f0f0f0] text-[#444] hover:bg-[#e8e8e8]"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
          active ? "bg-white/25 text-white" : "bg-white text-[#888]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
