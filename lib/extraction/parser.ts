import type { WebsiteMetadata } from "./types";

function getFirstMatch(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.trim() || null;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getHeadings(html: string, tag: "h1" | "h2" | "h3") {
  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return Array.from(html.matchAll(pattern))
    .map((match) => stripTags(match[1] ?? ""))
    .filter(Boolean)
    .slice(0, 20);
}

export function parseWebsiteMetadata(html: string): WebsiteMetadata {
  return {
    title: getFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: getFirstMatch(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
    ),
    language: getFirstMatch(html, /<html[^>]+lang=["']([^"']+)["']/i),
    canonical: getFirstMatch(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ),
    favicon: getFirstMatch(
      html,
      /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["'][^>]*>/i
    ),
  };
}

export function parseWebsiteHeadings(html: string) {
  return {
    h1: getHeadings(html, "h1"),
    h2: getHeadings(html, "h2"),
    h3: getHeadings(html, "h3"),
  };
}

export function parseWebsiteLinks(html: string) {
  const links = Array.from(
    html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)
  )
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(links)).slice(0, 200);
}

export function parseWebsiteImages(html: string) {
  const images = Array.from(
    html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)
  )
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(images)).slice(0, 100);
}