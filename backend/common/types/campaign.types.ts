// Campaign-specific types
export interface CreateCampaignRequest {
  name: string;
  objective: string;
  status?: 'ACTIVE' | 'PAUSED';
  dailyBudget?: number;
  lifetimeBudget?: number;
  bidStrategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'TARGET_COST' | 'COST_CAP';
  bidAmount?: number;
  startTime?: string;
  endTime?: string;
  targetingSpec?: {
    ageMin?: number;
    ageMax?: number;
    genders?: number[];
    geoLocations?: {
      countries?: string[];
      regions?: Array<{
        key: string;
        name: string;
      }>;
      cities?: Array<{
        key: string;
        name: string;
        radius?: number;
        distanceUnit: 'mile' | 'kilometer';
      }>;
    };
    interests?: Array<{
      id: string;
      name: string;
    }>;
    behaviors?: Array<{
      id: string;
      name: string;
    }>;
    customAudiences?: string[];
    lookalikAudiences?: string[];
    devicePlatforms?: string[];
    languages?: number[];
  };
  facebookAdAccountId: string;
}

export interface UpdateCampaignRequest {
  name?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  dailyBudget?: number;
  lifetimeBudget?: number;
  bidStrategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'TARGET_COST' | 'COST_CAP';
  bidAmount?: number;
  startTime?: string;
  endTime?: string;
  targetingSpec?: {
    ageMin?: number;
    ageMax?: number;
    genders?: number[];
    geoLocations?: {
      countries?: string[];
      regions?: Array<{
        key: string;
        name: string;
      }>;
      cities?: Array<{
        key: string;
        name: string;
        radius?: number;
        distanceUnit: 'mile' | 'kilometer';
      }>;
    };
    interests?: Array<{
      id: string;
      name: string;
    }>;
    behaviors?: Array<{
      id: string;
      name: string;
    }>;
    customAudiences?: string[];
    lookalikAudiences?: string[];
    devicePlatforms?: string[];
    languages?: number[];
  };
}

export interface FacebookCampaignResponse {
  id: string;
  name: string;
  objective: string;
  status: string;
  daily_budget?: string;
  lifetime_budget?: string;
  bid_strategy: string;
  bid_amount?: string;
  start_time?: string;
  stop_time?: string;
  targeting?: any;
  created_time: string;
  updated_time: string;
}

export interface CampaignInsights {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  frequency: number;
  reach: number;
}

export interface CampaignFilters {
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective?: string;
  startDate?: string;
  endDate?: string;
  facebookAdAccountId?: string;
}

export interface BulkCampaignOperation {
  campaignIds: string[];
  operation: 'pause' | 'activate' | 'archive' | 'delete';
  updateData?: Partial<UpdateCampaignRequest>;
}
