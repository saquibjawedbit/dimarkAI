import { Request, Response } from 'express';
import { AdService, CreateAdRequest, UpdateAdRequest, GetAdsParams } from '../services/ad.service';
import { UserRepository } from '../../common/repositories/UserRepository';
import { ApiResponse } from '../../common/types/index';
import { FacebookTokenCache, RedisCacheService } from '../../common';

export class AdController {
  private userRepository: UserRepository;
    cacheService: FacebookTokenCache;

  constructor() {
    this.userRepository = new UserRepository();
    this.cacheService = new FacebookTokenCache();
  }

  /**
   * Create ad service instance for user
   */
  private async createAdService(userId: string): Promise<AdService> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // For now, use environment variables for Facebook access token and ad account
    // In a production app, these would be stored per user in the database
    const facebookAccessToken = await this.cacheService.getUserToken(userId);
    const facebookAdAccount = process.env.FACEBOOK_AD_ACCOUNT_ID || user.adsAccountId;

    if (!facebookAccessToken) {
      throw new Error('Facebook access token not configured');
    }

    if (!facebookAdAccount) {
      throw new Error('Facebook ad account not configured');
    }

    return new AdService(userId, facebookAccessToken, facebookAdAccount);
  }

  /**
   * Create a new ad
   */
  createAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const adData: CreateAdRequest = req.body;
      
      // Validate required fields
      if (!adData.name || !adData.adsetId || !adData.creativeId) {
        res.status(400).json({ 
          success: false, 
          message: 'Name, adset ID, and creative ID are required' 
        } as ApiResponse);
        return;
      }

      console.log('Creating ad with data:', adData);

      if (!/^\d+$/.test(adData.creativeId)) {
        res.status(400).json({ 
          success: false, 
          message: 'Creative ID must be a valid number' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.createAd(adData);

      res.status(201).json({
        success: true,
        message: 'Ad created successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController createAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get ads with pagination and filtering
   */
  getAds = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const params: GetAdsParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
        status: req.query.status as string,
        campaignId: req.query.campaignId as string,
        adsetId: req.query.adsetId as string,
        creativeId: req.query.creativeId as string,
        fields: req.query.fields ? (req.query.fields as string).split(',') : undefined
      };

      const adService = await this.createAdService(userId);
      const result = await adService.getAds(params);

      res.status(200).json({
        success: true,
        message: 'Ads retrieved successfully',
        data: result.data,
        pagination: result.pagination
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController getAds error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ads',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get ad by ID
   */
  getAdById = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.getAdById(adId);

      if (!ad) {
        res.status(404).json({ 
          success: false, 
          message: 'Ad not found' 
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ad retrieved successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController getAdById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Update ad
   */
  updateAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      const updateData: UpdateAdRequest = req.body;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.updateAd(adId, updateData);

      if (!ad) {
        res.status(404).json({ 
          success: false, 
          message: 'Ad not found' 
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ad updated successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController updateAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Delete ad
   */
  deleteAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const success = await adService.deleteAd(adId);

      if (!success) {
        res.status(404).json({ 
          success: false, 
          message: 'Ad not found' 
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ad deleted successfully'
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController deleteAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Activate ad
   */
  activateAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.activateAd(adId);

      if (!ad) {
        res.status(404).json({ 
          success: false, 
          message: 'Ad not found' 
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ad activated successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController activateAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to activate ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Pause ad
   */
  pauseAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.pauseAd(adId);

      if (!ad) {
        res.status(404).json({ 
          success: false, 
          message: 'Ad not found' 
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ad paused successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController pauseAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to pause ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Duplicate ad
   */
  duplicateAd = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ad = await adService.duplicateAd(adId);

      res.status(201).json({
        success: true,
        message: 'Ad duplicated successfully',
        data: ad
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController duplicateAd error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate ad',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get ad insights
   */
  getAdInsights = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      const { since, until } = req.query;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const dateRange = since && until ? { since: since as string, until: until as string } : undefined;

      const adService = await this.createAdService(userId);
      const insights = await adService.getAdInsights(adId, dateRange);

      res.status(200).json({
        success: true,
        message: 'Ad insights retrieved successfully',
        data: insights
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController getAdInsights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ad insights',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get ad preview
   */
  getAdPreview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adId } = req.params;
      const { adFormat } = req.query;
      
      if (!adId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const preview = await adService.getAdPreview(adId, adFormat as string);

      res.status(200).json({
        success: true,
        message: 'Ad preview retrieved successfully',
        data: preview
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController getAdPreview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ad preview',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get ads by ad set
   */
  getAdsByAdSet = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { adsetId } = req.params;
      
      if (!adsetId) {
        res.status(400).json({ 
          success: false, 
          message: 'Ad set ID is required' 
        } as ApiResponse);
        return;
      }

      const adService = await this.createAdService(userId);
      const ads = await adService.getAdsByAdSet(adsetId);

      res.status(200).json({
        success: true,
        message: 'Ads retrieved successfully',
        data: ads
      } as ApiResponse);
    } catch (error: any) {
      console.error('AdController getAdsByAdSet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ads by ad set',
        error: error.message
      } as ApiResponse);
    }
  };
}
