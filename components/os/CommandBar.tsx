"use client";

import { Fragment } from "react";
import { CommandItem } from "./CommandItem";
import type { CommandDefinition } from "./useCommandBar";

type CommandBarProps = {
  isOpen: boolean;
  query: string;
  setQuery: (value: string) => void;
  paletteItems: CommandDefinition[];
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
  executeSelected: () => void;
  close: () => void;
  isSearching: boolean;
};

export function CommandBar({
  isOpen,
  query,
  setQuery,
  paletteItems,
  selectedIndex,
  setSelectedIndex,
  executeSelected,
  close,
  isSearching,
}: CommandBarProps) {
  if (!isOpen) {
    return null;
  }

  const isRecordSearch = query.trim().length >= 2;
  const emptyMessage = isRecordSearch ? "No results found." : "No commands found.";

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 py-16 md:py-24">
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]">
        <div className="border-b border-white/[0.08] px-4 py-4 md:px-5">
          <label className="relative block">
            <span className="sr-only">Search commands and records</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search leads, projects, commands..."
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3 pr-4 pl-11 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#22C55E]/40 focus:bg-white/[0.05]"
            />
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10.5 10.5L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </label>
          <p className="mt-3 text-xs text-zinc-500">
            {isSearching
              ? "Searching..."
              : "Navigate with ↑ ↓ · Enter to open · Esc to close"}
          </p>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2 md:p-3">
          {paletteItems.length > 0 ? (
            <div className="space-y-1">
              {paletteItems.map((item, index) => {
                const showGroupHeader =
                  item.group &&
                  (index === 0 || paletteItems[index - 1]?.group !== item.group);

                return (
                  <Fragment key={item.id}>
                    {showGroupHeader ? (
                      <p className="px-4 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600 first:pt-1">
                        {item.group}
                      </p>
                    ) : null}
                    <CommandItem
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      statusLabel={item.statusLabel}
                      statusStyle={item.statusStyle}
                      isSelected={index === selectedIndex}
                      onClick={() => {
                        item.action();
                        close();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    />
                  </Fragment>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">
              {isSearching ? "Searching..." : emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
