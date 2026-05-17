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
    <header className="flex items-center justify-between gap-5 px-5 py-3.5 md:px-9">
      <div className="flex shrink-0 items-center gap-2.5">
        <Image
          src="/Logos/AIESEC-Human-Blue.png"
          alt="AIESEC"
          width={40}
          height={40}
          className="shrink-0 rounded-lg"
        />
        <div>
          <p className="text-sm font-bold leading-tight text-black md:text-base">
            AIESEC in Sri Lanka
          </p>
          <p className="text-[11px] text-[#888] md:text-xs">Marketers HUB</p>
        </div>
      </div>
      <div className="relative min-w-0 flex-1 sm:max-w-lg md:max-w-xl">
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search [ CTRL + K ]"
          className="h-10 w-full rounded-full border-0 bg-[#f0f0f0] px-4 pr-11 text-[13px] text-[#888] outline-none placeholder:text-[#aaa] focus:ring-2 focus:ring-[#037EF3]/30"
          aria-label="Search resources"
        />
        <SearchIcon className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#999]" />
      </div>
    </header>
  );
}
