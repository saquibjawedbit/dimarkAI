import { Request, Response } from 'express';
import { GeminiService, RephraseTextRequest, GenerateTextRequest } from '../services/gemini.service';
import { ApiResponse } from '../../common/types/index';

export class GeminiController {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  /**
   * Rephrase existing text for better Facebook ads marketing reach
   */
  async rephraseText(req: Request, res: Response): Promise<Response> {
    try {
      const { text, targetAudience, tone, platform } = req.body as RephraseTextRequest;

      // Validate required fields
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Text is required and cannot be empty'
        } as ApiResponse);
      }

      if (text.length > 1000) {
        return res.status(400).json({
          success: false,
          error: 'Text must be less than 1000 characters'
        } as ApiResponse);
      }

      // Validate tone if provided
      const validTones = ['professional', 'casual', 'friendly', 'urgent', 'persuasive'];
      if (tone && !validTones.includes(tone)) {
        return res.status(400).json({
          success: false,
          error: `Invalid tone. Must be one of: ${validTones.join(', ')}`
        } as ApiResponse);
      }

      // Validate platform if provided
      const validPlatforms = ['facebook', 'instagram', 'general'];
      if (platform && !validPlatforms.includes(platform)) {
        return res.status(400).json({
          success: false,
          error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
        } as ApiResponse);
      }

      const request: RephraseTextRequest = {
        text,
        targetAudience,
        tone,
        platform,
        productsServices: req.body.productsServices,
        brandTone: req.body.brandTone,
        offerDetails: req.body.offerDetails,
        festiveContext: req.body.festiveContext,
        preferredRegionalLanguage: req.body.preferredRegionalLanguage,
        buisinessName: req.body.buisinessName,
        businessType: req.body.businessType,
        location: req.body.location
      };

      const result = await this.geminiService.rephraseText(request, (req as any).user);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to rephrase text'
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: result.data,
        message: 'Text rephrased successfully'
      } as ApiResponse);

    } catch (error) {
      console.error('Error in rephraseText:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Generate new Facebook ad text based on product information
   */
  async generateAdText(req: Request, res: Response): Promise<Response> {
    try {
      const {
        targetAudience,
        businessType,
        productsServices,
        location,
        brandTone,
        offerDetails,
        festiveContext,
        preferredRegionalLanguage
      } = req.body;


      const request: GenerateTextRequest = {
        targetAudience,
        businessType,
        productsServices,
        location,
        brandTone,
        offerDetails,
        festiveContext,
        preferredRegionalLanguage,
        buisinessName: req.body.buisinessName,
      };

      const result = await this.geminiService.generateAdText(request);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to generate ad text'
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: result.data,
        message: 'Ad text generated successfully'
      } as ApiResponse);

    } catch (error) {
      console.error('Error in generateAdText:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Get available options for the Gemini service
   */
  async getOptions(req: Request, res: Response): Promise<Response> {
    try {
      const options = {
        tones: ['professional', 'casual', 'friendly', 'urgent', 'persuasive'],
        platforms: ['facebook', 'instagram', 'general'],
        campaignObjectives: [
          'brand_awareness', 'reach', 'traffic', 'engagement', 
          'app_installs', 'video_views', 'lead_generation', 'conversions'
        ],
        adFormats: ['single_image', 'video', 'carousel', 'collection'],
        limits: {
          maxTextLength: 1000,
          maxProductNameLength: 100,
          maxDescriptionLength: 500,
          maxAdditionalContextLength: 300
        }
      };

      return res.json({
        success: true,
        data: options,
        message: 'Available options retrieved successfully'
      } as ApiResponse);

    } catch (error) {
      console.error('Error in getOptions:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve options'
      } as ApiResponse);
    }
  }
}
