import { FacebookMarketingAPI } from '../utils/facebook-api.util';
import { Ad, IAd } from '../../common/models/Ad';

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

export interface GetAdsParams {
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

export class AdService {
  private facebookApi: FacebookMarketingAPI;
  private userId: string;
  private adAccountId: string;

  constructor(userId: string, accessToken: string, adAccountId: string) {
    this.userId = userId;
    this.adAccountId = adAccountId;
    this.facebookApi = new FacebookMarketingAPI(accessToken);
  }

  /**
   * Create a new ad
   */
  async createAd(adData: CreateAdRequest): Promise<IAd> {
    try {
      console.log('Creating ad:', adData);

      // Validate required fields
      if (!adData.name || !adData.adsetId || !adData.creativeId) {
        throw new Error('Name, adset ID, and creative ID are required');
      }

      // Validate that adsetId and creativeId are valid numbers
      const adsetIdNum = parseInt(adData.adsetId, 10);
      const creativeIdNum = parseInt(adData.creativeId, 10);
      
      if (isNaN(adsetIdNum) || adsetIdNum <= 0) {
        throw new Error('Invalid adset ID - must be a positive number');
      }
      
      if (isNaN(creativeIdNum) || creativeIdNum <= 0) {
        throw new Error('Invalid creative ID - must be a positive number');
      }

      // Prepare Facebook API request
      const facebookAdData = {
        name: adData.name,
        adset_id: adsetIdNum, // Use validated number
        creative: {
          creative_id: creativeIdNum // Use validated number
        },
        status: adData.status || 'PAUSED',
        ...(adData.trackingSpecs && { tracking_specs: adData.trackingSpecs }),
        ...(adData.conversionDomain && { conversion_domain: adData.conversionDomain }),
        ...(adData.adLabels && { adlabels: adData.adLabels }),
        ...(adData.adScheduleStartTime && { ad_schedule_start_time: adData.adScheduleStartTime }),
        ...(adData.adScheduleEndTime && { ad_schedule_end_time: adData.adScheduleEndTime })
      };

      console.log('Facebook API request data:', facebookAdData);

      // Create ad via Facebook API
      const facebookResponse = await this.facebookApi.createAd(this.adAccountId, facebookAdData);
      console.log('Facebook API response:', facebookResponse);

      if (!facebookResponse.id) {
        throw new Error('Failed to create ad on Facebook');
      }

      // Fetch the created ad details from Facebook
      const adDetails = await this.facebookApi.getAd(facebookResponse.id, [
        'id', 'name', 'adset_id', 'campaign_id', 'creative', 'status', 'effective_status',
        'configured_status', 'bid_amount', 'conversion_domain', 'tracking_specs',
        'issues_info', 'recommendations', 'created_time', 'updated_time',
        'ad_review_feedback', 'ad_schedule_start_time', 'ad_schedule_end_time',
        'adlabels', 'preview_shareable_link'
      ]);

      // Save ad to database
      const ad = new Ad({
        userId: this.userId,
        facebookAdId: facebookResponse.id,
        name: adDetails.name,
        adsetId: adDetails.adset_id,
        campaignId: adDetails.campaign_id,
        creativeId: adDetails.creative?.creative_id || adData.creativeId,
        status: adDetails.status || 'PAUSED',
        effectiveStatus: adDetails.effective_status || 'PAUSED',
        configuredStatus: adDetails.configured_status || 'PAUSED',
        bidAmount: adDetails.bid_amount || 0,
        conversionDomain: adDetails.conversion_domain,
        tracking: adDetails.tracking_specs,
        issues: adDetails.issues_info || [],
        recommendations: adDetails.recommendations || [],
        createdTime: adDetails.created_time ? new Date(adDetails.created_time) : new Date(),
        updatedTime: adDetails.updated_time ? new Date(adDetails.updated_time) : new Date(),
        adReviewFeedback: adDetails.ad_review_feedback,
        adScheduleStartTime: adDetails.ad_schedule_start_time ? new Date(adDetails.ad_schedule_start_time) : undefined,
        adScheduleEndTime: adDetails.ad_schedule_end_time ? new Date(adDetails.ad_schedule_end_time) : undefined,
        adLabels: adDetails.adlabels || [],
        previewShareableLink: adDetails.preview_shareable_link
      });

      await ad.save();
      console.log('Ad saved to database:', ad._id);

      return ad;
    } catch (error: any) {
      console.error('AdService createAd error:', error);
      throw new Error(`Failed to create ad: ${error.message}`);
    }
  }

