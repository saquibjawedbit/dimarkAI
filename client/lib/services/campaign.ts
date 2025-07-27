import axiosClient from '@/api/axiosClient';

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

// Ad Types
export interface Ad {
  id: string;
  userId: string;
  facebookAdId: string;
  name: string;
  adsetId: string;
  campaignId: string;
  creativeId: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  effectiveStatus: string;
  configuredStatus: string;
  bidAmount?: number;
  conversionDomain?: string;
  tracking?: any;
  issues?: any[];
  recommendations?: any[];
  createdTime: string;
  updatedTime: string;
  
  // Performance metrics
  impressions?: number;
  clicks?: number;
  spend?: number;
  ctr?: number;
  cpc?: number;
  conversions?: number;
  
  // Additional Facebook fields
  adReviewFeedback?: any;
  adScheduleStartTime?: string;
  adScheduleEndTime?: string;
  adLabels?: Array<{
    id: string;
    name: string;
  }>;
  previewShareableLink?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdRequest {
  name: string;
  adsetId: string;
  creativeId: string;
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  trackingSpecs?: any[];
  conversionDomain?: string;
  adLabels?: Array<{
    id: string;
    name: string;
  }>;
  adScheduleStartTime?: string;
  adScheduleEndTime?: string;
}

export interface UpdateAdRequest {
  name?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  trackingSpecs?: any[];
  conversionDomain?: string;
  adLabels?: Array<{
    id: string;
    name: string;
  }>;
  adScheduleStartTime?: string;
  adScheduleEndTime?: string;
}

export interface AdListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  campaignId?: string;
  adsetId?: string;
  creativeId?: string;
  fields?: string[];
}

