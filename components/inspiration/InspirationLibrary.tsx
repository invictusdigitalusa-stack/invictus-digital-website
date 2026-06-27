"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  categories,
  designPrinciples,
  inspirations,
  sortOptions,
  type InspirationCategory,
  type SortOption,
} from "./data";

const inputClassName =
  "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#22C55E]/40 focus:bg-white/[0.05]";

export function InspirationLibrary() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    InspirationCategory | "All"
  >("All");
  const [sort, setSort] = useState<SortOption>("Recently Added");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    let results = inspirations.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesSearch =
        !query ||
        item.company.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    results = [...results].sort((a, b) => {
      if (sort === "Company A–Z") {
        return a.company.localeCompare(b.company);
      }
      if (sort === "Country A–Z") {
        return a.country.localeCompare(b.country);
      }
      return inspirations.indexOf(a) - inspirations.indexOf(b);
    });

    return results;
  }, [search, categoryFilter, sort]);

  const grouped = useMemo(() => {
    if (categoryFilter !== "All") {
      return [{ category: categoryFilter, items: filtered }];
    }

    return categories
      .map((category) => ({
        category,
        items: filtered.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [filtered, categoryFilter]);

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSaved((prev) => new Set(prev).add(id));
  }

  const statCards = [
    { label: "Saved Inspirations", value: saved.size.toString() },
    {
      label: "Landscaping",
      value: inspirations
        .filter((i) => i.category === "Landscaping")
        .length.toString(),
    },
    {
      label: "Home Services",
      value: inspirations
        .filter((i) => i.category === "Home Services")
        .length.toString(),
    },
    { label: "Favorites", value: favorites.size.toString() },
  ];

  return (
    <Container className="py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
          Internal Library
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
          Inspiration Library
        </h1>
        <p className="mt-4 text-base leading-8 text-zinc-400 md:text-lg">
          Curated references for premium web design across landscaping, home
          services, and general digital products.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="p-5 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <div>
          <Card className="mb-8 p-4 md:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
              <label className="relative block">
                <span className="sr-only">Search inspirations</span>
                <input
                  type="search"
                  placeholder="Search company, country, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputClassName} pl-11`}
                />
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </label>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as InspirationCategory | "All"
                  )
                }
                className={`${inputClassName} cursor-pointer lg:min-w-[180px]`}
                aria-label="Filter by category"
              >
                <option value="All" className="bg-[#0a0a0a]">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-[#0a0a0a]">
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className={`${inputClassName} cursor-pointer lg:min-w-[180px]`}
                aria-label="Sort inspirations"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#0a0a0a]">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter("All")}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  categoryFilter === "All"
                    ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategoryFilter(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    categoryFilter === category
                      ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                      : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-14">
            {grouped.length > 0 ? (
              grouped.map((group) => (
                <section key={group.category}>
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-white">
                      {group.category}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {group.items.length} references
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {group.items.map((item) => {
                      const isSaved = saved.has(item.id);
                      const isFavorite = favorites.has(item.id);

                      return (
                        <Card
                          key={item.id}
                          className="overflow-hidden transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
                        >
                          <div
                            className={`relative aspect-[16/10] bg-gradient-to-br ${item.gradient}`}
                            role="img"
                            aria-label={`${item.company} website preview`}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
                            <div className="absolute left-4 top-4 rounded-full border border-white/[0.12] bg-black/30 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                              {item.category}
                            </div>
                            {isFavorite ? (
                              <div className="absolute right-4 top-4 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-[10px] font-medium text-[#22C55E]">
                                Favorite
                              </div>
                            ) : null}
                          </div>

                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-white">
                              {item.company}
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500">
                              {item.country}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-zinc-400">
                              {item.reason}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/[0.15] hover:bg-white/[0.08]"
                              >
                                Visit Website
                              </a>
                              <button
                                type="button"
                                onClick={() => toggleSaved(item.id)}
                                className={`inline-flex flex-1 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                                  isSaved
                                    ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                                    : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
                                }`}
                              >
                                {isSaved ? "Saved" : "Save Inspiration"}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleFavorite(item.id)}
                              className="mt-3 text-xs font-medium text-zinc-500 transition hover:text-[#22C55E]"
                            >
                              {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-zinc-500">
                  No inspirations match your search or filters.
                </p>
              </Card>
            )}
          </div>
        </div>

        <aside>
          <Card className="sticky top-24 p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
              Design Principles
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              What we look for
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Reference these principles when auditing sites or building client
              previews.
            </p>

            <ul className="mt-6 space-y-3">
              {designPrinciples.map((principle) => (
                <li
                  key={principle}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]"
                    aria-hidden="true"
                  />
                  {principle}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
