export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  facebookPages?: FacebookPage[];
  facebookAdAccounts?: FacebookAdAccount[];
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  website?: string;
  industry: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  accessToken: string;
  category: string;
  connected: boolean;
}

export interface FacebookAdAccount {
  id: string;
  name: string;
  accountId: string;
  currency: string;
  timeZone: string;
  connected: boolean;
}

// Export Ad types
export * from './ad.types';

export interface AdCreative {
  id: string;
  userId: string;
  headline: string;
  description: string;
  imageUrl: string;
  callToAction: string;
  status: 'draft' | 'published' | 'archive';
  createdAt: string;
  updatedAt: string;
  facebookPageId?: string;
  facebookAdAccountId?: string;
}

export type CampaignObjective = 
  | 'OUTCOME_LEADS'
  | 'OUTCOME_SALES'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_APP_PROMOTION';

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  objective: CampaignObjective;
  budget: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  adSetCount: number;
  createdAt: string;
  updatedAt: string;
  facebookPageId: string;
  facebookAdAccountId: string;
  facebookCampaignId?: string;
}

export interface AdSet {
  id: string;
  campaignId: string;
  userId: string;
  name: string;
  targetingAge: [number, number];
  targetingGender: 'all' | 'male' | 'female';
  targetingLocations: string[];
  targetingInterests: string[];
  budget: number;
  schedule: string[];
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  facebookAdSetId?: string;
}

export interface AdPerformance {
  id: string;
  adId: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  conversionValue: number;
  roas: number;
}

export interface OptimizationSuggestion {
  id: string;
  adId: string;
  type: 'audience' | 'creative' | 'budget';
  description: string;
  expectedImprovement: string;
  status: 'pending' | 'applied' | 'rejected';
  createdAt: string;
}