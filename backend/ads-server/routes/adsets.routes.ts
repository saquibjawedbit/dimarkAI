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

export default router;
