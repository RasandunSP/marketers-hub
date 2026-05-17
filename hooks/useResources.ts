"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FALLBACK_RESOURCES, type Resource } from "@/lib/resources";
import { SHEET_POLL_INTERVAL_MS } from "@/lib/sheet-config";

type ResourcesResponse = {
  resources: Resource[];
  fetchedAt: string;
};

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/resources", { cache: "no-store" });
      const data = (await response.json()) as ResourcesResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load resources");
      }

      setResources(data.resources);
      setLastUpdated(data.fetchedAt);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load resources";
      setError(message);
      if (!hasLoadedRef.current) {
        setResources(FALLBACK_RESOURCES);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => {
      void load();
    }, SHEET_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [load]);

  return { resources, loading, error, lastUpdated, refresh: load };
}
