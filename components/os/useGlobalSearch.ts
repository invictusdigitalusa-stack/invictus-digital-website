"use client";

import { useEffect, useState } from "react";
import type { GlobalSearchResults } from "@/lib/globalSearch";

const emptyResults: GlobalSearchResults = {
  leads: [],
  projects: [],
  activity: [],
};

export function useGlobalSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<GlobalSearchResults>(emptyResults);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (!enabled || trimmed.length < 2) {
      setResults(emptyResults);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setResults(emptyResults);
          return;
        }

        const data = (await response.json()) as GlobalSearchResults;
        setResults(data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults(emptyResults);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [enabled, query]);

  return { results, isSearching };
}
