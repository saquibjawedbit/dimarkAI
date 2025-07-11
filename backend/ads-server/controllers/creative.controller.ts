import { Request, Response } from 'express';
import { CreativeService } from '../services/creative.service';
import { 
  CreateCreativeRequest, 
  UpdateCreativeRequest, 
  CreativePreviewRequest, 
  CreativeInsightsRequest, 
  ApiResponse 
} from '../../common/types';
import { User } from '../../common/models/User';
import { 
  CALL_TO_ACTION_TYPES, 
  AD_FORMAT_TYPES, 
  CREATIVE_STATUS_TYPES, 
  AUTHORIZATION_CATEGORIES,
  APPLINK_TREATMENT_TYPES,
  DYNAMIC_AD_VOICE_TYPES
} from '../../common/types/creative.types';

export class CreativeController {
  private createCreativeService(userId: string) {
    return new CreativeService(userId);
  }

  /**
   * Create a new creative
   */
  createCreative = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      // Fetch user to get Facebook account ID
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' } as ApiResponse);
        return;
      }

      if (!user.adsAccountId) {
        res.status(400).json({ success: false, message: 'Facebook Ads Account ID not configured for user' } as ApiResponse);
        return;
      }

      const creativeData: CreateCreativeRequest = req.body;
      
      // Validate required fields
      if (!creativeData.name) {
        res.status(400).json({ success: false, message: 'Creative name is required' } as ApiResponse);
        return;
      }

      // Validate that at least one creative type is specified
      if (!creativeData.object_story_id && !creativeData.object_story_spec && !creativeData.asset_feed_spec && !creativeData.template_url) {
        res.status(400).json({ success: false, message: 'At least one creative type must be specified: object_story_id, object_story_spec, asset_feed_spec, or template_url' } as ApiResponse);
        return;
      }

      // Validate status if provided
      if (creativeData.status && !CREATIVE_STATUS_TYPES.includes(creativeData.status as any)) {
        res.status(400).json({ success: false, message: 'Invalid creative status' } as ApiResponse);
        return;
      }

      // Validate authorization_category if provided
      if (creativeData.authorization_category && !AUTHORIZATION_CATEGORIES.includes(creativeData.authorization_category as any)) {
        res.status(400).json({ success: false, message: 'Invalid authorization category' } as ApiResponse);
        return;
      }

      // Validate applink_treatment if provided
      if (creativeData.applink_treatment && !APPLINK_TREATMENT_TYPES.includes(creativeData.applink_treatment as any)) {
        res.status(400).json({ success: false, message: 'Invalid applink treatment' } as ApiResponse);
        return;
      }

      // Validate dynamic_ad_voice if provided
      if (creativeData.dynamic_ad_voice && !DYNAMIC_AD_VOICE_TYPES.includes(creativeData.dynamic_ad_voice as any)) {
        res.status(400).json({ success: false, message: 'Invalid dynamic ad voice' } as ApiResponse);
        return;
      }

      // Validate call_to_action_type if provided
      if (creativeData.call_to_action_type && !CALL_TO_ACTION_TYPES.includes(creativeData.call_to_action_type as any)) {
        res.status(400).json({ success: false, message: 'Invalid call to action type' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const creative = await creativeService.createCreative(creativeData);

      res.status(201).json({
        success: true,
        message: 'Creative created successfully',
        data: creative
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController createCreative error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create creative',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get a creative by ID
   */
  getCreative = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;
      const { fields } = req.query;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      const fieldsArray = fields ? (fields as string).split(',') : undefined;

      const creativeService = this.createCreativeService(userId);
      const creative = await creativeService.getCreative(creativeId, fieldsArray);

      res.status(200).json({
        success: true,
        message: 'Creative retrieved successfully',
        data: creative
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreative error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creative',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Update a creative
   */
  updateCreative = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;
      const updateData: UpdateCreativeRequest = req.body;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      // Validate status if provided
      if (updateData.status && !CREATIVE_STATUS_TYPES.includes(updateData.status as any)) {
        res.status(400).json({ success: false, message: 'Invalid creative status' } as ApiResponse);
        return;
      }

      // Validate authorization_category if provided
      if (updateData.authorization_category && !AUTHORIZATION_CATEGORIES.includes(updateData.authorization_category as any)) {
        res.status(400).json({ success: false, message: 'Invalid authorization category' } as ApiResponse);
        return;
      }

      // Validate run_status if provided
      if (updateData.run_status && !CREATIVE_STATUS_TYPES.includes(updateData.run_status as any)) {
        res.status(400).json({ success: false, message: 'Invalid run status' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const updatedCreative = await creativeService.updateCreative(creativeId, updateData);

      res.status(200).json({
        success: true,
        message: 'Creative updated successfully',
        data: updatedCreative
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController updateCreative error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update creative',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Delete a creative
   */
  deleteCreative = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const result = await creativeService.deleteCreative(creativeId);

      res.status(200).json({
        success: true,
        message: 'Creative deleted successfully',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController deleteCreative error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete creative',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * List all creatives
   */
  getCreatives = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { fields, limit, after } = req.query;

      const fieldsArray = fields ? (fields as string).split(',') : undefined;
      const limitNumber = limit ? parseInt(limit as string) : undefined;

      const creativeService = this.createCreativeService(userId);
      const creatives = await creativeService.getCreatives(fieldsArray, limitNumber, after as string);

      res.status(200).json({
        success: true,
        message: 'Creatives retrieved successfully',
        data: creatives.data,
        paging: creatives.paging
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreatives error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creatives',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Generate creative preview
   */
  generateCreativePreview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const previewData: CreativePreviewRequest = req.body;

      // Validate required fields
      if (!previewData.ad_format) {
        res.status(400).json({ success: false, message: 'Ad format is required' } as ApiResponse);
        return;
      }

      if (!previewData.creative_id && !previewData.creative_spec) {
        res.status(400).json({ success: false, message: 'Either creative_id or creative_spec must be provided' } as ApiResponse);
        return;
      }

      // Validate ad_format
      if (!AD_FORMAT_TYPES.includes(previewData.ad_format as any)) {
        res.status(400).json({ success: false, message: 'Invalid ad format' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const preview = await creativeService.generateCreativePreview(previewData);

      res.status(200).json({
        success: true,
        message: 'Creative preview generated successfully',
        data: preview
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController generateCreativePreview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate creative preview',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get creative insights
   */
  getCreativeInsights = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;
      const insightsParams: CreativeInsightsRequest = req.body;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const insights = await creativeService.getCreativeInsights(creativeId, insightsParams);

      res.status(200).json({
        success: true,
        message: 'Creative insights retrieved successfully',
        data: insights.data,
        paging: insights.paging
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreativeInsights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creative insights',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get creative with insights
   */
  getCreativeWithInsights = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;
      const insightsParams: CreativeInsightsRequest = req.body;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const result = await creativeService.getCreativeWithInsights(creativeId, insightsParams);

      res.status(200).json({
        success: true,
        message: 'Creative with insights retrieved successfully',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreativeWithInsights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creative with insights',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Bulk update creatives
   */
  bulkUpdateCreatives = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { updates } = req.body;

      if (!updates || !Array.isArray(updates)) {
        res.status(400).json({ success: false, message: 'Updates array is required' } as ApiResponse);
        return;
      }

      // Validate each update
      for (const update of updates) {
        if (!update.creativeId || !update.updateData) {
          res.status(400).json({ success: false, message: 'Each update must have creativeId and updateData' } as ApiResponse);
          return;
        }
      }

      const creativeService = this.createCreativeService(userId);
      const result = await creativeService.bulkUpdateCreatives(updates);

      res.status(200).json({
        success: true,
        message: 'Bulk update completed',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController bulkUpdateCreatives error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform bulk update',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Bulk delete creatives
   */
  bulkDeleteCreatives = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeIds } = req.body;

      if (!creativeIds || !Array.isArray(creativeIds)) {
        res.status(400).json({ success: false, message: 'Creative IDs array is required' } as ApiResponse);
        return;
      }

      if (creativeIds.length === 0) {
        res.status(400).json({ success: false, message: 'At least one creative ID is required' } as ApiResponse);
        return;
      }

      const creativeService = this.createCreativeService(userId);
      const result = await creativeService.bulkDeleteCreatives(creativeIds);

      res.status(200).json({
        success: true,
        message: 'Bulk delete completed',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController bulkDeleteCreatives error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform bulk delete',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Search creatives
   */
  searchCreatives = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { query, fields, limit } = req.query;

      if (!query) {
        res.status(400).json({ success: false, message: 'Search query is required' } as ApiResponse);
        return;
      }

      const fieldsArray = fields ? (fields as string).split(',') : undefined;
      const limitNumber = limit ? parseInt(limit as string) : undefined;

      const creativeService = this.createCreativeService(userId);
      const result = await creativeService.searchCreatives(query as string, fieldsArray, limitNumber);

      res.status(200).json({
        success: true,
        message: 'Creative search completed',
        data: result.data,
        paging: result.paging,
        query: result.query,
        total_results: result.total_results
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController searchCreatives error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search creatives',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get creative performance summary
   */
  getCreativePerformanceSummary = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }

      const { creativeId } = req.params;
      const { since, until } = req.query;

      if (!creativeId) {
        res.status(400).json({ success: false, message: 'Creative ID is required' } as ApiResponse);
        return;
      }

      const dateRange = since && until ? { since: since as string, until: until as string } : undefined;

      const creativeService = this.createCreativeService(userId);
      const summary = await creativeService.getCreativePerformanceSummary(creativeId, dateRange);

      res.status(200).json({
        success: true,
        message: 'Creative performance summary retrieved successfully',
        data: summary
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreativePerformanceSummary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creative performance summary',
        error: error.message
      } as ApiResponse);
    }
  };

  /**
   * Get creative constants for UI
   */
  getCreativeConstants = async (req: Request, res: Response) => {
    try {
      const constants = {
        callToActionTypes: CALL_TO_ACTION_TYPES,
        adFormatTypes: AD_FORMAT_TYPES,
        statusTypes: CREATIVE_STATUS_TYPES,
        authorizationCategories: AUTHORIZATION_CATEGORIES,
        applinkTreatmentTypes: APPLINK_TREATMENT_TYPES,
        dynamicAdVoiceTypes: DYNAMIC_AD_VOICE_TYPES
      };

      res.status(200).json({
        success: true,
        message: 'Creative constants retrieved successfully',
        data: constants
      } as ApiResponse);
    } catch (error: any) {
      console.error('CreativeController getCreativeConstants error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve creative constants',
        error: error.message
      } as ApiResponse);
    }
  };
}