export interface AdListResponse {
  data: Ad[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdInsightsParams {
  since?: string;
  until?: string;
}

export interface AdPreviewParams {
  adFormat?: string;
}

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
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
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

export interface CreateCampaignRequest {
    name: string;
    objective: CampaignObjective;
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

export interface Campaign {
    _id: string;
    userId: string;
    name: string;
    objective: CampaignObjective;
    status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
    dailyBudget?: number;
    lifetimeBudget?: number;
    bidStrategy?: string;
    bidAmount?: number;
    startTime?: string;
    endTime?: string;
    targetingSpec?: any;
    facebookAdAccountId: string;
    facebookCampaignId?: string;
    impressions?: number;
    clicks?: number;
    spend?: number;
    conversions?: number;
    ctr?: number;
    cpc?: number;
    cpm?: number;
    roas?: number;
    frequency?: number;
    reach?: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedCampaignResponse {
    data: Campaign[];
    length: number;
}

export interface CampaignFilters {
    status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
    objective?: string;
    startDate?: string;
    endDate?: string;
    facebookAdAccountId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface BulkCampaignOperation {
    campaignIds: string[];
    operation: 'pause' | 'activate' | 'archive' | 'delete';
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

class CampaignService {
    // Create a new ad set for a campaign
    async createAdSet(campaignId: string, adSetData: any) {
        return axiosClient.post(`/api/adsets`, { ...adSetData, campaignId }).then(res => res.data);
    }

    // Get all ad sets for a campaign
    async getAdSetsByCampaign(campaignId: string) {
        return axiosClient.get(`/api/adsets/campaign/${campaignId}`).then(res => res.data);
    }

    // Get ad set by ID
    async getAdSetById(adSetId: string) {
        return axiosClient.get(`/api/adsets/${adSetId}`).then(res => res.data);
    }

    // Update ad set
    async updateAdSet(adSetId: string, updateData: any) {
        return axiosClient.put(`/api/adsets/${adSetId}`, updateData).then(res => res.data);
    }

    // Delete ad set
    async deleteAdSet(adSetId: string) {
        return axiosClient.delete(`/api/adsets/${adSetId}`).then(res => res.data);
    }

    // Pause ad set
    async pauseAdSet(adSetId: string) {
        return axiosClient.post(`/api/adsets/${adSetId}/pause`).then(res => res.data);
    }

    // Activate ad set
    async activateAdSet(adSetId: string) {
        return axiosClient.post(`/api/adsets/${adSetId}/activate`).then(res => res.data);
    }

    // Get ad set insights
    async getAdSetInsights(adSetId: string, dateRange?: { start: string; end: string }) {
        const queryParams = new URLSearchParams();
        if (dateRange) {
            queryParams.append('start', dateRange.start);
            queryParams.append('end', dateRange.end);
        }

        const queryString = queryParams.toString();
        const endpoint = queryString
            ? `/api/adsets/${adSetId}/insights?${queryString}`
            : `/api/adsets/${adSetId}/insights`;

        return axiosClient.get(endpoint).then(res => res.data);
    }

    // Sync ad sets with Facebook
    async syncAdSetsWithFacebook(campaignId: string) {
        return axiosClient.post(`/api/adsets/campaign/${campaignId}/sync`).then(res => res.data);
    }
    
    private readonly baseEndpoint = '/api/campaigns';

    // Create a new campaign
    async createCampaign(campaignData: CreateCampaignRequest) {
        return axiosClient.post(this.baseEndpoint, campaignData).then(res => res.data);
    }

    // Get all campaigns with filtering and pagination
    async getCampaigns(filters: CampaignFilters = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const endpoint = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;

        return axiosClient.get(endpoint).then(res => res.data);
    }

    // Get campaign by ID
    async getCampaignById(campaignId: string) {
        return axiosClient.get(`${this.baseEndpoint}/${campaignId}`).then(res => res.data);
    }

    // Update campaign
    async updateCampaign(campaignId: string, updateData: Partial<CreateCampaignRequest>) {
        return axiosClient.put(`${this.baseEndpoint}/${campaignId}`, updateData).then(res => res.data);
    }

    // Delete campaign
    async deleteCampaign(campaignId: string) {
        return axiosClient.delete(`${this.baseEndpoint}/${campaignId}`).then(res => res.data);
    }

    // Pause campaign
    async pauseCampaign(campaignId: string) {
        return axiosClient.post(`${this.baseEndpoint}/${campaignId}/pause`).then(res => res.data);
    }

    // Activate campaign
    async activateCampaign(campaignId: string) {
        return axiosClient.post(`${this.baseEndpoint}/${campaignId}/activate`).then(res => res.data);
    }

    // Archive campaign
    async archiveCampaign(campaignId: string) {
        return axiosClient.post(`${this.baseEndpoint}/${campaignId}/archive`).then(res => res.data);
    }

    // Duplicate campaign
    async duplicateCampaign(campaignId: string) {
        return axiosClient.post(`${this.baseEndpoint}/${campaignId}/duplicate`).then(res => res.data);
    }

    // Get campaign insights
    async getCampaignInsights(campaignId: string, dateRange?: { start: string; end: string }) {
        const queryParams = new URLSearchParams();
        if (dateRange) {
            queryParams.append('start', dateRange.start);
            queryParams.append('end', dateRange.end);
        }

        const queryString = queryParams.toString();
        const endpoint = queryString
            ? `${this.baseEndpoint}/${campaignId}/insights?${queryString}`
            : `${this.baseEndpoint}/${campaignId}/insights`;

        return axiosClient.get(endpoint).then(res => res.data);
    }

    // Bulk operations
    async bulkOperation(operation: BulkCampaignOperation) {
        return axiosClient.post(`${this.baseEndpoint}/bulk`, operation).then(res => res.data);
    }

    // Sync with Facebook
    async syncWithFacebook(facebookAdAccountId: string) {
        return axiosClient.post(`${this.baseEndpoint}/sync`, { facebookAdAccountId }).then(res => res.data);
    }
}

export const campaignService = new CampaignService();