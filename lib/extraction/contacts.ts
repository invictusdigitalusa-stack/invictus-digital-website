import type { WebsiteContact } from "./types";

function cleanEmail(value: string) {
  return value
    .replace(/^mailto:/i, "")
    .split("?")[0]
    .trim()
    .toLowerCase();
}

function cleanPhone(value: string) {
  return value
    .replace(/^tel:/i, "")
    .replace(/[^\d+]/g, "")
    .trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function extractWebsiteContacts(html: string, links: string[]): WebsiteContact {
  const mailtoEmails = links
    .filter((link) => link.toLowerCase().startsWith("mailto:"))
    .map(cleanEmail);

  const visibleEmails =
    html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.map(cleanEmail) ??
    [];

  const telPhones = links
    .filter((link) => link.toLowerCase().startsWith("tel:"))
    .map(cleanPhone);

  const visiblePhones =
    html.match(/(?:\+?\d[\d\s().-]{7,}\d)/g)?.map(cleanPhone) ?? [];

  const contactPages = links.filter((link) => {
    const lower = link.toLowerCase();

    return (
      lower.includes("contact") ||
      lower.includes("kontakt") ||
      lower.includes("about") ||
      lower.includes("om-oss")
    );
  });

  return {
    emails: unique([...mailtoEmails, ...visibleEmails]).slice(0, 10),
    phones: unique([...telPhones, ...visiblePhones]).slice(0, 10),
    contactPages: unique(contactPages).slice(0, 20),
  };
}