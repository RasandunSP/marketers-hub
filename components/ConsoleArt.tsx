"use client";

import { useEffect } from "react";
import { logMarketersHubConsoleArt } from "@/lib/console-art";

/** Logs ASCII banner to devtools when the app mounts (each full page load). */
export function ConsoleArt() {
  useEffect(() => {
    logMarketersHubConsoleArt();
  }, []);

  return null;
}
