import { Router } from 'express';
import { AdSetsController } from '../controllers/adsets.controller';

const router = Router();
const controller = new AdSetsController();

// Create Ad Set
router.post('/', controller.createAdSet);

// Get all ad sets for a campaign
router.get('/campaign/:campaignId', controller.getAdSetsByCampaign);

// Get ad set by ID
router.get('/:adSetId', controller.getAdSetById);

// Update ad set
router.put('/:adSetId', controller.updateAdSet);

// Delete ad set
router.delete('/:adSetId', controller.deleteAdSet);

// Pause ad set
router.post('/:adSetId/pause', controller.pauseAdSet);

// Activate ad set
router.post('/:adSetId/activate', controller.activateAdSet);

// Get ad set insights
router.get('/:adSetId/insights', controller.getAdSetInsights);

// Sync ad sets with Facebook
router.post('/campaign/:campaignId/sync', controller.syncAdSetsWithFacebook);

export default router;
