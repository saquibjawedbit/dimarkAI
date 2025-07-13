import { GoogleGenerativeAI } from '@google/generative-ai';

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
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Rephrase existing text for better Facebook ads marketing reach
   */
  async rephraseText(request: RephraseTextRequest): Promise<GeminiResponse> {
    try {
      const {
        text,
        targetAudience = 'general consumers',
        tone = 'persuasive',
        platform = 'facebook'
      } = request;

      const prompt = `
You are an expert Facebook ads copywriter. Your task is to rephrase the following text to make it more effective for Facebook advertising and better reach.

Original Text: "${text}"

Requirements:
- Target Audience: ${targetAudience}
- Tone: ${tone}
- Platform: ${platform}
- Focus on improving engagement and conversion rates
- Keep it concise and attention-grabbing
- Include emotional triggers and urgency where appropriate
- Make it compliant with Facebook's advertising policies

Please provide:
1. A rephrased version that's more effective for Facebook ads
2. 2-3 alternative variations
3. Brief explanation of what makes the rephrased version better
4. Don't add free shipping or discounts unless explicitly mentioned
5. Use Rs if you have to mention currency

Format your response as JSON:
{
  "rephrased_text": "main rephrased version",
  "alternatives": ["alternative 1", "alternative 2", "alternative 3"],
  "explanation": "brief explanation of improvements",
  "key_improvements": ["improvement 1", "improvement 2", "improvement 3"]
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Try to parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        // If JSON parsing fails, return the raw text
        return {
          success: true,
          data: {
            originalText: text,
            generatedText: responseText,
            metadata: {
              tone,
              platform,
              audience: targetAudience
            }
          }
        };
      }

      return {
        success: true,
        data: {
          originalText: text,
          generatedText: parsedResponse.rephrased_text || responseText,
          suggestions: parsedResponse.alternatives || [],
          explanation: parsedResponse.explanation,
          key_improvements: parsedResponse.key_improvements || [],
          metadata: {
            tone,
            platform,
            audience: targetAudience
          }
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
        productName,
        description = '',
        targetAudience = 'general consumers',
        campaignObjective = 'conversions',
        tone = 'persuasive',
        platform = 'facebook',
        adFormat = 'single_image',
        callToAction = 'Learn More',
        budget,
        additionalContext = ''
      } = request;

      const prompt = `
You are an expert Facebook ads copywriter. Create compelling ad copy for a Facebook advertising campaign.

Product Information:
- Product Name: ${productName}
- Description: ${description}
- Target Audience: ${targetAudience}
- Campaign Objective: ${campaignObjective}
- Tone: ${tone}
- Platform: ${platform}
- Ad Format: ${adFormat}
- Call-to-Action: ${callToAction}
${budget ? `- Budget: $${budget}` : ''}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

Requirements:
- Create attention-grabbing headlines
- Write compelling primary text (max 125 characters for best performance)
- Include emotional triggers and benefits
- Make it compliant with Facebook's advertising policies
- Focus on the campaign objective: ${campaignObjective}
- Use ${tone} tone throughout
- Include relevant hashtags if appropriate
- Consider the ${adFormat} format when crafting the copy

Please provide:
1. A compelling headline (max 40 characters)
2. Primary text (max 125 characters)
3. Description text (max 30 words)
4. 2-3 alternative versions
5. Suggested hashtags (if applicable)

Format your response as JSON:
{
  "headline": "main headline",
  "primary_text": "main primary text",
  "description": "description text",
  "alternatives": [
    {
      "headline": "alternative headline 1",
      "primary_text": "alternative primary text 1",
      "description": "alternative description 1"
    },
    {
      "headline": "alternative headline 2",
      "primary_text": "alternative primary text 2",
      "description": "alternative description 2"
    }
  ],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Try to parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        // If JSON parsing fails, return the raw text
        return {
          success: true,
          data: {
            generatedText: responseText,
            metadata: {
              tone,
              platform,
              audience: targetAudience,
              objective: campaignObjective
            }
          }
        };
      }

      // Format the main generated text
      const mainText = `${parsedResponse.headline}\n\n${parsedResponse.primary_text}\n\n${parsedResponse.description}`;

      return {
        success: true,
        data: {
          generatedText: mainText,
          suggestions: parsedResponse.alternatives?.map((alt: any) => 
            `${alt.headline}\n\n${alt.primary_text}\n\n${alt.description}`
          ) || [],
          hashtags: parsedResponse.hashtags || [],
          tips: parsedResponse.tips || [],
          metadata: {
            tone,
            platform,
            audience: targetAudience,
            objective: campaignObjective
          }
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
   * Check if Gemini service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Say "Hello" if you can hear me.');
      const response = await result.response;
      return response.text().toLowerCase().includes('hello');
    } catch (error) {
      console.error('Gemini health check failed:', error);
      return false;
    }
  }
}
