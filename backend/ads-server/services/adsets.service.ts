import { AdSet, IAdSet } from '../../common/models/AdSet';
import { CreateAdSetRequest, UpdateAdSetRequest } from '../../common/types';
import { FacebookMarketingAPI } from '../utils/facebook-api.util';
import { FacebookTokenCache } from '../../common/services/cache.service';

export class AdSetService {
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

  async createAdSet(userId: string, adSetData: CreateAdSetRequest & { facebookAdAccountId: string }): Promise<IAdSet> {
    try {
      // Save to local database first
      const adSet = new AdSet({ ...adSetData, userId });
      await adSet.save();

      // Create ad set on Facebook
      try {
        const facebookAPI = await this.ensureFacebookAPI();
        const facebookAdSet = await facebookAPI.createAdSet(adSetData.facebookAdAccountId, {
          campaign_id: adSetData.campaignId,
          name: adSetData.name,
          optimization_goal: adSetData.optimizationGoal,
          billing_event: adSetData.billingEvent,
          bid_amount: Math.round(adSetData.bidAmount * 100), // Convert to cents
          daily_budget: adSetData.dailyBudget ? Math.round(adSetData.dailyBudget * 100) : undefined,
          lifetime_budget: adSetData.lifetimeBudget ? Math.round(adSetData.lifetimeBudget * 100) : undefined,
          status: adSetData.status || 'PAUSED',
          targeting: typeof adSetData.targeting === 'string' ? JSON.parse(adSetData.targeting) : adSetData.targeting,
          promoted_object: adSetData.promotedObject ? 
            (typeof adSetData.promotedObject === 'string' ? JSON.parse(adSetData.promotedObject) : adSetData.promotedObject) : 
            undefined,
          start_time: adSetData.startTime,
          end_time: adSetData.endTime,
        });

        // Update local record with Facebook ID
        adSet.facebookAdSetId = facebookAdSet.id;
        await adSet.save();
      } catch (facebookError) {
        console.error('Facebook API Error while creating ad set:', facebookError);
        // Don't throw error - keep local record even if Facebook creation fails
      }

      return adSet;
    } catch (error) {
      console.error('Error creating ad set:', error);
      throw error;
    }
  }

  async getAdSetsByCampaign(campaignId: string): Promise<IAdSet[]> {
    try {
      // Get local ad sets
      const localAdSets = await AdSet.find({ campaignId });

      // Optionally sync with Facebook
      try {
        const facebookAPI = await this.ensureFacebookAPI();
        const facebookAdSets = await facebookAPI.getAdSets(campaignId);
        
        // You could implement sync logic here to update local records with Facebook data
        // For now, just return local records
      } catch (facebookError) {
        console.error('Facebook API Error while fetching ad sets:', facebookError);
        // Continue with local data
      }

      return localAdSets;
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      throw error;
    }
  }

  async getAdSetById(adSetId: string): Promise<IAdSet | null> {
    try {
      const adSet = await AdSet.findById(adSetId);
      
      // Optionally fetch fresh data from Facebook
      if (adSet?.facebookAdSetId) {
        try {
          const facebookAPI = await this.ensureFacebookAPI();
          const facebookAdSet = await facebookAPI.getAdSetById(adSet.facebookAdSetId);
          
          // You could update local record with Facebook data here
          // For now, just return local record
        } catch (facebookError) {
          console.error('Facebook API Error while fetching ad set:', facebookError);
          // Continue with local data
        }
      }

      return adSet;
    } catch (error) {
      console.error('Error fetching ad set:', error);
      throw error;
    }
  }

  async updateAdSet(adSetId: string, update: UpdateAdSetRequest): Promise<IAdSet | null> {
    try {
      // Update local record
      const adSet = await AdSet.findByIdAndUpdate(adSetId, update, { new: true });
      
      if (!adSet) return null;

      // Update on Facebook if ad set exists there
      if (adSet.facebookAdSetId) {
        try {
          const facebookAPI = await this.ensureFacebookAPI();
          
          // Prepare Facebook update data
          const facebookUpdateData: any = {};
          if (update.name) facebookUpdateData.name = update.name;
          if (update.status) facebookUpdateData.status = update.status;
          if (update.optimizationGoal) facebookUpdateData.optimization_goal = update.optimizationGoal;
          if (update.billingEvent) facebookUpdateData.billing_event = update.billingEvent;
          if (update.bidAmount) facebookUpdateData.bid_amount = Math.round(update.bidAmount * 100);
          if (update.dailyBudget) facebookUpdateData.daily_budget = Math.round(update.dailyBudget * 100);
          if (update.lifetimeBudget) facebookUpdateData.lifetime_budget = Math.round(update.lifetimeBudget * 100);
          if (update.targeting) facebookUpdateData.targeting = typeof update.targeting === 'string' ? JSON.parse(update.targeting) : update.targeting;
          if (update.promotedObject) facebookUpdateData.promoted_object = typeof update.promotedObject === 'string' ? JSON.parse(update.promotedObject) : update.promotedObject;
          if (update.startTime) facebookUpdateData.start_time = update.startTime;
          if (update.endTime) facebookUpdateData.end_time = update.endTime;

          await facebookAPI.updateAdSet(adSet.facebookAdSetId, facebookUpdateData);
        } catch (facebookError) {
          console.error('Facebook API Error while updating ad set:', facebookError);
          // Don't throw error - local update succeeded
        }
      }

      return adSet;
    } catch (error) {
      console.error('Error updating ad set:', error);
      throw error;
    }
  }

