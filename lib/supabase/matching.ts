import type { SupabaseClient } from "@supabase/supabase-js";
import type { BusinessProfile } from "../businessProfileTypes";

function normalizeWebsite(url: string) {
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

export async function findLeadId(
  supabase: SupabaseClient,
  companyName: string,
  websiteUrl: string
): Promise<string | null> {
  const website = websiteUrl.trim();
  const company = companyName.trim();

  if (website) {
    const normalizedWebsite = normalizeWebsite(website);

    const { data, error } = await supabase
      .from("leads")
      .select("id, website")
      .not("website", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    const websiteMatch = data?.find(
      (lead) => normalizeWebsite(lead.website ?? "") === normalizedWebsite
    );

    if (websiteMatch) {
      return websiteMatch.id;
    }
  }

  if (company) {
    const { data, error } = await supabase
      .from("leads")
      .select("id, company")
      .not("company", "is", null);

    if (error) {
      throw new Error(error.message);
    }

    const companyMatch = data?.find(
      (lead) =>
        (lead.company ?? "").trim().toLowerCase() === company.toLowerCase()
    );

    if (companyMatch) {
      return companyMatch.id;
    }
  }

  return null;
}

export function mapBusinessProfileToLeadUpdate(profile: BusinessProfile) {
  return {
    business_summary: profile.businessSummary,

    company_tone: profile.companyTone,
    target_audience: profile.targetAudience,

    main_services: profile.mainServices,
    unique_selling_points: profile.uniqueSellingPoints,
    competitive_advantages: profile.competitiveAdvantages,

    brand_positioning: profile.brandPositioning,

    trust_signals: profile.trustSignals,

    biggest_weaknesses: profile.biggestWeaknesses,
    biggest_opportunities: profile.biggestOpportunities,

    recommended_offer: profile.recommendedOffer,
    recommended_package: profile.recommendedPackage,

    estimated_business_size: profile.estimatedBusinessSize,

    seo_maturity: profile.seoMaturity,
    conversion_maturity: profile.conversionMaturity,
    ai_visibility_maturity: profile.aiVisibilityMaturity,

    priority_focus: profile.priorityFocus,

    email: profile.email || null,
    phone: profile.phone || null,
    contact_name: profile.contactName || null,
    domain: profile.domain || null,

    facebook: profile.facebook || null,
    instagram: profile.instagram || null,
    linkedin: profile.linkedin || null,
    youtube: profile.youtube || null,

    google_business_profile: profile.googleBusinessProfile || null,
    google_maps_url: profile.googleMapsUrl || null,
  };
}