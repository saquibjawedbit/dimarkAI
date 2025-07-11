import { apiService, ApiResponse } from './api';
import { 
  Ad, 
  CreateAdRequest, 
  UpdateAdRequest, 
  AdListParams, 
  AdListResponse, 
  AdInsightsParams, 
  AdPreviewParams 
} from '../types/ad.types';

export const adService = {
  // Create a new ad
  createAd: async (adData: CreateAdRequest): Promise<ApiResponse<Ad>> => {
    return apiService.post<Ad>('/api/ads', adData);
  },

  // Get ads with pagination and filtering
  getAds: async (params?: AdListParams): Promise<ApiResponse<AdListResponse>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.campaignId) searchParams.append('campaignId', params.campaignId);
    if (params?.adsetId) searchParams.append('adsetId', params.adsetId);
    if (params?.creativeId) searchParams.append('creativeId', params.creativeId);
    if (params?.fields) searchParams.append('fields', params.fields.join(','));

    const url = `/api/ads${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<AdListResponse>(url);
  },

  // Get ad by ID
  getAdById: async (adId: string): Promise<ApiResponse<Ad>> => {
    return apiService.get<Ad>(`/api/ads/${adId}`);
  },

  // Update ad
  updateAd: async (adId: string, adData: UpdateAdRequest): Promise<ApiResponse<Ad>> => {
    return apiService.put<Ad>(`/api/ads/${adId}`, adData);
  },

  // Delete ad
  deleteAd: async (adId: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`/api/ads/${adId}`);
  },

  // Activate ad
  activateAd: async (adId: string): Promise<ApiResponse<Ad>> => {
    return apiService.post<Ad>(`/api/ads/${adId}/activate`);
  },

  // Pause ad
  pauseAd: async (adId: string): Promise<ApiResponse<Ad>> => {
    return apiService.post<Ad>(`/api/ads/${adId}/pause`);
  },

  // Duplicate ad
  duplicateAd: async (adId: string): Promise<ApiResponse<Ad>> => {
    return apiService.post<Ad>(`/api/ads/${adId}/duplicate`);
  },

  // Get ad insights
  getAdInsights: async (adId: string, params?: AdInsightsParams): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.since) searchParams.append('since', params.since);
    if (params?.until) searchParams.append('until', params.until);

    const url = `/api/ads/${adId}/insights${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<any>(url);
  },

  // Get ad preview
  getAdPreview: async (adId: string, params?: AdPreviewParams): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.adFormat) searchParams.append('adFormat', params.adFormat);

    const url = `/api/ads/${adId}/preview${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<any>(url);
  },

  // Get ads by ad set
  getAdsByAdSet: async (adsetId: string): Promise<ApiResponse<Ad[]>> => {
    return apiService.get<Ad[]>(`/api/ads/adset/${adsetId}`);
  }
};

// Export types
export type { Ad, CreateAdRequest, UpdateAdRequest, AdListParams, AdListResponse };
