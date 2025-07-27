import axiosClient from "@/api/axiosClient";

export interface RephraseTextRequest {
  text: string;
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive';
  platform?: 'facebook' | 'instagram' | 'general';
}

export interface GenerateTextRequest {
  productName: string;
  description?: string;
  targetAudience?: string;
  campaignObjective?: 'brand_awareness' | 'reach' | 'traffic' | 'engagement' | 'app_installs' | 'video_views' | 'lead_generation' | 'conversions';
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive';
  platform?: 'facebook' | 'instagram' | 'general';
  adFormat?: 'single_image' | 'video' | 'carousel' | 'collection';
  callToAction?: string;
  budget?: number;
  additionalContext?: string;
}

export interface GeminiResponse {
  success: boolean;
  data?: {
    originalText?: string;
    generatedText: string;
    suggestions?: string[];
    explanation?: string;
    key_improvements?: string[];
    hashtags?: string[];
    tips?: string[];
    metadata?: {
      tone: string;
      platform: string;
      audience: string;
      objective?: string;
    };
  };
  error?: string;
  message?: string;
}

export interface GeminiOptions {
  tones: string[];
  platforms: string[];
  campaignObjectives: string[];
  adFormats: string[];
  limits: {
    maxTextLength: number;
    maxProductNameLength: number;
    maxDescriptionLength: number;
    maxAdditionalContextLength: number;
  };
}

export class GeminiService {
  private basePath = '/api/gemini';

  /**
   * Rephrase existing text for better Facebook ads marketing reach
   */
  async rephraseText(request: RephraseTextRequest): Promise<GeminiResponse> {
    try {
      const response = await axiosClient.post(`${this.basePath}/rephrase`, request);
      return response.data as GeminiResponse;
    } catch (error: any) {
      console.error('Error rephrasing text:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to rephrase text'
      };
    }
  }

  /**
   * Generate new Facebook ad text based on product information
   */
  async generateAdText(request: GenerateTextRequest): Promise<GeminiResponse> {
    try {
      const response = await axiosClient.post(`${this.basePath}/generate`, request);
      return response.data as GeminiResponse;
    } catch (error: any) {
      console.error('Error generating ad text:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to generate ad text'
      };
    }
  }

  /**
   * Check if Gemini service is healthy
   */
  async healthCheck(): Promise<GeminiResponse> {
    try {
      const response = await axiosClient.get(`${this.basePath}/health`);
      return response.data as GeminiResponse;
    } catch (error: any) {
      console.error('Error checking Gemini health:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check Gemini health'
      };
    }
  }

  /**
   * Get available options for the Gemini service
   */
  async getOptions(): Promise<{ success: boolean; data?: GeminiOptions; error?: string }> {
    try {
      const response = await axiosClient.get(`${this.basePath}/options`);
      return response.data as unknown as { success: boolean; data?: GeminiOptions; error?: string };
    } catch (error: any) {
      console.error('Error getting Gemini options:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get options'
      };
    }
  }
}

export const geminiService = new GeminiService();