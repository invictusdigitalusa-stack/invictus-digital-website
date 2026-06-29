import { extractWebsiteContacts } from "./contacts";
import { fetchWebsite } from "./fetch";
import {
  parseWebsiteHeadings,
  parseWebsiteImages,
  parseWebsiteLinks,
  parseWebsiteMetadata,
} from "./parser";
import { extractWebsiteSocials } from "./socials";
import type { WebsiteSnapshot } from "./types";

export async function createWebsiteSnapshot(
  url: string
): Promise<{ snapshot: WebsiteSnapshot | null; error: string | null }> {
  const fetched = await fetchWebsite(url);

  if (fetched.error) {
    return {
      snapshot: null,
      error: fetched.error,
    };
  }

  const metadata = parseWebsiteMetadata(fetched.html);
  const headings = parseWebsiteHeadings(fetched.html);
  const links = parseWebsiteLinks(fetched.html);
  const images = parseWebsiteImages(fetched.html);
  const contact = extractWebsiteContacts(fetched.html, links);
  const socials = extractWebsiteSocials(links);

  return {
    snapshot: {
      url: fetched.url,
      finalUrl: fetched.finalUrl,
      statusCode: fetched.statusCode,
      html: fetched.html,
      metadata,
      headings,
      contact,
      socials,
      links,
      images,
      schema: [],
      jsonLd: [],
    },
    error: null,
  };
}