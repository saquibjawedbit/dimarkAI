import { Router } from 'express';
import { AdController } from '../controllers/ad.controller';

const router = Router();
const adController = new AdController();

/**
 * @route   POST /api/ads
 * @desc    Create a new ad
 * @access  Private
 */
router.post('/', adController.createAd);

/**
 * @route   GET /api/ads
 * @desc    Get ads with pagination and filtering
 * @access  Private
 */
router.get('/', adController.getAds);

/**
 * @route   GET /api/ads/:adId
 * @desc    Get ad by ID
 * @access  Private
 */
router.get('/:adId', adController.getAdById);

/**
 * @route   PUT /api/ads/:adId
 * @desc    Update ad
 * @access  Private
 */
router.put('/:adId', adController.updateAd);

/**
 * @route   DELETE /api/ads/:adId
 * @desc    Delete ad
 * @access  Private
 */
router.delete('/:adId', adController.deleteAd);

/**
 * @route   POST /api/ads/:adId/activate
 * @desc    Activate ad
 * @access  Private
 */
router.post('/:adId/activate', adController.activateAd);

/**
 * @route   POST /api/ads/:adId/pause
 * @desc    Pause ad
 * @access  Private
 */
router.post('/:adId/pause', adController.pauseAd);

/**
 * @route   POST /api/ads/:adId/duplicate
 * @desc    Duplicate ad
 * @access  Private
 */
router.post('/:adId/duplicate', adController.duplicateAd);

/**
 * @route   GET /api/ads/:adId/insights
 * @desc    Get ad insights
 * @access  Private
 */
router.get('/:adId/insights', adController.getAdInsights);

/**
 * @route   GET /api/ads/:adId/preview
 * @desc    Get ad preview
 * @access  Private
 */
router.get('/:adId/preview', adController.getAdPreview);

/**
 * @route   GET /api/ads/adset/:adsetId
 * @desc    Get ads by ad set
 * @access  Private
 */
router.get('/adset/:adsetId', adController.getAdsByAdSet);

export default router;
