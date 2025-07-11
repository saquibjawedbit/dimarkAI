import axios, { AxiosResponse } from 'axios';

export interface FacebookAPIConfig {
  accessToken: string;
  appId: string;
  appSecret: string;
  apiVersion: string;
}

export class FacebookMarketingAPI {
  private baseURL: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.baseURL = `https://graph.facebook.com/v23.0`; // Default API version, can be overridden in config
  }

  /**
   * Create a campaign on Facebook
   */
  async createCampaign(adAccountId: string, campaignData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}/campaigns`;
      
      // Prepare campaign payload
      const payload: any = {
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status || 'PAUSED',
        special_ad_categories: campaignData.specialAdCategories || [], // Required field
        access_token: this.accessToken,
      };

      // Add budget fields if provided
      if (campaignData.dailyBudget) {
        payload.daily_budget = Math.round(campaignData.dailyBudget * 100);
      }
      if (campaignData.lifetimeBudget) {
        payload.lifetime_budget = Math.round(campaignData.lifetimeBudget * 100);
      }

      // Add bid strategy and amount if provided
      if (campaignData.bidStrategy) {
        payload.bid_strategy = campaignData.bidStrategy;
      }
      if (campaignData.bidAmount) {
        payload.bid_amount = Math.round(campaignData.bidAmount * 100);
      }

      // Add time fields if provided
      if (campaignData.startTime) {
        payload.start_time = campaignData.startTime;
      }
      if (campaignData.endTime) {
        payload.stop_time = campaignData.endTime;
      }

      // Add targeting if provided
      if (campaignData.targetingSpec) {
        payload.targeting = campaignData.targetingSpec;
      }

      console.log('Facebook Campaign Creation Payload:', payload);

      const response: AxiosResponse = await axios.post(url, payload);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API Error:', error);
      if (error.response?.data) {
        console.error('Facebook API Error Details:', error.response.data);
      }
      throw new Error(`Failed to create Facebook campaign: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Update a campaign on Facebook
   */
  async updateCampaign(campaignId: string, updateData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/${campaignId}`;
      const updateParams: any = {
        access_token: this.accessToken,
      };

      if (updateData.name) updateParams.name = updateData.name;
      if (updateData.status) updateParams.status = updateData.status;
      if (updateData.dailyBudget) updateParams.daily_budget = Math.round(updateData.dailyBudget * 100);
      if (updateData.lifetimeBudget) updateParams.lifetime_budget = Math.round(updateData.lifetimeBudget * 100);
      if (updateData.bidStrategy) updateParams.bid_strategy = updateData.bidStrategy;
      if (updateData.bidAmount) updateParams.bid_amount = Math.round(updateData.bidAmount * 100);
      if (updateData.startTime) updateParams.start_time = updateData.startTime;
      if (updateData.endTime) updateParams.stop_time = updateData.endTime;
      if (updateData.targetingSpec) updateParams.targeting = updateData.targetingSpec;

      const response: AxiosResponse = await axios.post(url, updateParams);
      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to update Facebook campaign: ${error}`);
    }
  }

  /**
   * Delete a campaign on Facebook
   */
  async deleteCampaign(campaignId: string): Promise<any> {
    try {
      const url = `${this.baseURL}/${campaignId}`;
      const response: AxiosResponse = await axios.post(url, {
        status: 'DELETED',
        access_token: this.accessToken,
      });

      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to delete Facebook campaign: ${error}`);
    }
  }

  /**
   * Get campaigns from Facebook Ad Account
   */
  async getCampaigns(adAccountId: string, fields?: string[]): Promise<any> {
    try {
      const defaultFields = [
        'id',
        'name',
        'objective',
        'status',
        'daily_budget',
        'lifetime_budget',
        'bid_strategy',
        'bid_amount',
        'start_time',
        'stop_time',
        'targeting',
        'created_time',
        'updated_time'
      ];

      const url = `${this.baseURL}/act_${adAccountId}/campaigns`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          fields: (fields || defaultFields).join(','),
          access_token: this.accessToken,
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook campaigns: ${error}`);
    }
  }

  /**
   * Get campaign insights from Facebook
   */
  async getCampaignInsights(
    campaignId: string, 
    dateRange?: { start: string; end: string },
    fields?: string[]
  ): Promise<any> {
    try {
      const defaultFields = [
        'impressions',
        'clicks',
        'spend',
        'conversions',
        'ctr',
        'cpc',
        'cpm',
        'frequency',
        'reach'
      ];

      const url = `${this.baseURL}/${campaignId}/insights`;
      const params: any = {
        fields: (fields || defaultFields).join(','),
        access_token: this.accessToken,
      };

      if (dateRange) {
        params.time_range = JSON.stringify({
          since: dateRange.start,
          until: dateRange.end,
        });
      }

      const response: AxiosResponse = await axios.get(url, { params });
      return response.data.data[0] || {};
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook campaign insights: ${error}`);
    }
  }

  /**
   * Get Ad Account information
   */
  async getAdAccount(adAccountId: string): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          fields: 'id,name,account_id,currency,timezone_name,account_status,spend_cap,balance',
          access_token: this.accessToken,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook ad account: ${error}`);
    }
  }

  /**
   * Validate access token
   */
  async validateAccessToken(): Promise<boolean> {
    try {
      const url = `${this.baseURL}/me`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          access_token: this.accessToken,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Facebook API Error:', error);
      return false;
    }
  }

  /**
   * Get available targeting options
   */
  async getTargetingOptions(type: 'interests' | 'behaviors' | 'demographics'): Promise<any> {
    try {
      const url = `${this.baseURL}/search`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          type: 'adTargetingCategory',
          class: type,
          access_token: this.accessToken,
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch targeting options: ${error}`);
    }
  }

  /**
   * Create an ad set on Facebook
   */
  async createAdSet(adAccountId: string, adSetData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}/adsets`;
      
      // Validate required fields
      if (!adSetData.name || !adSetData.campaign_id || !adSetData.optimization_goal || 
          !adSetData.billing_event || !adSetData.targeting || !adSetData.start_time || 
          !adSetData.end_time) {
        throw new Error('Missing required fields for ad set creation: name, campaign_id, optimization_goal, billing_event, targeting, start_time, end_time');
      }

      // Validate budget (allow no budget if campaign has budget)
      if (!adSetData.daily_budget && !adSetData.lifetime_budget) {
        console.log('No budget specified for ad set - this is allowed if campaign has budget');
        // Don't throw error - this is valid when campaign has budget
      }

      if (adSetData.daily_budget && adSetData.lifetime_budget) {
        throw new Error('Cannot specify both daily_budget and lifetime_budget');
      }

      // Prepare clean payload
      const payload: any = {
        name: adSetData.name,
        campaign_id: adSetData.campaign_id,
        optimization_goal: adSetData.optimization_goal,
        billing_event: adSetData.billing_event,
        status: adSetData.status || 'PAUSED',
        targeting: adSetData.targeting,
        start_time: adSetData.start_time,
        end_time: adSetData.end_time,
        access_token: this.accessToken,
      };

      // Add budget
      if (adSetData.daily_budget) {
        payload.daily_budget = adSetData.daily_budget;
      } else if (adSetData.lifetime_budget) {
        payload.lifetime_budget = adSetData.lifetime_budget;
      }

      // Add bid strategy and amount based on strategy
      if (adSetData.bid_strategy) {
        payload.bid_strategy = adSetData.bid_strategy;
        
        // Validate bid amount based on strategy
        if (adSetData.bid_strategy === 'LOWEST_COST_WITHOUT_CAP') {
          // No bid amount should be set for this strategy
          if (adSetData.bid_amount && adSetData.bid_amount > 0) {
            throw new Error('Bid amount cannot be set with LOWEST_COST_WITHOUT_CAP strategy');
          }
          // Don't add bid_amount to payload at all for this strategy
        } else if (adSetData.bid_strategy === 'LOWEST_COST_WITH_BID_CAP' || 
                   adSetData.bid_strategy === 'COST_CAP') {
          // Bid amount is required for these strategies
          if (!adSetData.bid_amount || adSetData.bid_amount <= 0) {
            throw new Error(`Bid amount is required for bid strategy: ${adSetData.bid_strategy}`);
          }
          payload.bid_amount = adSetData.bid_amount;
        } else if (adSetData.bid_strategy === 'LOWEST_COST_WITH_MIN_ROAS') {
          // Bid amount is optional for this strategy
          if (adSetData.bid_amount && adSetData.bid_amount > 0) {
            payload.bid_amount = adSetData.bid_amount;
          }
        }
      } else {
        // Default to LOWEST_COST_WITHOUT_CAP if no strategy provided
        payload.bid_strategy = 'LOWEST_COST_WITHOUT_CAP';
        // Don't add bid_amount for default strategy
      }

      // Add promoted object if provided and valid
      if (adSetData.promoted_object && typeof adSetData.promoted_object === 'object') {
        payload.promoted_object = adSetData.promoted_object;
      }
      
      // Final safety check: remove bid_amount if strategy is LOWEST_COST_WITHOUT_CAP
      if (payload.bid_strategy === 'LOWEST_COST_WITHOUT_CAP' && 'bid_amount' in payload) {
        console.warn('WARNING: Removing bid_amount from payload for LOWEST_COST_WITHOUT_CAP strategy');
        delete payload.bid_amount;
      }
      

      const response: AxiosResponse = await axios.post(url, payload);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API createAdSet error:', error);
      if (error.response) {
        console.error('Facebook API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        throw new Error(`Facebook API Error: ${error.response.data?.error?.message || error.response.statusText}`);
      }
      throw new Error(`Failed to create Facebook ad set: ${error.message}`);
    }
  }

  /**
   * Update an ad set on Facebook
   */
  async updateAdSet(adSetId: string, updateData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/${adSetId}`;
      const updateParams: any = {
        access_token: this.accessToken,
      };

      if (updateData.name) updateParams.name = updateData.name;
      if (updateData.status) updateParams.status = updateData.status;
      if (updateData.optimization_goal) updateParams.optimization_goal = updateData.optimization_goal;
      if (updateData.billing_event) updateParams.billing_event = updateData.billing_event;
      if (updateData.bid_amount) updateParams.bid_amount = updateData.bid_amount;
      if (updateData.daily_budget) updateParams.daily_budget = updateData.daily_budget;
      if (updateData.lifetime_budget) updateParams.lifetime_budget = updateData.lifetime_budget;
      if (updateData.targeting) updateParams.targeting = updateData.targeting;
      if (updateData.promoted_object) updateParams.promoted_object = updateData.promoted_object;
      if (updateData.start_time) updateParams.start_time = updateData.start_time;
      if (updateData.end_time) updateParams.end_time = updateData.end_time;

      const response: AxiosResponse = await axios.post(url, updateParams);
      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to update Facebook ad set: ${error}`);
    }
  }

  /**
   * Delete an ad set on Facebook
   */
  async deleteAdSet(adSetId: string): Promise<any> {
    try {
      const url = `${this.baseURL}/${adSetId}`;
      const response: AxiosResponse = await axios.post(url, {
        status: 'DELETED',
        access_token: this.accessToken,
      });

      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to delete Facebook ad set: ${error}`);
    }
  }

  /**
   * Get ad sets from Facebook ad account (optionally filtered by campaign)
   */
  async getAdSets(adAccountId: string, campaignId?: string, fields?: string[]): Promise<any> {
    try {
      const defaultFields = [
        'id',
        'name',
        'campaign_id',
        'optimization_goal',
        'billing_event',
        'bid_amount',
        'daily_budget',
        'lifetime_budget',
        'status',
        'targeting',
        'promoted_object',
        'start_time',
        'end_time',
        'created_time',
        'updated_time'
      ];

      const url = `${this.baseURL}/act_${adAccountId}/adsets`;
      const params: any = {
        fields: (fields || defaultFields).join(','),
        access_token: this.accessToken,
      };

      // Filter by campaign if specified
      if (campaignId) {
        params.filtering = JSON.stringify([
          {
            field: 'campaign.id',
            operator: 'IN',
            value: [campaignId]
          }
        ]);
      }

      const response: AxiosResponse = await axios.get(url, { params });

      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook ad sets: ${error}`);
    }
  }

  /**
   * Get ad sets from Facebook campaign (alternative method)
   */
  async getAdSetsByCampaign(campaignId: string, fields?: string[]): Promise<any> {
    try {
      const defaultFields = [
        'id',
        'name',
        'campaign_id',
        'optimization_goal',
        'billing_event',
        'bid_amount',
        'daily_budget',
        'lifetime_budget',
        'status',
        'targeting',
        'promoted_object',
        'start_time',
        'end_time',
        'created_time',
        'updated_time'
      ];

      const url = `${this.baseURL}/${campaignId}/adsets`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          fields: (fields || defaultFields).join(','),
          access_token: this.accessToken,
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook ad sets by campaign: ${error}`);
    }
  }

  /**
   * Get ad set by ID from Facebook
   */
  async getAdSetById(adSetId: string, fields?: string[]): Promise<any> {
    try {
      const defaultFields = [
        'id',
        'name',
        'campaign_id',
        'optimization_goal',
        'billing_event',
        'bid_amount',
        'daily_budget',
        'lifetime_budget',
        'status',
        'targeting',
        'promoted_object',
        'start_time',
        'end_time',
        'created_time',
        'updated_time'
      ];

      const url = `${this.baseURL}/${adSetId}`;
      const response: AxiosResponse = await axios.get(url, {
        params: {
          fields: (fields || defaultFields).join(','),
          access_token: this.accessToken,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook ad set: ${error}`);
    }
  }

  /**
   * Get ad set insights from Facebook
   */
  async getAdSetInsights(
    adSetId: string, 
    dateRange?: { start: string; end: string },
    fields?: string[]
  ): Promise<any> {
    try {
      const defaultFields = [
        'impressions',
        'clicks',
        'spend',
        'conversions',
        'ctr',
        'cpc',
        'cpm',
        'frequency',
        'reach'
      ];

      const url = `${this.baseURL}/${adSetId}/insights`;
      const params: any = {
        fields: (fields || defaultFields).join(','),
        access_token: this.accessToken,
      };

      if (dateRange) {
        params.time_range = JSON.stringify({
          since: dateRange.start,
          until: dateRange.end,
        });
      }

      const response: AxiosResponse = await axios.get(url, { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw new Error(`Failed to fetch Facebook ad set insights: ${error}`);
    }
  }

  /**
   * Pause an ad set on Facebook
   */
  async pauseAdSet(adSetId: string): Promise<any> {
    return this.updateAdSet(adSetId, { status: 'PAUSED' });
  }

  /**
   * Activate an ad set on Facebook
   */
  async activateAdSet(adSetId: string): Promise<any> {
    return this.updateAdSet(adSetId, { status: 'ACTIVE' });
  }

  /**
   * Create a creative on Facebook
   */
  async createCreative(adAccountId: string, creativeData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}/adcreatives`;
      
      // Prepare creative payload
      const payload: any = {
        name: creativeData.name,
        access_token: this.accessToken,
      };

      // Add object_story_id if provided (for page post ads)
      if (creativeData.object_story_id) {
        payload.object_story_id = creativeData.object_story_id;
      }

      // Add object_story_spec if provided
      if (creativeData.object_story_spec) {
        payload.object_story_spec = JSON.stringify(creativeData.object_story_spec);
      }

      // Add asset_feed_spec if provided
      if (creativeData.asset_feed_spec) {
        payload.asset_feed_spec = JSON.stringify(creativeData.asset_feed_spec);
      }

      // Add template_url if provided
      if (creativeData.template_url) {
        payload.template_url = creativeData.template_url;
      }

      // Add url_tags if provided
      if (creativeData.url_tags) {
        payload.url_tags = creativeData.url_tags;
      }

      // Add degrees_of_freedom_spec if provided
      if (creativeData.degrees_of_freedom_spec) {
        payload.degrees_of_freedom_spec = JSON.stringify(creativeData.degrees_of_freedom_spec);
      }

      // Add status if provided
      if (creativeData.status) {
        payload.status = creativeData.status;
      }

      // Add optional fields
      if (creativeData.adlabels) {
        payload.adlabels = JSON.stringify(creativeData.adlabels);
      }
      if (creativeData.applink_treatment) {
        payload.applink_treatment = creativeData.applink_treatment;
      }
      if (creativeData.authorization_category) {
        payload.authorization_category = creativeData.authorization_category;
      }
      if (creativeData.auto_update !== undefined) {
        payload.auto_update = creativeData.auto_update;
      }
      if (creativeData.branded_content_sponsor_page_id) {
        payload.branded_content_sponsor_page_id = creativeData.branded_content_sponsor_page_id;
      }
      if (creativeData.bundle_folder_id) {
        payload.bundle_folder_id = creativeData.bundle_folder_id;
      }
      if (creativeData.call_to_action_type) {
        payload.call_to_action_type = creativeData.call_to_action_type;
      }
      if (creativeData.categorization_criteria) {
        payload.categorization_criteria = creativeData.categorization_criteria;
      }
      if (creativeData.category_media_source) {
        payload.category_media_source = creativeData.category_media_source;
      }
      if (creativeData.destination_set_id) {
        payload.destination_set_id = creativeData.destination_set_id;
      }
      if (creativeData.dynamic_ad_voice) {
        payload.dynamic_ad_voice = creativeData.dynamic_ad_voice;
      }
      if (creativeData.enable_direct_install !== undefined) {
        payload.enable_direct_install = creativeData.enable_direct_install;
      }
      if (creativeData.enable_launch_instant_app !== undefined) {
        payload.enable_launch_instant_app = creativeData.enable_launch_instant_app;
      }
      if (creativeData.image_crops) {
        payload.image_crops = JSON.stringify(creativeData.image_crops);
      }
      if (creativeData.image_hash) {
        payload.image_hash = creativeData.image_hash;
      }
      if (creativeData.image_url) {
        payload.image_url = creativeData.image_url;
      }
      if (creativeData.instagram_actor_id) {
        payload.instagram_actor_id = creativeData.instagram_actor_id;
      }
      if (creativeData.instagram_permalink_url) {
        payload.instagram_permalink_url = creativeData.instagram_permalink_url;
      }
      if (creativeData.instagram_story_id) {
        payload.instagram_story_id = creativeData.instagram_story_id;
      }
      if (creativeData.instagram_user_id) {
        payload.instagram_user_id = creativeData.instagram_user_id;
      }
      if (creativeData.interactive_components_spec) {
        payload.interactive_components_spec = JSON.stringify(creativeData.interactive_components_spec);
      }
      if (creativeData.link_deep_link_url) {
        payload.link_deep_link_url = creativeData.link_deep_link_url;
      }
      if (creativeData.link_destination_display_url) {
        payload.link_destination_display_url = creativeData.link_destination_display_url;
      }
      if (creativeData.link_og_id) {
        payload.link_og_id = creativeData.link_og_id;
      }
      if (creativeData.link_url) {
        payload.link_url = creativeData.link_url;
      }
      if (creativeData.messenger_sponsored_message) {
        payload.messenger_sponsored_message = creativeData.messenger_sponsored_message;
      }
      if (creativeData.modal_dialog !== undefined) {
        payload.modal_dialog = creativeData.modal_dialog;
      }
      if (creativeData.place_page_set_id) {
        payload.place_page_set_id = creativeData.place_page_set_id;
      }
      if (creativeData.platform_customizations) {
        payload.platform_customizations = JSON.stringify(creativeData.platform_customizations);
      }
      if (creativeData.playable_asset_id) {
        payload.playable_asset_id = creativeData.playable_asset_id;
      }
      if (creativeData.portrait_customizations) {
        payload.portrait_customizations = JSON.stringify(creativeData.portrait_customizations);
      }
      if (creativeData.product_set_id) {
        payload.product_set_id = creativeData.product_set_id;
      }
      if (creativeData.recommender_settings) {
        payload.recommender_settings = JSON.stringify(creativeData.recommender_settings);
      }
      if (creativeData.source_instagram_media_id) {
        payload.source_instagram_media_id = creativeData.source_instagram_media_id;
      }
      if (creativeData.thumbnail_url) {
        payload.thumbnail_url = creativeData.thumbnail_url;
      }
      if (creativeData.title) {
        payload.title = creativeData.title;
      }
      if (creativeData.use_page_actor_override !== undefined) {
        payload.use_page_actor_override = creativeData.use_page_actor_override;
      }
      if (creativeData.video_id) {
        payload.video_id = creativeData.video_id;
      }

      console.log('Creating Facebook creative with payload:', payload);

      const response: AxiosResponse = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Facebook creative created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API createCreative error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to create creative: ${error.message}`);
    }
  }

  /**
   * Get a creative from Facebook
   */
  async getCreative(creativeId: string, fields?: string[]): Promise<any> {
    try {
      const url = `${this.baseURL}/${creativeId}`;
      
      const params: any = {
        access_token: this.accessToken,
      };

      // Add fields if provided
      if (fields && fields.length > 0) {
        params.fields = fields.join(',');
      } else {
        // Default fields to retrieve
        params.fields = 'id,name,object_story_id,object_story_spec,asset_feed_spec,template_url,url_tags,degrees_of_freedom_spec,status,adlabels,applink_treatment,authorization_category,auto_update,branded_content_sponsor_page_id,bundle_folder_id,call_to_action_type,categorization_criteria,category_media_source,destination_set_id,dynamic_ad_voice,effective_authorization_category,effective_instagram_media_id,effective_instagram_story_id,enable_direct_install,enable_launch_instant_app,image_crops,image_hash,image_url,instagram_actor_id,instagram_permalink_url,instagram_story_id,instagram_user_id,interactive_components_spec,link_deep_link_url,link_destination_display_url,link_og_id,link_url,messenger_sponsored_message,modal_dialog,place_page_set_id,platform_customizations,playable_asset_id,portrait_customizations,product_set_id,recommender_settings,source_instagram_media_id,thumbnail_url,title,use_page_actor_override,video_id,created_time,updated_time';
      }

      console.log('Fetching Facebook creative:', creativeId);

      const response: AxiosResponse = await axios.get(url, { params });

      console.log('Facebook creative fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API getCreative error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to fetch creative: ${error.message}`);
    }
  }

  /**
   * Update a creative on Facebook
   */
  async updateCreative(creativeId: string, updateData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/${creativeId}`;
      
      const payload: any = {
        access_token: this.accessToken,
      };

      // Add updatable fields
      if (updateData.name) {
        payload.name = updateData.name;
      }
      if (updateData.status) {
        payload.status = updateData.status;
      }
      if (updateData.adlabels) {
        payload.adlabels = JSON.stringify(updateData.adlabels);
      }
      if (updateData.authorization_category) {
        payload.authorization_category = updateData.authorization_category;
      }
      if (updateData.categorization_criteria) {
        payload.categorization_criteria = updateData.categorization_criteria;
      }
      if (updateData.run_status) {
        payload.run_status = updateData.run_status;
      }

      console.log('Updating Facebook creative:', creativeId, 'with payload:', payload);

      const response: AxiosResponse = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Facebook creative updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API updateCreative error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to update creative: ${error.message}`);
    }
  }

  /**
   * Delete a creative from Facebook
   */
  async deleteCreative(creativeId: string): Promise<any> {
    try {
      const url = `${this.baseURL}/${creativeId}`;
      
      const payload = {
        access_token: this.accessToken,
      };

      console.log('Deleting Facebook creative:', creativeId);

      const response: AxiosResponse = await axios.delete(url, { data: payload });

      console.log('Facebook creative deleted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API deleteCreative error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to delete creative: ${error.message}`);
    }
  }

  /**
   * List creatives from Facebook ad account
   */
  async getCreatives(adAccountId: string, fields?: string[], limit?: number, after?: string): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}/adcreatives`;
      
      const params: any = {
        access_token: this.accessToken,
      };

      // Add fields if provided
      if (fields && fields.length > 0) {
        params.fields = fields.join(',');
      } else {
        // Default fields to retrieve
        params.fields = 'id,name,object_story_id,status,created_time,updated_time';
      }

      // Add pagination
      if (limit) {
        params.limit = limit;
      }
      if (after) {
        params.after = after;
      }

      console.log('Fetching Facebook creatives for account:', adAccountId);

      const response: AxiosResponse = await axios.get(url, { params });

      console.log(`Facebook creatives fetched successfully. Count: ${response.data.data?.length || 0}`);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API getCreatives error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to fetch creatives: ${error.message}`);
    }
  }

  /**
   * Generate creative preview
   */
  async generateCreativePreview(adAccountId: string, previewData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/act_${adAccountId}/generatepreviews`;
      
      const payload: any = {
        ad_format: previewData.ad_format,
        access_token: this.accessToken,
      };

      // Add creative_id or creative_spec
      if (previewData.creative_id) {
        payload.creative_id = previewData.creative_id;
      } else if (previewData.creative_spec) {
        payload.creative = JSON.stringify(previewData.creative_spec);
      }

      // Add optional fields
      if (previewData.product_item_ids) {
        payload.product_item_ids = JSON.stringify(previewData.product_item_ids);
      }
      if (previewData.place_page_id) {
        payload.place_page_id = previewData.place_page_id;
      }
      if (previewData.post_id) {
        payload.post_id = previewData.post_id;
      }
      if (previewData.end_date) {
        payload.end_date = previewData.end_date;
      }
      if (previewData.start_date) {
        payload.start_date = previewData.start_date;
      }
      if (previewData.interactive_components_spec) {
        payload.interactive_components_spec = JSON.stringify(previewData.interactive_components_spec);
      }
      if (previewData.locale) {
        payload.locale = previewData.locale;
      }
      if (previewData.dynamic_creative_spec) {
        payload.dynamic_creative_spec = JSON.stringify(previewData.dynamic_creative_spec);
      }
      if (previewData.dynamic_asset_spec) {
        payload.dynamic_asset_spec = JSON.stringify(previewData.dynamic_asset_spec);
      }

      console.log('Generating Facebook creative preview with payload:', payload);

      const response: AxiosResponse = await axios.get(url, { params: payload });

      console.log('Facebook creative preview generated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Facebook API generateCreativePreview error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to generate creative preview: ${error.message}`);
    }
  }

  /**
   * Get creative insights
   */
  async getCreativeInsights(creativeId: string, insightsParams: any): Promise<any> {
    try {
      const url = `${this.baseURL}/${creativeId}/insights`;
      
      const params: any = {
        access_token: this.accessToken,
      };

      // Add time range
      if (insightsParams.time_range) {
        params.time_range = JSON.stringify(insightsParams.time_range);
      }
      if (insightsParams.date_preset) {
        params.date_preset = insightsParams.date_preset;
      }

      // Add fields
      if (insightsParams.fields && insightsParams.fields.length > 0) {
        params.fields = insightsParams.fields.join(',');
      } else {
        // Default insight fields
        params.fields = 'impressions,clicks,spend,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type';
      }

      // Add filtering
      if (insightsParams.filtering) {
        params.filtering = JSON.stringify(insightsParams.filtering);
      }

      // Add breakdowns
      if (insightsParams.breakdowns) {
        params.breakdowns = insightsParams.breakdowns.join(',');
      }

      // Add sorting
      if (insightsParams.sort) {
        params.sort = insightsParams.sort.join(',');
      }

      // Add level
      if (insightsParams.level) {
        params.level = insightsParams.level;
      }

      // Add pagination
      if (insightsParams.limit) {
        params.limit = insightsParams.limit;
      }
      if (insightsParams.after) {
        params.after = insightsParams.after;
      }
      if (insightsParams.before) {
        params.before = insightsParams.before;
      }

      console.log('Fetching Facebook creative insights for:', creativeId);

      const response: AxiosResponse = await axios.get(url, { params });

      console.log(`Facebook creative insights fetched successfully. Count: ${response.data.data?.length || 0}`);
      return response.data;
    } catch (error: any) {
      console.error('Facebook API getCreativeInsights error:', error);
      if (error.response?.data?.error) {
        throw new Error(`Facebook API Error: ${error.response.data.error.message}`);
      }
      throw new Error(`Failed to fetch creative insights: ${error.message}`);
    }
  }
}

/**
 * Utility function to create Facebook API instance
 */
export function createFacebookAPI(accessToken: string): FacebookMarketingAPI {
  return new FacebookMarketingAPI(accessToken);
}

/**
 * Default Facebook API configuration from environment variables
 */
export function getDefaultFacebookConfig(): FacebookAPIConfig {
  return {
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    apiVersion: process.env.FACEBOOK_API_VERSION || 'v23.0',
  };
}