  /**
   * Get ads with pagination and filtering
   */
  async getAds(params: GetAdsParams = {}): Promise<{
    data: IAd[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        campaignId,
        adsetId,
        creativeId
      } = params;

      // Build query
      const query: any = { userId: this.userId };
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (campaignId) {
        query.campaignId = campaignId;
      }
      
      if (adsetId) {
        query.adsetId = adsetId;
      }
      
      if (creativeId) {
        query.creativeId = creativeId;
      }

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const [ads, total] = await Promise.all([
        Ad.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        Ad.countDocuments(query)
      ]);

      return {
        data: ads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      console.error('AdService getAds error:', error);
      throw new Error(`Failed to get ads: ${error.message}`);
    }
  }

  /**
   * Get ad by ID
   */
  async getAdById(adId: string): Promise<IAd | null> {
    try {
      const ad = await Ad.findOne({
        _id: adId,
        userId: this.userId
      });

      if (!ad) {
        return null;
      }

      // Optionally sync with Facebook API for latest data
      try {
        const facebookAd = await this.facebookApi.getAd(ad.facebookAdId, [
          'id', 'name', 'status', 'effective_status', 'configured_status',
          'bid_amount', 'issues_info', 'recommendations', 'updated_time',
          'preview_shareable_link'
        ]);

        // Update local data with Facebook data
        ad.status = facebookAd.status || ad.status;
        ad.effectiveStatus = facebookAd.effective_status || ad.effectiveStatus;
        ad.configuredStatus = facebookAd.configured_status || ad.configuredStatus;
        ad.bidAmount = facebookAd.bid_amount || ad.bidAmount;
        ad.issues = facebookAd.issues_info || ad.issues;
        ad.recommendations = facebookAd.recommendations || ad.recommendations;
        ad.updatedTime = facebookAd.updated_time ? new Date(facebookAd.updated_time) : ad.updatedTime;
        ad.previewShareableLink = facebookAd.preview_shareable_link || ad.previewShareableLink;

        await ad.save();
      } catch (syncError) {
        console.warn('Failed to sync ad with Facebook:', syncError);
        // Continue with local data if sync fails
      }

      return ad;
    } catch (error: any) {
      console.error('AdService getAdById error:', error);
      throw new Error(`Failed to get ad: ${error.message}`);
    }
  }

  /**
   * Update ad
   */
  async updateAd(adId: string, updateData: UpdateAdRequest): Promise<IAd | null> {
    try {
      const ad = await Ad.findOne({
        _id: adId,
        userId: this.userId
      });

      if (!ad) {
        throw new Error('Ad not found');
      }

      // Prepare Facebook API update data
      const facebookUpdateData: any = {};
      
      if (updateData.name) {
        facebookUpdateData.name = updateData.name;
      }
      
      if (updateData.status) {
        facebookUpdateData.status = updateData.status;
      }
      
      if (updateData.trackingSpecs) {
        facebookUpdateData.tracking_specs = updateData.trackingSpecs;
      }
      
      if (updateData.conversionDomain) {
        facebookUpdateData.conversion_domain = updateData.conversionDomain;
      }
      
      if (updateData.adLabels) {
        facebookUpdateData.adlabels = updateData.adLabels;
      }
      
      if (updateData.adScheduleStartTime) {
        facebookUpdateData.ad_schedule_start_time = updateData.adScheduleStartTime;
      }
      
      if (updateData.adScheduleEndTime) {
        facebookUpdateData.ad_schedule_end_time = updateData.adScheduleEndTime;
      }

      console.log('Updating ad on Facebook:', ad.facebookAdId, facebookUpdateData);

      // Update ad via Facebook API
      await this.facebookApi.updateAd(ad.facebookAdId, facebookUpdateData);

      // Update local database
      Object.assign(ad, updateData);
      ad.updatedTime = new Date();
      await ad.save();

      return ad;
    } catch (error: any) {
      console.error('AdService updateAd error:', error);
      throw new Error(`Failed to update ad: ${error.message}`);
    }
  }

