import { GoogleGenerativeAI } from '@google/generative-ai';
import { User } from '../../common/types';
import { OrganizationRepository } from '../../common/repositories/OrganizationRepsitory';
import OpenAI from 'openai';

export interface RephraseTextRequest {
  text: string;
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive';
  platform?: 'facebook' | 'instagram' | 'general';
  productsServices?: string;
  brandTone?: string;
  offerDetails?: string;
  festiveContext?: string;
  preferredRegionalLanguage?: string;
  buisinessName?: string;
  businessType?: string;
  location?: string;
}

export interface GenerateTextRequest {
  buisinessName: string;
  description?: string;
  targetAudience?: string;
  campaignObjective?: 'brand_awareness' | 'reach' | 'traffic' | 'engagement' | 'app_installs' | 'video_views' | 'lead_generation' | 'conversions';
  tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive';
  platform?: 'facebook' | 'instagram' | 'general';
  adFormat?: 'single_image' | 'video' | 'carousel' | 'collection';
  callToAction?: string;
  budget?: number;
  additionalContext?: string;
  businessType?: string;
  productsServices?: string;
  location?: string;
  brandTone?: string;
  festiveContext?: string;
  preferredRegionalLanguage?: string;
  offerDetails?: string;
}

export interface GeminiResponse {
  success: boolean;
  data?: {
    generatedText: string;
  };
  error?: string;
}

export class GeminiService {
  private openAI: OpenAI;


  constructor() {
    this.openAI = new OpenAI();
  }

  /**
   * Rephrase existing text for better Facebook ads marketing reach
   */
  async rephraseText(request: RephraseTextRequest, user: User): Promise<GeminiResponse> {
    try {
      const {
        text,
        targetAudience = 'general consumers',
        productsServices = 'various products and services',
        brandTone = 'friendly and engaging',
        offerDetails = 'special offers and discounts',
        festiveContext = 'upcoming festive season',
        preferredRegionalLanguage = 'Hindi',
        buisinessName,
        businessType,
        location
      } = request;

      const prompt = `
You are a senior digital ad copywriter with 50+ years of experience. Based on the following business details, generate 6 high-converting Facebook/Instagram ad copies. Each ad should have an engaging **ad copy**, a **headline**, and a **caption**. Keep it optimized for mobile users and social media performance.

Write the following 6 types of ads:
1. Emotional & Homely tone (English)
2. Aspirational or Value-driven (English)
3. Minimalist or Sophisticated tone (English)
4. Regional language ad copy in [Preferred Regional Language]
5. Offer-based ad copy (include offers like [Offer Details])
6. Festive/Seasonal ad copy (based on [Festive Context])

### Business Information:
- Business Name: ${buisinessName}
- Business Type: ${businessType}
- Products/Services: ${productsServices}
- Location: ${location}
- Target Audience: ${targetAudience}
- Brand Tone: ${brandTone}
- Offer Details: ${offerDetails}
- Festive Context: ${festiveContext}
- Preferred Regional Language: ${preferredRegionalLanguage}
- Old Ad Text to Rephrase: ${text}
`;


      const result = await this.openAI.responses.create({
        model: "gpt-4o",
        input: prompt,
      });
      const responseText = result.output_text;

      return {
        success: true,
        data: {
          generatedText: responseText,
        }
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate new Facebook ad text based on product information
   */
  async generateAdText(request: GenerateTextRequest): Promise<GeminiResponse> {
    try {
      const {
        targetAudience,
        businessType,
        productsServices,
        location,
        brandTone,
        offerDetails,
        festiveContext,
        preferredRegionalLanguage,
        buisinessName,
      } = request;

      const prompt = `
You are a senior digital ad copywriter with 50+ years of experience. Based on the following business details, generate 6 high-converting Facebook/Instagram ad copies. Each ad should have an engaging **ad copy**, a **headline**, and a **caption**. Keep it optimized for mobile users and social media performance.

Write the following 6 types of ads:
1. Emotional & Homely tone (English)
2. Aspirational or Value-driven (English)
3. Minimalist or Sophisticated tone (English)
4. Regional language ad copy in [Preferred Regional Language]
5. Offer-based ad copy (include offers like [Offer Details])
6. Festive/Seasonal ad copy (based on [Festive Context])

### Business Information:
- Business Name: ${buisinessName}
- Business Type: ${businessType}
- Products/Services: ${productsServices}
- Location: ${location}
- Target Audience: ${targetAudience}
- Brand Tone: ${brandTone}
- Offer Details: ${offerDetails}
- Festive Context: ${festiveContext}
- Preferred Regional Language: ${preferredRegionalLanguage}
`;

      const result = await this.openAI.responses.create({
        model: "gpt-4o",
        input: prompt,
      });
      const responseText = result.output_text;
      // Try to parse JSON response


      return {
        success: true,
        data: {
          generatedText: responseText,
        }
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

}
