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
