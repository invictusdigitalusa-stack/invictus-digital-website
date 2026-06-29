export type BusinessProfile = {
  businessSummary: string;

  companyTone: string;
  targetAudience: string;

  mainServices: string[];
  uniqueSellingPoints: string[];
  competitiveAdvantages: string[];

  brandPositioning: string;

  trustSignals: string[];

  biggestWeaknesses: string[];
  biggestOpportunities: string[];

  recommendedOffer: string;
  recommendedPackage: string;

  estimatedBusinessSize: string;

  seoMaturity: string;
  conversionMaturity: string;
  aiVisibilityMaturity: string;

  priorityFocus: string;

  email: string;
  phone: string;
  contactName: string;
  domain: string;

  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;

  googleBusinessProfile: string;
  googleMapsUrl: string;
};

export type BusinessProfileField = keyof BusinessProfile;