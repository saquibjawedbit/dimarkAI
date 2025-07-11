import { apiService, ApiResponse } from './api';

export interface Creative {
  id: string;
  name: string;
  object_story_id?: string;
  object_story_spec?: any;
  asset_feed_spec?: any;
  template_url?: string;
  url_tags?: string;
  degrees_of_freedom_spec?: any;
  status: string;
  adlabels?: Array<{
    id: string;
    name: string;
  }>;
  applink_treatment?: string;
  authorization_category?: string;
  auto_update?: boolean;
  branded_content_sponsor_page_id?: string;
  bundle_folder_id?: string;
  call_to_action_type?: string;
  categorization_criteria?: string;
  category_media_source?: string;
  destination_set_id?: string;
  dynamic_ad_voice?: string;
  effective_authorization_category?: string;
  effective_instagram_media_id?: string;
  effective_instagram_story_id?: string;
  enable_direct_install?: boolean;
  enable_launch_instant_app?: boolean;
  image_crops?: any;
  image_hash?: string;
  image_url?: string;
  instagram_actor_id?: string;
  instagram_permalink_url?: string;
  instagram_story_id?: string;
  instagram_user_id?: string;
  interactive_components_spec?: any;
  link_deep_link_url?: string;
  link_destination_display_url?: string;
  link_og_id?: string;
  link_url?: string;
  messenger_sponsored_message?: string;
  modal_dialog?: boolean;
  place_page_set_id?: string;
  platform_customizations?: any;
  playable_asset_id?: string;
  portrait_customizations?: any;
  product_set_id?: string;
  recommender_settings?: any;
  source_instagram_media_id?: string;
  thumbnail_url?: string;
  title?: string;
  use_page_actor_override?: boolean;
  video_id?: string;
  created_time: string;
  updated_time: string;
}

export interface CreateCreativeRequest {
  name: string;
  // Object Story Creative
  object_story_id?: string;
  // Link Creative
  object_story_spec?: {
    page_id?: string;
    link_data?: {
      call_to_action?: {
        type: string;
        value?: {
          link?: string;
          application?: string;
        };
      };
      description?: string;
      image_hash?: string;
      image_url?: string;
      link?: string;
      message?: string;
      name?: string;
      video_id?: string;
    };
    video_data?: {
      call_to_action?: {
        type: string;
        value?: {
          link?: string;
          application?: string;
        };
      };
      description?: string;
      image_hash?: string;
      image_url?: string;
      message?: string;
      title?: string;
      video_id?: string;
    };
    photo_data?: {
      call_to_action?: {
        type: string;
        value?: {
          link?: string;
        };
      };
      description?: string;
      image_hash?: string;
      image_url?: string;
      message?: string;
      name?: string;
      url?: string;
    };
  };
  // Asset Feed Spec
  asset_feed_spec?: {
    ad_formats?: string[];
    call_to_action_types?: string[];
    link_urls?: Array<{
      website_url: string;
      display_url?: string;
    }>;
    descriptions?: string[];
    headlines?: string[];
    images?: Array<{
      hash: string;
      url?: string;
    }>;
    videos?: Array<{
      video_id: string;
      thumbnail_url?: string;
    }>;
    bodies?: string[];
    optimization_type?: string;
    carousels?: Array<{
      link_url: string;
      headline: string;
      description?: string;
      image_hash?: string;
      image_url?: string;
      video_id?: string;
    }>;
  };
  // Template-based Creative
  template_url?: string;
  url_tags?: string;
  // Status
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'PENDING_REVIEW' | 'DISAPPROVED' | 'PREAPPROVED';
  // Additional fields
  adlabels?: Array<{
    id: string;
    name: string;
  }>;
  applink_treatment?: string;
  authorization_category?: string;
  auto_update?: boolean;
  branded_content_sponsor_page_id?: string;
  bundle_folder_id?: string;
  call_to_action_type?: string;
  categorization_criteria?: string;
  category_media_source?: string;
  destination_set_id?: string;
  dynamic_ad_voice?: string;
  effective_authorization_category?: string;
  effective_instagram_media_id?: string;
  effective_instagram_story_id?: string;
  enable_direct_install?: boolean;
  enable_launch_instant_app?: boolean;
  image_crops?: any;
  image_hash?: string;
  image_url?: string;
  instagram_actor_id?: string;
  instagram_permalink_url?: string;
  instagram_story_id?: string;
  instagram_user_id?: string;
  interactive_components_spec?: any;
  link_deep_link_url?: string;
  link_destination_display_url?: string;
  link_og_id?: string;
  link_url?: string;
  messenger_sponsored_message?: string;
  modal_dialog?: boolean;
  place_page_set_id?: string;
  platform_customizations?: any;
  playable_asset_id?: string;
  portrait_customizations?: any;
  product_set_id?: string;
  recommender_settings?: any;
  source_instagram_media_id?: string;
  thumbnail_url?: string;
  title?: string;
  use_page_actor_override?: boolean;
  video_id?: string;
}

export interface UpdateCreativeRequest {
  name?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'PENDING_REVIEW' | 'DISAPPROVED' | 'PREAPPROVED';
  adlabels?: Array<{
    id: string;
    name: string;
  }>;
  authorization_category?: string;
  categorization_criteria?: string;
  run_status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'PENDING_REVIEW' | 'DISAPPROVED' | 'PREAPPROVED';
}

