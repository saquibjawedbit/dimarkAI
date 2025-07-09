import { Campaign, ICampaign } from '../../common/models/Campaign';
import { 
  CreateCampaignRequest, 
  UpdateCampaignRequest, 
  FacebookCampaignResponse,
  CampaignInsights,
  CampaignFilters,
  BulkCampaignOperation,
  PaginationParams,
  PaginatedResponse
} from '../../common/types';
import { FacebookMarketingAPI } from '../utils/facebook-api.util';
import { FacebookTokenCache } from '../../common/services/cache.service';

export class CampaignService {
  private facebookAPI: FacebookMarketingAPI | null = null;
  private facebookTokenCache: FacebookTokenCache;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.facebookTokenCache = new FacebookTokenCache();
  }

  /**
   * Initialize Facebook API with access token from Redis
   */
  private async initializeFacebookAPI(): Promise<void> {
    if (this.facebookAPI) {
      return; // Already initialized
    }

    const accessToken = await this.facebookTokenCache.getUserToken(this.userId);
    if (!accessToken) {
      throw new Error('Facebook access token not found for user. Please authenticate with Facebook first.');
    }

    this.facebookAPI = new FacebookMarketingAPI(accessToken);
  }

  /**
   * Ensure Facebook API is initialized before use
   */
  private async ensureFacebookAPI(): Promise<FacebookMarketingAPI> {
    await this.initializeFacebookAPI();
    if (!this.facebookAPI) {
      throw new Error('Failed to initialize Facebook API');
    }
    return this.facebookAPI;
  }
  
  /**
   * Create a new campaign
   */
  async createCampaign(userId: string, campaignData: CreateCampaignRequest): Promise<ICampaign> {
    try {
      // Validate required fields
      if (!campaignData.name || !campaignData.objective || !campaignData.facebookAdAccountId) {
        throw new Error('Name, objective, and Facebook ad account ID are required');
      }

      // Create campaign in database
      const campaign = new Campaign({
        userId,
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status || 'PAUSED',
        dailyBudget: campaignData.dailyBudget,
        lifetimeBudget: campaignData.lifetimeBudget,
        bidStrategy: campaignData.bidStrategy || 'LOWEST_COST_WITHOUT_CAP',
        bidAmount: campaignData.bidAmount,
        startTime: campaignData.startTime ? new Date(campaignData.startTime) : undefined,
        endTime: campaignData.endTime ? new Date(campaignData.endTime) : undefined,
        targetingSpec: campaignData.targetingSpec,
        facebookAdAccountId: campaignData.facebookAdAccountId,
      });

      const savedCampaign = await campaign.save();

      // Create campaign on Facebook (if needed)
      if (campaignData.status === 'ACTIVE') {
        try {
          const facebookCampaignId = await this.createFacebookCampaign(savedCampaign);
          savedCampaign.facebookCampaignId = facebookCampaignId;
          await savedCampaign.save();
        } catch (error) {
          console.error('Failed to create Facebook campaign:', error);
          // Keep the local campaign but mark as paused
          savedCampaign.status = 'PAUSED';
          await savedCampaign.save();
        }
      }

      return savedCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Get campaigns with filtering and pagination
   */
  async getCampaigns(
    userId: string, 
    filters: CampaignFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<ICampaign>> {
    try {
      const query: any = { userId };

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.objective) {
        query.objective = filters.objective;
      }
      if (filters.facebookAdAccountId) {
        query.facebookAdAccountId = filters.facebookAdAccountId;
      }
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      // Calculate pagination
      const skip = (pagination.page - 1) * pagination.limit;
      const sortField = pagination.sortBy || 'createdAt';
      const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1;

      // Execute query
      const [campaigns, total] = await Promise.all([
        Campaign.find(query)
          .sort({ [sortField]: sortOrder })
          .skip(skip)
          .limit(pagination.limit)
          .exec(),
        Campaign.countDocuments(query)
      ]);

      return {
        data: campaigns,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(userId: string, campaignId: string): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findOne({ _id: campaignId, userId });
      return campaign;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(userId: string, campaignId: string, updateData: UpdateCampaignRequest): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findOne({ _id: campaignId, userId });
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Prepare update object
      const updateObj: any = {};
      
      if (updateData.name !== undefined) updateObj.name = updateData.name;
      if (updateData.status !== undefined) updateObj.status = updateData.status;
      if (updateData.dailyBudget !== undefined) updateObj.dailyBudget = updateData.dailyBudget;
      if (updateData.lifetimeBudget !== undefined) updateObj.lifetimeBudget = updateData.lifetimeBudget;
      if (updateData.bidStrategy !== undefined) updateObj.bidStrategy = updateData.bidStrategy;
      if (updateData.bidAmount !== undefined) updateObj.bidAmount = updateData.bidAmount;
      if (updateData.startTime !== undefined) updateObj.startTime = new Date(updateData.startTime);
      if (updateData.endTime !== undefined) updateObj.endTime = new Date(updateData.endTime);
      if (updateData.targetingSpec !== undefined) updateObj.targetingSpec = updateData.targetingSpec;

      // Update in database
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { $set: updateObj },
        { new: true, runValidators: true }
      );

      // Update on Facebook if it exists
      if (updatedCampaign?.facebookCampaignId) {
        try {
          await this.updateFacebookCampaign(updatedCampaign.facebookCampaignId, updateData);
        } catch (error) {
          console.error('Failed to update Facebook campaign:', error);
          // Don't fail the entire operation if Facebook update fails
        }
      }

      return updatedCampaign;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(userId: string, campaignId: string): Promise<boolean> {
    try {
      const campaign = await Campaign.findOne({ _id: campaignId, userId });
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Delete from Facebook first (if exists)
      if (campaign.facebookCampaignId) {
        try {
          await this.deleteFacebookCampaign(campaign.facebookCampaignId);
        } catch (error) {
          console.error('Failed to delete Facebook campaign:', error);
          // Continue with local deletion even if Facebook deletion fails
        }
      }

      // Delete from database
      await Campaign.findByIdAndDelete(campaignId);
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  /**
   * Bulk operations on campaigns
   */
  async bulkOperation(userId: string, operation: BulkCampaignOperation): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const campaignId of operation.campaignIds) {
      try {
        switch (operation.operation) {
          case 'pause':
            await this.updateCampaign(userId, campaignId, { status: 'PAUSED' });
            break;
          case 'activate':
            await this.updateCampaign(userId, campaignId, { status: 'ACTIVE' });
            break;
          case 'archive':
            await this.updateCampaign(userId, campaignId, { status: 'ARCHIVED' });
            break;
          case 'delete':
            await this.deleteCampaign(userId, campaignId);
            break;
        }
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Campaign ${campaignId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  /**
   * Get campaign insights/performance data
   */
  async getCampaignInsights(userId: string, campaignId: string, dateRange?: { start: string; end: string }): Promise<CampaignInsights> {
    try {
      const campaign = await Campaign.findOne({ _id: campaignId, userId });
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // If Facebook campaign exists, fetch real insights
      if (campaign.facebookCampaignId) {
        try {
          return await this.getFacebookCampaignInsights(campaign.facebookCampaignId, dateRange);
        } catch (error) {
          console.error('Failed to fetch Facebook insights:', error);
        }
      }

      // Return stored metrics as fallback
      return {
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        spend: campaign.spend,
        conversions: campaign.conversions,
        ctr: campaign.ctr,
        cpc: campaign.cpc,
        cpm: campaign.cpm,
        roas: campaign.roas,
        frequency: campaign.frequency,
        reach: campaign.reach,
      };
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      throw error;
    }
  }

  /**
   * Sync campaigns with Facebook
   */
  async syncWithFacebook(userId: string, facebookAdAccountId: string): Promise<{ synced: number; errors: string[] }> {
    try {
      const facebookCampaigns = await this.getFacebookCampaigns(facebookAdAccountId);
      const results = { synced: 0, errors: [] as string[] };

      for (const fbCampaign of facebookCampaigns) {
        try {
          // Check if campaign already exists
          let campaign = await Campaign.findOne({ 
            facebookCampaignId: fbCampaign.id,
            userId 
          });

          if (!campaign) {
            // Create new campaign
            campaign = new Campaign({
              userId,
              name: fbCampaign.name,
              objective: this.mapFacebookObjective(fbCampaign.objective),
              status: this.mapFacebookStatus(fbCampaign.status),
              dailyBudget: fbCampaign.daily_budget ? parseFloat(fbCampaign.daily_budget) / 100 : undefined,
              lifetimeBudget: fbCampaign.lifetime_budget ? parseFloat(fbCampaign.lifetime_budget) / 100 : undefined,
              facebookCampaignId: fbCampaign.id,
              facebookAdAccountId,
            });
          } else {
            // Update existing campaign
            campaign.name = fbCampaign.name;
            campaign.objective = this.mapFacebookObjective(fbCampaign.objective);
            campaign.status = this.mapFacebookStatus(fbCampaign.status);
            if (fbCampaign.daily_budget) campaign.dailyBudget = parseFloat(fbCampaign.daily_budget) / 100;
            if (fbCampaign.lifetime_budget) campaign.lifetimeBudget = parseFloat(fbCampaign.lifetime_budget) / 100;
          }

          await campaign.save();
          results.synced++;
        } catch (error) {
          results.errors.push(`Campaign ${fbCampaign.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error syncing with Facebook:', error);
      throw error;
    }
  }

  // Private helper methods for Facebook API integration

  private async createFacebookCampaign(campaign: ICampaign): Promise<string> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const adAccountId = campaign.facebookAdAccountId.replace('act_', '');
      const facebookResponse = await facebookAPI.createCampaign(adAccountId, {
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        dailyBudget: campaign.dailyBudget,
        lifetimeBudget: campaign.lifetimeBudget,
        bidStrategy: campaign.bidStrategy,
        bidAmount: campaign.bidAmount,
        startTime: campaign.startTime?.toISOString(),
        endTime: campaign.endTime?.toISOString(),
        targetingSpec: campaign.targetingSpec,
      });
      
      return facebookResponse.id;
    } catch (error) {
      console.error('Failed to create Facebook campaign:', error);
      throw error;
    }
  }

  private async updateFacebookCampaign(facebookCampaignId: string, updateData: UpdateCampaignRequest): Promise<void> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      await facebookAPI.updateCampaign(facebookCampaignId, updateData);
    } catch (error) {
      console.error('Failed to update Facebook campaign:', error);
      throw error;
    }
  }

  private async deleteFacebookCampaign(facebookCampaignId: string): Promise<void> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      await facebookAPI.deleteCampaign(facebookCampaignId);
    } catch (error) {
      console.error('Failed to delete Facebook campaign:', error);
      throw error;
    }
  }

  private async getFacebookCampaignInsights(facebookCampaignId: string, dateRange?: { start: string; end: string }): Promise<CampaignInsights> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const insights = await facebookAPI.getCampaignInsights(facebookCampaignId, dateRange);
      
      return {
        impressions: parseInt(insights.impressions || '0'),
        clicks: parseInt(insights.clicks || '0'),
        spend: parseFloat(insights.spend || '0'),
        conversions: parseInt(insights.conversions || '0'),
        ctr: parseFloat(insights.ctr || '0'),
        cpc: parseFloat(insights.cpc || '0'),
        cpm: parseFloat(insights.cpm || '0'),
        roas: insights.return_on_ad_spend ? parseFloat(insights.return_on_ad_spend) : 0,
        frequency: parseFloat(insights.frequency || '0'),
        reach: parseInt(insights.reach || '0'),
      };
    } catch (error) {
      console.error('Failed to fetch Facebook campaign insights:', error);
      // Return default values on error
      return {
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0,
        frequency: 0,
        reach: 0,
      };
    }
  }

  private async getFacebookCampaigns(facebookAdAccountId: string): Promise<FacebookCampaignResponse[]> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const adAccountId = facebookAdAccountId.replace('act_', '');
      const campaigns = await facebookAPI.getCampaigns(adAccountId);
      
      return campaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        daily_budget: campaign.daily_budget,
        lifetime_budget: campaign.lifetime_budget,
        bid_strategy: campaign.bid_strategy,
        bid_amount: campaign.bid_amount,
        start_time: campaign.start_time,
        stop_time: campaign.stop_time,
        targeting: campaign.targeting,
        created_time: campaign.created_time,
        updated_time: campaign.updated_time,
      }));
    } catch (error) {
      console.error('Failed to fetch Facebook campaigns:', error);
      return [];
    }
  }

  private mapFacebookStatus(fbStatus: string): 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' {
    switch (fbStatus.toUpperCase()) {
      case 'ACTIVE':
        return 'ACTIVE';
      case 'PAUSED':
        return 'PAUSED';
      case 'DELETED':
        return 'DELETED';
      case 'ARCHIVED':
        return 'ARCHIVED';
      default:
        return 'PAUSED';
    }
  }

  private mapFacebookObjective(fbObjective: string): 'AWARENESS' | 'TRAFFIC' | 'ENGAGEMENT' | 'LEADS' | 'APP_INSTALLS' | 'SALES' | 'LINK_CLICKS' | 'POST_ENGAGEMENT' | 'PAGE_LIKES' | 'EVENT_RESPONSES' | 'MESSAGES' | 'CONVERSIONS' | 'CATALOG_SALES' | 'STORE_TRAFFIC' {
    // Map Facebook objectives to our internal objectives
    switch (fbObjective.toUpperCase()) {
      case 'BRAND_AWARENESS':
      case 'REACH':
        return 'AWARENESS';
      case 'TRAFFIC':
      case 'LINK_CLICKS':
        return 'LINK_CLICKS';
      case 'ENGAGEMENT':
      case 'POST_ENGAGEMENT':
        return 'POST_ENGAGEMENT';
      case 'LEAD_GENERATION':
        return 'LEADS';
      case 'APP_INSTALLS':
        return 'APP_INSTALLS';
      case 'CONVERSIONS':
        return 'CONVERSIONS';
      case 'CATALOG_SALES':
        return 'CATALOG_SALES';
      case 'STORE_TRAFFIC':
        return 'STORE_TRAFFIC';
      case 'PAGE_LIKES':
        return 'PAGE_LIKES';
      case 'EVENT_RESPONSES':
        return 'EVENT_RESPONSES';
      case 'MESSAGES':
        return 'MESSAGES';
      default:
        return 'TRAFFIC'; // Default fallback
    }
  }
}