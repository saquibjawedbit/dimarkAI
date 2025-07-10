import { Request, Response } from 'express';
import { CampaignService } from '../services/campaign.services';
import {
    CreateCampaignRequest,
    UpdateCampaignRequest,
    CampaignFilters,
    BulkCampaignOperation,
    PaginationParams,
    ApiResponse
} from '../../common/types';

export class CampaignController {

    constructor() {
        // No longer need to instantiate the service here
    }

    /**
     * Create a campaign service instance for the given user
     */
    private createCampaignService(userId: string): CampaignService {
        return new CampaignService(userId);
    }

    /**
     * Create a new campaign
     * POST /api/campaigns
     */
    createCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignData: CreateCampaignRequest = req.body;

            // Basic validation
            if (!campaignData.name || !campaignData.objective) {
                res.status(400).json({
                    success: false,
                    message: 'Name, objective are required',
                } as ApiResponse);
                return;
            }
            campaignData.facebookAdAccountId = (req as any).user?.adsAccountId;

            if (!campaignData.facebookAdAccountId) {
                res.status(400).json({
                    success: false,
                    message: 'Facebook Ads Account ID not configured for user. Please update your profile.',
                } as ApiResponse);
                return;
            }


            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.createCampaign(userId, campaignData);

            res.status(201).json({
                success: true,
                message: 'Campaign created successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error creating campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Get all campaigns with filtering and pagination
     * GET /api/campaigns
     */
    getCampaigns = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            // Parse query parameters
            const filters: CampaignFilters = {
                status: req.query.status as any,
                objective: req.query.objective as CampaignFilters["objective"],
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                facebookAdAccountId: req.query.facebookAdAccountId as string,
            };

            const pagination: PaginationParams = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sortBy: req.query.sortBy as string || 'createdAt',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
            };

            const campaignService = this.createCampaignService(userId);
            const result = await campaignService.getCampaigns(userId, filters, pagination);

            res.status(200).json({
                success: true,
                message: 'Campaigns retrieved successfully',
                data: result.data,
                pagination: result.pagination,
            } as ApiResponse);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch campaigns',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Get campaign by ID
     * GET /api/campaigns/:id
     */
    getCampaignById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.getCampaignById(userId, campaignId);

            if (!campaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign retrieved successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error fetching campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Update campaign
     * PUT /api/campaigns/:id
     */
    updateCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const updateData: UpdateCampaignRequest = req.body;

            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.updateCampaign(userId, campaignId, updateData);

            if (!campaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign updated successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error updating campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Delete campaign
     * DELETE /api/campaigns/:id
     */
    deleteCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const deleted = await campaignService.deleteCampaign(userId, campaignId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign deleted successfully',
            } as ApiResponse);
        } catch (error) {
            console.error('Error deleting campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Bulk operations on campaigns
     * POST /api/campaigns/bulk
     */
    bulkOperations = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const operation: BulkCampaignOperation = req.body;

            if (!operation.campaignIds || !Array.isArray(operation.campaignIds) || operation.campaignIds.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Campaign IDs array is required',
                } as ApiResponse);
                return;
            }

            if (!operation.operation || !['pause', 'activate', 'archive', 'delete'].includes(operation.operation)) {
                res.status(400).json({
                    success: false,
                    message: 'Valid operation is required (pause, activate, archive, delete)',
                } as ApiResponse);
                return;
            }

            const campaignService = this.createCampaignService(userId);
            const result = await campaignService.bulkOperation(userId, operation);

            res.status(200).json({
                success: true,
                message: `Bulk operation completed. ${result.success} successful, ${result.failed} failed.`,
                data: result,
            } as ApiResponse);
        } catch (error) {
            console.error('Error performing bulk operation:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to perform bulk operation',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Get campaign insights/performance
     * GET /api/campaigns/:id/insights
     */
    getCampaignInsights = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const dateRange = req.query.start && req.query.end ? {
                start: req.query.start as string,
                end: req.query.end as string,
            } : undefined;

            const campaignService = this.createCampaignService(userId);
            const insights = await campaignService.getCampaignInsights(userId, campaignId, dateRange);

            res.status(200).json({
                success: true,
                message: 'Campaign insights retrieved successfully',
                data: insights,
            } as ApiResponse);
        } catch (error) {
            console.error('Error fetching campaign insights:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch campaign insights',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Sync campaigns with Facebook
     * POST /api/campaigns/sync
     */
    syncWithFacebook = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const { facebookAdAccountId } = req.body;
            if (!facebookAdAccountId) {
                res.status(400).json({
                    success: false,
                    message: 'Facebook ad account ID is required',
                } as ApiResponse);
                return;
            }

            const campaignService = this.createCampaignService(userId);
            const result = await campaignService.syncWithFacebook(userId, facebookAdAccountId);

            res.status(200).json({
                success: true,
                message: `Sync completed. ${result.synced} campaigns synced.`,
                data: result,
            } as ApiResponse);
        } catch (error) {
            console.error('Error syncing with Facebook:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to sync with Facebook',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Pause campaign
     * POST /api/campaigns/:id/pause
     */
    pauseCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.updateCampaign(userId, campaignId, { status: 'PAUSED' });

            if (!campaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign paused successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error pausing campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to pause campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Activate campaign
     * POST /api/campaigns/:id/activate
     */
    activateCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.updateCampaign(userId, campaignId, { status: 'ACTIVE' });

            if (!campaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign activated successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error activating campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to activate campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Archive campaign
     * POST /api/campaigns/:id/archive
     */
    archiveCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const campaign = await campaignService.updateCampaign(userId, campaignId, { status: 'ARCHIVED' });

            if (!campaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Campaign archived successfully',
                data: campaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error archiving campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to archive campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };

    /**
     * Duplicate campaign
     * POST /api/campaigns/:id/duplicate
     */
    duplicateCampaign = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                } as ApiResponse);
                return;
            }

            const campaignId = req.params.id;
            const campaignService = this.createCampaignService(userId);
            const originalCampaign = await campaignService.getCampaignById(userId, campaignId);

            if (!originalCampaign) {
                res.status(404).json({
                    success: false,
                    message: 'Campaign not found',
                } as ApiResponse);
                return;
            }

            // Create duplicate campaign data
            const duplicateData: CreateCampaignRequest = {
                name: `${originalCampaign.name} (Copy)`,
                objective: originalCampaign.objective,
                status: 'PAUSED', // Always start duplicates as paused
                dailyBudget: originalCampaign.dailyBudget,
                lifetimeBudget: originalCampaign.lifetimeBudget,
                bidStrategy: originalCampaign.bidStrategy,
                bidAmount: originalCampaign.bidAmount,
                startTime: originalCampaign.startTime?.toISOString(),
                endTime: originalCampaign.endTime?.toISOString(),
                targetingSpec: originalCampaign.targetingSpec,
                facebookAdAccountId: originalCampaign.facebookAdAccountId,
            };

            const duplicateCampaign = await campaignService.createCampaign(userId, duplicateData);

            res.status(201).json({
                success: true,
                message: 'Campaign duplicated successfully',
                data: duplicateCampaign,
            } as ApiResponse);
        } catch (error) {
            console.error('Error duplicating campaign:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to duplicate campaign',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as ApiResponse);
        }
    };
}