export interface CreativePreviewRequest {
  creative_id?: string;
  creative_spec?: CreateCreativeRequest;
  ad_format: string;
  product_item_ids?: string[];
  place_page_id?: string;
  post_id?: string;
  end_date?: string;
  start_date?: string;
  interactive_components_spec?: any;
  locale?: string;
  dynamic_creative_spec?: any;
  dynamic_asset_spec?: any;
}

export interface CreativeInsightsRequest {
  time_range?: {
    since: string;
    until: string;
  };
  date_preset?: string;
  fields?: string[];
  filtering?: Array<{
    field: string;
    operator: string;
    value: string | number | string[];
  }>;
  breakdowns?: string[];
  sort?: string[];
  level?: string;
  limit?: number;
  after?: string;
  before?: string;
}

export interface CreativeConstants {
  callToActionTypes: string[];
  adFormatTypes: string[];
  statusTypes: string[];
  authorizationCategories: string[];
  applinkTreatmentTypes: string[];
  dynamicAdVoiceTypes: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreativeListResponse {
  data: Creative[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
    previous?: string;
  };
}

export const creativeService = {
  // Get all creatives
  getCreatives: async (params?: {
    fields?: string[];
    limit?: number;
    after?: string;
  }): Promise<ApiResponse<CreativeListResponse>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.fields) {
      searchParams.append('fields', params.fields.join(','));
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.after) {
      searchParams.append('after', params.after);
    }

    const url = `/api/creatives${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<CreativeListResponse>(url);
  },

  // Get creative by ID
  getCreativeById: async (creativeId: string, fields?: string[]): Promise<ApiResponse<Creative>> => {
    const searchParams = new URLSearchParams();
    
    if (fields) {
      searchParams.append('fields', fields.join(','));
    }

    const url = `/api/creatives/${creativeId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<Creative>(url);
  },

  // Create new creative
  createCreative: async (creativeData: CreateCreativeRequest): Promise<ApiResponse<Creative>> => {
    return apiService.post<Creative>('/api/creatives', creativeData);
  },

  // Update creative
  updateCreative: async (creativeId: string, updateData: UpdateCreativeRequest): Promise<ApiResponse<Creative>> => {
    return apiService.put<Creative>(`/api/creatives/${creativeId}`, updateData);
  },

  // Delete creative
  deleteCreative: async (creativeId: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiService.delete(`/api/creatives/${creativeId}`);
  },

  // Search creatives
  searchCreatives: async (query: string, fields?: string[], limit?: number): Promise<ApiResponse<CreativeListResponse & { query: string; total_results: number }>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    
    if (fields) {
      searchParams.append('fields', fields.join(','));
    }
    if (limit) {
      searchParams.append('limit', limit.toString());
    }

    return apiService.get<CreativeListResponse & { query: string; total_results: number }>(`/api/creatives/search?${searchParams.toString()}`);
  },

  // Generate creative preview
  generateCreativePreview: async (previewData: CreativePreviewRequest): Promise<ApiResponse<{ body: string }>> => {
    return apiService.post<{ body: string }>('/api/creatives/preview', previewData);
  },

  // Get creative insights
  getCreativeInsights: async (creativeId: string, insightsParams: CreativeInsightsRequest): Promise<ApiResponse<any>> => {
    return apiService.post<any>(`/api/creatives/${creativeId}/insights`, insightsParams);
  },

  // Get creative with insights
  getCreativeWithInsights: async (creativeId: string, insightsParams?: CreativeInsightsRequest): Promise<ApiResponse<{ creative: Creative; insights: any }>> => {
    return apiService.post<{ creative: Creative; insights: any }>(`/api/creatives/${creativeId}/with-insights`, insightsParams || {});
  },

  // Get creative performance summary
  getCreativePerformanceSummary: async (creativeId: string, dateRange?: { since: string; until: string }): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams();
    
    if (dateRange) {
      searchParams.append('since', dateRange.since);
      searchParams.append('until', dateRange.until);
    }

    const url = `/api/creatives/${creativeId}/performance-summary${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiService.get<any>(url);
  },

  // Bulk update creatives
  bulkUpdateCreatives: async (updates: Array<{ creativeId: string; updateData: UpdateCreativeRequest }>): Promise<ApiResponse<any>> => {
    return apiService.post<any>('/api/creatives/bulk-update', { updates });
  },

  // Bulk delete creatives
  bulkDeleteCreatives: async (creativeIds: string[]): Promise<ApiResponse<any>> => {
    return apiService.post<any>('/api/creatives/bulk-delete', { creativeIds });
  },

  // Get creative constants
  getCreativeConstants: async (): Promise<ApiResponse<CreativeConstants>> => {
    return apiService.get<CreativeConstants>('/api/creatives/constants');
  },

  /**
   * Get user's available Facebook Pages
   */
  getUserPages: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiService.get('/api/creatives/pages');
      return response.data as ApiResponse<any[]>;
    } catch (error: any) {
      console.error('Error fetching user Facebook Pages:', error);
      throw error;
    }
  },
};
