import type { WebsiteSocials } from "./types";

function findFirstSocialLink(links: string[], domains: string[]) {
  return (
    links.find((link) => {
      const lower = link.toLowerCase();
      return domains.some((domain) => lower.includes(domain));
    }) ?? null
  );
}

export function extractWebsiteSocials(links: string[]): WebsiteSocials {
  return {
    facebook: findFirstSocialLink(links, ["facebook.com"]),
    instagram: findFirstSocialLink(links, ["instagram.com"]),
    linkedin: findFirstSocialLink(links, ["linkedin.com"]),
    youtube: findFirstSocialLink(links, ["youtube.com", "youtu.be"]),
    x: findFirstSocialLink(links, ["x.com", "twitter.com"]),
    tiktok: findFirstSocialLink(links, ["tiktok.com"]),
  };
}