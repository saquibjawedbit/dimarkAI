import { apiService } from './api';

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

export interface Campaign {
    _id: string;
    userId: string;
    name: string;
    objective: string;
    status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
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
        return apiService.post(`/api/adsets`, { ...adSetData, campaignId });
    }
    
    // Get all ad sets for a campaign
    async getAdSetsByCampaign(campaignId: string) {
        return apiService.get(`/api/adsets/campaign/${campaignId}`);
    }
    
    // Get ad set by ID
    async getAdSetById(adSetId: string) {
        return apiService.get(`/api/adsets/${adSetId}`);
    }
    
    // Update ad set
    async updateAdSet(adSetId: string, updateData: any) {
        return apiService.put(`/api/adsets/${adSetId}`, updateData);
    }
    
    // Delete ad set
    async deleteAdSet(adSetId: string) {
        return apiService.delete(`/api/adsets/${adSetId}`);
    }
    
    // Pause ad set
    async pauseAdSet(adSetId: string) {
        return apiService.post(`/api/adsets/${adSetId}/pause`);
    }
    
    // Activate ad set
    async activateAdSet(adSetId: string) {
        return apiService.post(`/api/adsets/${adSetId}/activate`);
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
            
        return apiService.get(endpoint);
    }
    
    // Sync ad sets with Facebook
    async syncAdSetsWithFacebook(campaignId: string) {
        return apiService.post(`/api/adsets/campaign/${campaignId}/sync`);
    }
    
    private readonly baseEndpoint = '/api/campaigns';

    // Create a new campaign
    async createCampaign(campaignData: CreateCampaignRequest) {
        return apiService.post<Campaign>(this.baseEndpoint, campaignData);
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

        return apiService.get<PaginatedCampaignResponse>(endpoint);
    }

    // Get campaign by ID
    async getCampaignById(campaignId: string) {
        return apiService.get<Campaign>(`${this.baseEndpoint}/${campaignId}`);
    }

    // Update campaign
    async updateCampaign(campaignId: string, updateData: Partial<CreateCampaignRequest>) {
        return apiService.put<Campaign>(`${this.baseEndpoint}/${campaignId}`, updateData);
    }

    // Delete campaign
    async deleteCampaign(campaignId: string) {
        return apiService.delete(`${this.baseEndpoint}/${campaignId}`);
    }

    // Pause campaign
    async pauseCampaign(campaignId: string) {
        return apiService.post<Campaign>(`${this.baseEndpoint}/${campaignId}/pause`);
    }

    // Activate campaign
    async activateCampaign(campaignId: string) {
        return apiService.post<Campaign>(`${this.baseEndpoint}/${campaignId}/activate`);
    }

    // Archive campaign
    async archiveCampaign(campaignId: string) {
        return apiService.post<Campaign>(`${this.baseEndpoint}/${campaignId}/archive`);
    }

    // Duplicate campaign
    async duplicateCampaign(campaignId: string) {
        return apiService.post<Campaign>(`${this.baseEndpoint}/${campaignId}/duplicate`);
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

        return apiService.get<CampaignInsights>(endpoint);
    }

    // Bulk operations
    async bulkOperation(operation: BulkCampaignOperation) {
        return apiService.post(`${this.baseEndpoint}/bulk`, operation);
    }

    // Sync with Facebook
    async syncWithFacebook(facebookAdAccountId: string) {
        return apiService.post(`${this.baseEndpoint}/sync`, { facebookAdAccountId });
    }
}

export const campaignService = new CampaignService();
