export type FetchWebsiteResult = {
    url: string;
    finalUrl: string;
    statusCode: number;
    html: string;
    error: string | null;
  };
  
  export async function fetchWebsite(url: string): Promise<FetchWebsiteResult> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; InvictusBot/1.0; +https://invictusdigital.com)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
      });
  
      const html = await response.text();
  
      return {
        url,
        finalUrl: response.url,
        statusCode: response.status,
        html,
        error: null,
      };
    } catch (error) {
      return {
        url,
        finalUrl: url,
        statusCode: 0,
        html: "",
        error: error instanceof Error ? error.message : "Failed to fetch website.",
      };
    }
  }