"use client";

import { ConsoleArt } from "@/components/ConsoleArt";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleArt />
      {children}
      <Toaster />
    </>
  );
}
