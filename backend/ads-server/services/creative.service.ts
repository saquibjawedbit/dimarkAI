import { CreateCreativeRequest, UpdateCreativeRequest, CreativeResponse, CreativePreviewRequest, CreativeInsightsRequest } from '../../common/types';
import { FacebookMarketingAPI } from '../utils/facebook-api.util';
import { FacebookTokenCache } from '../../common/services/cache.service';
import { User } from '../../common/models/User';

export class CreativeService {
  private facebookAPI: FacebookMarketingAPI | null = null;
  private facebookTokenCache: FacebookTokenCache;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.facebookTokenCache = new FacebookTokenCache();
  }

  private async initializeFacebookAPI(): Promise<void> {
    if (this.facebookAPI) return;
    const accessToken = await this.facebookTokenCache.getUserToken(this.userId);
    if (!accessToken) throw new Error('Facebook access token not found for user.');
    this.facebookAPI = new FacebookMarketingAPI(accessToken);
  }

  private async ensureFacebookAPI(): Promise<FacebookMarketingAPI> {
    await this.initializeFacebookAPI();
    if (!this.facebookAPI) throw new Error('Failed to initialize Facebook API');
    return this.facebookAPI;
  }

  private async getUserAdsAccountId(): Promise<string> {
    const user = await User.findById(this.userId);
    if (!user) throw new Error('User not found');
    if (!user.adsAccountId) throw new Error('Facebook Ads Account ID not configured for user');
    return user.adsAccountId;
  }

  /**
   * Create a new creative
   */
  async createCreative(creativeData: CreateCreativeRequest): Promise<CreativeResponse> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const adAccountId = await this.getUserAdsAccountId();

      // Validate required fields
      if (!creativeData.name) {
        throw new Error('Creative name is required');
      }

      // Validate that at least one creative type is specified
      if (!creativeData.object_story_id && !creativeData.object_story_spec && !creativeData.asset_feed_spec && !creativeData.template_url) {
        throw new Error('At least one creative type must be specified: object_story_id, object_story_spec, asset_feed_spec, or template_url');
      }

      // Create creative on Facebook
      const facebookCreative = await facebookAPI.createCreative(adAccountId, creativeData);
      
      // Get the full creative data
      const creativeResponse = await facebookAPI.getCreative(facebookCreative.id);
      
      console.log('Creative created successfully:', creativeResponse.id);
      return creativeResponse;
    } catch (error: any) {
      console.error('CreativeService createCreative error:', error);
      throw new Error(`Failed to create creative: ${error.message}`);
    }
  }

  /**
   * Get a creative by ID
   */
  async getCreative(creativeId: string, fields?: string[]): Promise<CreativeResponse> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      
      const creative = await facebookAPI.getCreative(creativeId, fields);
      
      console.log('Creative fetched successfully:', creativeId);
      return creative;
    } catch (error: any) {
      console.error('CreativeService getCreative error:', error);
      throw new Error(`Failed to fetch creative: ${error.message}`);
    }
  }

  /**
   * Update a creative
   */
  async updateCreative(creativeId: string, updateData: UpdateCreativeRequest): Promise<CreativeResponse> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      
      // Update creative on Facebook
      await facebookAPI.updateCreative(creativeId, updateData);
      
      // Get the updated creative data
      const updatedCreative = await facebookAPI.getCreative(creativeId);
      
      console.log('Creative updated successfully:', creativeId);
      return updatedCreative;
    } catch (error: any) {
      console.error('CreativeService updateCreative error:', error);
      throw new Error(`Failed to update creative: ${error.message}`);
    }
  }

  /**
   * Delete a creative
   */
  async deleteCreative(creativeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      
      // Delete creative from Facebook
      await facebookAPI.deleteCreative(creativeId);
      
      console.log('Creative deleted successfully:', creativeId);
      return { success: true, message: 'Creative deleted successfully' };
    } catch (error: any) {
      console.error('CreativeService deleteCreative error:', error);
      throw new Error(`Failed to delete creative: ${error.message}`);
    }
  }

  /**
   * List all creatives for the user's ad account
   */
  async getCreatives(fields?: string[], limit?: number, after?: string): Promise<any> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const adAccountId = await this.getUserAdsAccountId();
      
      const creatives = await facebookAPI.getCreatives(adAccountId, fields, limit, after);
      
      console.log(`Creatives fetched successfully. Count: ${creatives.data?.length || 0}`);
      return creatives;
    } catch (error: any) {
      console.error('CreativeService getCreatives error:', error);
      throw new Error(`Failed to fetch creatives: ${error.message}`);
    }
  }

  /**
   * Generate creative preview
   */
  async generateCreativePreview(previewData: CreativePreviewRequest): Promise<any> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const adAccountId = await this.getUserAdsAccountId();
      
      // Validate required fields
      if (!previewData.ad_format) {
        throw new Error('Ad format is required for preview generation');
      }

      if (!previewData.creative_id && !previewData.creative_spec) {
        throw new Error('Either creative_id or creative_spec must be provided for preview generation');
      }

      const preview = await facebookAPI.generateCreativePreview(adAccountId, previewData);
      
      console.log('Creative preview generated successfully');
      return preview;
    } catch (error: any) {
      console.error('CreativeService generateCreativePreview error:', error);
      throw new Error(`Failed to generate creative preview: ${error.message}`);
    }
  }

  /**
   * Get creative insights
   */
  async getCreativeInsights(creativeId: string, insightsParams: CreativeInsightsRequest): Promise<any> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      
      const insights = await facebookAPI.getCreativeInsights(creativeId, insightsParams);
      
      console.log(`Creative insights fetched successfully. Count: ${insights.data?.length || 0}`);
      return insights;
    } catch (error: any) {
      console.error('CreativeService getCreativeInsights error:', error);
      throw new Error(`Failed to fetch creative insights: ${error.message}`);
    }
  }

  /**
   * Get creative with insights
   */
  async getCreativeWithInsights(creativeId: string, insightsParams?: CreativeInsightsRequest): Promise<any> {
    try {
      const [creative, insights] = await Promise.all([
        this.getCreative(creativeId),
        insightsParams ? this.getCreativeInsights(creativeId, insightsParams) : Promise.resolve(null)
      ]);
      
      return {
        creative,
        insights: insights?.data || null
      };
    } catch (error: any) {
      console.error('CreativeService getCreativeWithInsights error:', error);
      throw new Error(`Failed to fetch creative with insights: ${error.message}`);
    }
  }

  /**
   * Bulk operations for creatives
   */
  async bulkUpdateCreatives(updates: Array<{ creativeId: string; updateData: UpdateCreativeRequest }>): Promise<any> {
    try {
      const results = await Promise.allSettled(
        updates.map(({ creativeId, updateData }) => 
          this.updateCreative(creativeId, updateData)
        )
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`Bulk update completed: ${successful} successful, ${failed} failed`);
      
      return {
        successful,
        failed,
        results: results.map((result, index) => ({
          creativeId: updates[index].creativeId,
          status: result.status,
          data: result.status === 'fulfilled' ? result.value : undefined,
          error: result.status === 'rejected' ? result.reason.message : undefined
        }))
      };
    } catch (error: any) {
      console.error('CreativeService bulkUpdateCreatives error:', error);
      throw new Error(`Failed to perform bulk update: ${error.message}`);
    }
  }

  /**
   * Bulk delete creatives
   */
  async bulkDeleteCreatives(creativeIds: string[]): Promise<any> {
    try {
      const results = await Promise.allSettled(
        creativeIds.map(creativeId => this.deleteCreative(creativeId))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`Bulk delete completed: ${successful} successful, ${failed} failed`);
      
      return {
        successful,
        failed,
        results: results.map((result, index) => ({
          creativeId: creativeIds[index],
          status: result.status,
          data: result.status === 'fulfilled' ? result.value : undefined,
          error: result.status === 'rejected' ? result.reason.message : undefined
        }))
      };
    } catch (error: any) {
      console.error('CreativeService bulkDeleteCreatives error:', error);
      throw new Error(`Failed to perform bulk delete: ${error.message}`);
    }
  }

  /**
   * Search creatives by name
   */
  async searchCreatives(query: string, fields?: string[], limit?: number): Promise<any> {
    try {
      const creatives = await this.getCreatives(fields, limit);
      
      // Filter creatives by name (case-insensitive)
      const filteredCreatives = creatives.data?.filter((creative: any) => 
        creative.name?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return {
        data: filteredCreatives,
        paging: creatives.paging,
        query,
        total_results: filteredCreatives.length
      };
    } catch (error: any) {
      console.error('CreativeService searchCreatives error:', error);
      throw new Error(`Failed to search creatives: ${error.message}`);
    }
  }

  /**
   * Get creative performance summary
   */
  async getCreativePerformanceSummary(creativeId: string, dateRange?: { since: string; until: string }): Promise<any> {
    try {
      const insightsParams: CreativeInsightsRequest = {
        fields: ['impressions', 'clicks', 'spend', 'ctr', 'cpc', 'cpm', 'reach', 'frequency', 'actions', 'cost_per_action_type'],
        time_range: dateRange || {
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          until: new Date().toISOString().split('T')[0] // Today
        }
      };
      
      const [creative, insights] = await Promise.all([
        this.getCreative(creativeId, ['id', 'name', 'status', 'created_time']),
        this.getCreativeInsights(creativeId, insightsParams)
      ]);
      
      // Calculate summary metrics
      const summary = insights.data?.reduce((acc: any, insight: any) => {
        acc.impressions += parseInt(insight.impressions || '0');
        acc.clicks += parseInt(insight.clicks || '0');
        acc.spend += parseFloat(insight.spend || '0');
        acc.reach += parseInt(insight.reach || '0');
        return acc;
      }, {
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0
      });
      
      if (summary && summary.impressions > 0) {
        summary.ctr = (summary.clicks / summary.impressions * 100).toFixed(2);
        summary.cpc = summary.clicks > 0 ? (summary.spend / summary.clicks).toFixed(2) : '0.00';
        summary.cpm = (summary.spend / summary.impressions * 1000).toFixed(2);
      }
      
      return {
        creative: creative,
        summary: summary,
        insights: insights.data
      };
    } catch (error: any) {
      console.error('CreativeService getCreativePerformanceSummary error:', error);
      throw new Error(`Failed to get creative performance summary: ${error.message}`);
    }
  }
}