  /**
   * Delete ad
   */
  async deleteAd(adId: string): Promise<boolean> {
    try {
      const ad = await Ad.findOne({
        _id: adId,
        userId: this.userId
      });

      if (!ad) {
        throw new Error('Ad not found');
      }

      console.log('Deleting ad on Facebook:', ad.facebookAdId);

      // Delete ad via Facebook API
      await this.facebookApi.deleteAd(ad.facebookAdId);

      // Update local database (mark as deleted)
      ad.status = 'DELETED';
      ad.updatedTime = new Date();
      await ad.save();

      return true;
    } catch (error: any) {
      console.error('AdService deleteAd error:', error);
      throw new Error(`Failed to delete ad: ${error.message}`);
    }
  }

  /**
   * Activate ad
   */
  async activateAd(adId: string): Promise<IAd | null> {
    return this.updateAd(adId, { status: 'ACTIVE' });
  }

  /**
   * Pause ad
   */
  async pauseAd(adId: string): Promise<IAd | null> {
    return this.updateAd(adId, { status: 'PAUSED' });
  }

  /**
   * Duplicate ad
   */
  async duplicateAd(adId: string): Promise<IAd> {
    try {
      const originalAd = await Ad.findOne({
        _id: adId,
        userId: this.userId
      });

      if (!originalAd) {
        throw new Error('Ad not found');
      }

      // Create new ad with duplicated data
      const duplicatedAdData: CreateAdRequest = {
        name: `${originalAd.name} (Copy)`,
        adsetId: originalAd.adsetId,
        creativeId: originalAd.creativeId,
        status: 'PAUSED', // Always start as paused
        trackingSpecs: originalAd.tracking,
        conversionDomain: originalAd.conversionDomain,
        adLabels: originalAd.adLabels,
        adScheduleStartTime: originalAd.adScheduleStartTime?.toISOString(),
        adScheduleEndTime: originalAd.adScheduleEndTime?.toISOString()
      };

      return await this.createAd(duplicatedAdData);
    } catch (error: any) {
      console.error('AdService duplicateAd error:', error);
      throw new Error(`Failed to duplicate ad: ${error.message}`);
    }
  }

  /**
   * Get ad insights/performance
   */
  async getAdInsights(adId: string, dateRange?: { since: string; until: string }): Promise<any> {
    try {
      const ad = await Ad.findOne({
        _id: adId,
        userId: this.userId
      });

      if (!ad) {
        throw new Error('Ad not found');
      }

        // Get insights from Facebook API
        const insights = await this.facebookApi.getAdInsights(ad.facebookAdId, dateRange);

        // Update local performance metrics
        if (insights.data && insights.data.length > 0) {
          const latestInsight = insights.data[0];
          ad.impressions = parseInt(latestInsight.impressions) || 0;
          ad.clicks = parseInt(latestInsight.clicks) || 0;
          ad.spend = parseFloat(latestInsight.spend) || 0;
          ad.ctr = parseFloat(latestInsight.ctr) || 0;
          ad.cpc = parseFloat(latestInsight.cpc) || 0;
          ad.conversions = parseInt(latestInsight.conversions) || 0;
          
          await ad.save();
        }

        return insights;
      } catch (error: any) {
        console.error('AdService getAdInsights error:', error);
        throw new Error(`Failed to get ad insights: ${error.message}`);
      }
    }

    /**
     * Get ad preview
     */
    async getAdPreview(adId: string, adFormat: string = 'DESKTOP_FEED_STANDARD'): Promise<any> {
      try {
        const ad = await Ad.findOne({
          _id: adId,
          userId: this.userId
        });

        if (!ad) {
          throw new Error('Ad not found');
        }

        // Get preview from Facebook API
        const preview = await this.facebookApi.getAdPreview(ad.facebookAdId, adFormat);
        
        return preview;
      } catch (error: any) {
        console.error('AdService getAdPreview error:', error);
        throw new Error(`Failed to get ad preview: ${error.message}`);
      }
    }

    /**
     * Get ads by ad set
     */
    async getAdsByAdSet(adsetId: string): Promise<IAd[]> {
      try {
        const ads = await Ad.find({
          userId: this.userId,
          adsetId: adsetId
        }).sort({ createdAt: -1 });

        return ads;
      } catch (error: any) {
        console.error('AdService getAdsByAdSet error:', error);
        throw new Error(`Failed to get ads by ad set: ${error.message}`);
      }
    }
  }
