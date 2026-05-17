"use client";

import Image from "next/image";
import { SearchIcon } from "./icons";

type HeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
};

export function Header({ query, onQueryChange, searchRef }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-5 md:px-10">
      <div className="flex shrink-0 items-center gap-3">
        <Image
          src="/aiesec-logo.svg"
          alt="AIESEC"
          width={44}
          height={44}
          className="shrink-0"
        />
        <div>
          <p className="text-base font-bold leading-tight text-black md:text-lg">
            AIESEC in Sri Lanka
          </p>
          <p className="text-xs text-[#888] md:text-sm">Marketers HUB</p>
        </div>
      </div>
      <div className="relative min-w-0 flex-1 sm:max-w-xl md:max-w-2xl">
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search [ CTRL + K ]"
          className="h-11 w-full rounded-full border-0 bg-[#f0f0f0] px-5 pr-12 text-sm text-[#888] outline-none placeholder:text-[#aaa] focus:ring-2 focus:ring-[#037EF3]/30"
          aria-label="Search resources"
        />
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#999]" />
      </div>
    </header>
  );
}
