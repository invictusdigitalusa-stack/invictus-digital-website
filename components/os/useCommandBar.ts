"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildPaletteItems } from "./buildPaletteItems";
import { useGlobalSearch } from "./useGlobalSearch";

export type CommandDefinition = {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  icon: React.ReactNode;
  action: () => void;
  group?: "Commands" | "Leads" | "Projects" | "Activity";
  statusLabel?: string | null;
  statusStyle?: string;
};

export function useCommandBar(
  commands: CommandDefinition[],
  router: AppRouterInstance,
  searchIcons: {
    lead: React.ReactNode;
    project: React.ReactNode;
    activity: React.ReactNode;
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, isSearching } = useGlobalSearch(query, isOpen);

  const paletteItems = useMemo(
    () => buildPaletteItems(commands, results, query, router, searchIcons),
    [commands, query, results, router, searchIcons]
  );

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const executeSelected = useCallback(() => {
    const selected = paletteItems[selectedIndex];

    if (!selected) {
      return;
    }

    selected.action();
    close();
  }, [close, paletteItems, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (selectedIndex >= paletteItems.length) {
      setSelectedIndex(Math.max(paletteItems.length - 1, 0));
    }
  }, [paletteItems.length, selectedIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (isModifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => {
          if (current) {
            return false;
          }

          setQuery("");
          setSelectedIndex(0);
          return true;
        });
        return;
      }

      if (!isOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((current) =>
          paletteItems.length === 0
            ? 0
            : Math.min(current + 1, paletteItems.length - 1)
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        executeSelected();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, executeSelected, isOpen, paletteItems.length]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    paletteItems,
    selectedIndex,
    setSelectedIndex,
    executeSelected,
    isSearching,
  };
}
