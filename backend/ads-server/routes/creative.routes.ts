import express from 'express';
import { CreativeController } from '../controllers/creative.controller';
import { AuthMiddleware } from '../../auth-server/middleware/auth.middleware';

const router = express.Router();
const creativeController = new CreativeController();

// Apply authentication middleware to all creative routes
router.use(AuthMiddleware.authenticateToken);

/**
 * @route   POST /api/creatives
 * @desc    Create a new creative
 * @access  Private
 */
router.post('/', creativeController.createCreative);

/**
 * @route   GET /api/creatives
 * @desc    Get all creatives for the user's ad account
 * @access  Private
 */
router.get('/', creativeController.getCreatives);

/**
 * @route   GET /api/creatives/constants
 * @desc    Get creative constants for UI
 * @access  Private
 */
router.get('/constants', creativeController.getCreativeConstants);

/**
 * @route   GET /api/creatives/search
 * @desc    Search creatives by name
 * @access  Private
 */
router.get('/search', creativeController.searchCreatives);

/**
 * @route   GET /api/creatives/:creativeId
 * @desc    Get a specific creative by ID
 * @access  Private
 */
router.get('/:creativeId', creativeController.getCreative);

/**
 * @route   PUT /api/creatives/:creativeId
 * @desc    Update a creative
 * @access  Private
 */
router.put('/:creativeId', creativeController.updateCreative);

/**
 * @route   DELETE /api/creatives/:creativeId
 * @desc    Delete a creative
 * @access  Private
 */
router.delete('/:creativeId', creativeController.deleteCreative);

/**
 * @route   POST /api/creatives/preview
 * @desc    Generate creative preview
 * @access  Private
 */
router.post('/preview', creativeController.generateCreativePreview);

/**
 * @route   POST /api/creatives/:creativeId/insights
 * @desc    Get creative insights
 * @access  Private
 */
router.post('/:creativeId/insights', creativeController.getCreativeInsights);

/**
 * @route   POST /api/creatives/:creativeId/with-insights
 * @desc    Get creative with insights
 * @access  Private
 */
router.post('/:creativeId/with-insights', creativeController.getCreativeWithInsights);

/**
 * @route   GET /api/creatives/:creativeId/performance-summary
 * @desc    Get creative performance summary
 * @access  Private
 */
router.get('/:creativeId/performance-summary', creativeController.getCreativePerformanceSummary);

/**
 * @route   POST /api/creatives/bulk-update
 * @desc    Bulk update creatives
 * @access  Private
 */
router.post('/bulk-update', creativeController.bulkUpdateCreatives);

/**
 * @route   POST /api/creatives/bulk-delete
 * @desc    Bulk delete creatives
 * @access  Private
 */
router.post('/bulk-delete', creativeController.bulkDeleteCreatives);

/**
 * @route   GET /api/creatives/pages
 * @desc    Get user's Facebook Pages
 * @access  Private
 */
router.get('/pages', creativeController.getUserPages);

export default router;
