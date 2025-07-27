import express from 'express';
import { GeminiController } from '../controllers/gemini.controller';
import { AuthMiddleware } from '../../auth-server/middleware/auth.middleware';


const router = express.Router();
router.use(AuthMiddleware.authenticateToken);
const geminiController = new GeminiController();

/**
 * @route   POST /api/gemini/rephrase
 * @desc    Rephrase existing text for better Facebook ads marketing reach
 * @access  Private (requires authentication)
 * @body    {
 *   text: string (required) - The text to rephrase
 *   targetAudience?: string - Target audience for the ad
 *   tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'
 *   platform?: 'facebook' | 'instagram' | 'general'
 * }
 */
router.post('/rephrase', geminiController.rephraseText.bind(geminiController));

/**
 * @route   POST /api/gemini/generate
 * @desc    Generate new Facebook ad text based on product information
 * @access  Private (requires authentication)
 * @body    {
 *   productName: string (required) - Name of the product/service
 *   description?: string - Description of the product/service
 *   targetAudience?: string - Target audience for the ad
 *   campaignObjective?: 'brand_awareness' | 'reach' | 'traffic' | 'engagement' | 'app_installs' | 'video_views' | 'lead_generation' | 'conversions'
 *   tone?: 'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'
 *   platform?: 'facebook' | 'instagram' | 'general'
 *   adFormat?: 'single_image' | 'video' | 'carousel' | 'collection'
 *   callToAction?: string - Call-to-action text
 *   budget?: number - Campaign budget
 *   additionalContext?: string - Any additional context or requirements
 * }
 */
router.post('/generate', geminiController.generateAdText.bind(geminiController));


/**
 * @route   GET /api/gemini/options
 * @desc    Get available options for the Gemini service
 * @access  Private (requires authentication)
 */
router.get('/options', geminiController.getOptions.bind(geminiController));

export default router;
