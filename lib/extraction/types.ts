export type WebsiteSocials = {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    x: string | null;
    tiktok: string | null;
  };
  
  export type WebsiteContact = {
    emails: string[];
    phones: string[];
    contactPages: string[];
  };
  
  export type WebsiteMetadata = {
    title: string | null;
    description: string | null;
    language: string | null;
    canonical: string | null;
    favicon: string | null;
  };
  
  export type WebsiteSnapshot = {
    url: string;
    finalUrl: string;
    statusCode: number;
  
    html: string;
  
    metadata: WebsiteMetadata;
  
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
    };
  
    contact: WebsiteContact;
  
    socials: WebsiteSocials;
  
    links: string[];
  
    images: string[];
  
    schema: unknown[];
  
    jsonLd: unknown[];
  };