  async deleteAdSet(adSetId: string): Promise<void> {
    try {
      const adSet = await AdSet.findById(adSetId);
      
      if (!adSet) {
        throw new Error('Ad set not found');
      }

      // Delete from Facebook if it exists there
      if (adSet.facebookAdSetId) {
        try {
          const facebookAPI = await this.ensureFacebookAPI();
          await facebookAPI.deleteAdSet(adSet.facebookAdSetId);
        } catch (facebookError) {
          console.error('Facebook API Error while deleting ad set:', facebookError);
          // Continue with local deletion even if Facebook deletion fails
        }
      }

      // Delete local record
      await AdSet.findByIdAndDelete(adSetId);
    } catch (error) {
      console.error('Error deleting ad set:', error);
      throw error;
    }
  }

  /**
   * Pause an ad set
   */
  async pauseAdSet(adSetId: string): Promise<IAdSet | null> {
    return this.updateAdSet(adSetId, { status: 'PAUSED' });
  }

  /**
   * Activate an ad set
   */
  async activateAdSet(adSetId: string): Promise<IAdSet | null> {
    return this.updateAdSet(adSetId, { status: 'ACTIVE' });
  }

  /**
   * Get ad set insights/performance data
   */
  async getAdSetInsights(
    adSetId: string, 
    dateRange?: { start: string; end: string }
  ): Promise<any> {
    try {
      const adSet = await AdSet.findById(adSetId);
      
      if (!adSet || !adSet.facebookAdSetId) {
        throw new Error('Ad set not found or not linked to Facebook');
      }

      const facebookAPI = await this.ensureFacebookAPI();
      return await facebookAPI.getAdSetInsights(adSet.facebookAdSetId, dateRange);
    } catch (error) {
      console.error('Error fetching ad set insights:', error);
      throw error;
    }
  }

  /**
   * Sync ad sets with Facebook
   */
  async syncAdSetsWithFacebook(campaignId: string): Promise<void> {
    try {
      const facebookAPI = await this.ensureFacebookAPI();
      const facebookAdSets = await facebookAPI.getAdSets(campaignId);
      
      for (const fbAdSet of facebookAdSets) {
        // Find local ad set by Facebook ID
        let localAdSet = await AdSet.findOne({ facebookAdSetId: fbAdSet.id });
        
        if (localAdSet) {
          // Update existing local record
          await AdSet.findByIdAndUpdate(localAdSet._id, {
            name: fbAdSet.name,
            status: fbAdSet.status,
            optimizationGoal: fbAdSet.optimization_goal,
            billingEvent: fbAdSet.billing_event,
            bidAmount: fbAdSet.bid_amount ? fbAdSet.bid_amount / 100 : undefined,
            dailyBudget: fbAdSet.daily_budget ? fbAdSet.daily_budget / 100 : undefined,
            lifetimeBudget: fbAdSet.lifetime_budget ? fbAdSet.lifetime_budget / 100 : undefined,
            targeting: fbAdSet.targeting,
            promotedObject: fbAdSet.promoted_object,
            startTime: fbAdSet.start_time,
            endTime: fbAdSet.end_time,
          });
        } else {
          // Create new local record for Facebook ad set
          const newAdSet = new AdSet({
            userId: this.userId,
            campaignId: campaignId,
            name: fbAdSet.name,
            facebookAdSetId: fbAdSet.id,
            facebookCampaignId: fbAdSet.campaign_id,
            status: fbAdSet.status,
            optimizationGoal: fbAdSet.optimization_goal,
            billingEvent: fbAdSet.billing_event,
            bidAmount: fbAdSet.bid_amount ? fbAdSet.bid_amount / 100 : 0,
            dailyBudget: fbAdSet.daily_budget ? fbAdSet.daily_budget / 100 : undefined,
            lifetimeBudget: fbAdSet.lifetime_budget ? fbAdSet.lifetime_budget / 100 : undefined,
            targeting: fbAdSet.targeting || {},
            promotedObject: fbAdSet.promoted_object,
            startTime: fbAdSet.start_time,
            endTime: fbAdSet.end_time,
            facebookAdAccountId: '', // Will need to be set based on context
          });
          await newAdSet.save();
        }
      }
    } catch (error) {
      console.error('Error syncing ad sets with Facebook:', error);
      throw error;
    }
  }
}
