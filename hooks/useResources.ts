"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FALLBACK_RESOURCES, type Resource } from "@/lib/resources";
import { SHEET_POLL_INTERVAL_MS } from "@/lib/sheet-config";

type ResourcesResponse = {
  resources: Resource[];
  fetchedAt: string;
};

async function fetchResourcesFromApi(): Promise<ResourcesResponse> {
  const response = await fetch(`/api/resources?_=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  const data = (await response.json()) as ResourcesResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load resources");
  }

  return data;
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const data = await fetchResourcesFromApi();

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
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      void load();
    }, SHEET_POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void load();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [load]);

  return { resources, loading, error, lastUpdated, refresh: load };
}
