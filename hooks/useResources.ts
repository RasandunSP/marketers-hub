"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FALLBACK_RESOURCES, type Resource } from "@/lib/resources";
import { SHEET_POLL_INTERVAL_MS } from "@/lib/sheet-config";

type ResourcesResponse = {
  resources: Resource[];
  fetchedAt: string;
};

async function fetchResourcesFromApi(
  signal?: AbortSignal,
): Promise<ResourcesResponse> {
  const response = await fetch(`/api/resources?_=${Date.now()}`, {
    cache: "no-store",
    signal,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (background = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchResourcesFromApi(controller.signal);

      if (controller.signal.aborted) return;

      setResources(data.resources);
      setLastUpdated(data.fetchedAt);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      if (controller.signal.aborted) return;

      const message =
        err instanceof Error ? err.message : "Failed to load resources";
      setError(message);
      if (!hasLoadedRef.current) {
        setResources(FALLBACK_RESOURCES);
      }
    } finally {
      if (controller.signal.aborted) return;

      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);

    const interval = window.setInterval(() => {
      void load(true);
    }, SHEET_POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void load(true);
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      abortRef.current?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [load]);

  return {
    resources,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh: () => load(hasLoadedRef.current),
  };
}
