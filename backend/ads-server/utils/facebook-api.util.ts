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

      // Validate budget
      if (!adSetData.daily_budget && !adSetData.lifetime_budget) {
        throw new Error('Either daily_budget or lifetime_budget must be specified');
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

      // Add bid amount if provided
      if (adSetData.bid_amount) {
        payload.bid_amount = adSetData.bid_amount;
      }

      // Add promoted object if provided and valid
      if (adSetData.promoted_object && typeof adSetData.promoted_object === 'object') {
        payload.promoted_object = adSetData.promoted_object;
      }

      console.log('Facebook API createAdSet URL:', url);
      console.log('Facebook API createAdSet payload:', JSON.stringify(payload, null, 2));

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
