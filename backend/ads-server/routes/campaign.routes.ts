import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller';

const router = Router();
const campaignController = new CampaignController();

// Campaign CRUD operations
router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

// Campaign status operations
router.post('/:id/pause', campaignController.pauseCampaign);
router.post('/:id/activate', campaignController.activateCampaign);
router.post('/:id/archive', campaignController.archiveCampaign);

// Campaign utility operations
router.post('/:id/duplicate', campaignController.duplicateCampaign);
router.get('/:id/insights', campaignController.getCampaignInsights);

// Bulk operations
router.post('/bulk', campaignController.bulkOperations);

// Facebook integration
router.post('/sync', campaignController.syncWithFacebook);

export default router;
