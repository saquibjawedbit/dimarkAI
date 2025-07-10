import { Request, Response } from 'express';
import { AdSetService } from '../services/adsets.service';
import { CreateAdSetRequest, UpdateAdSetRequest, ApiResponse } from '../../common/types';

export class AdSetsController {
  private createAdSetService(userId: string) {
    return new AdSetService(userId);
  }

  createAdSet = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' } as ApiResponse);
        return;
      }
      const adSetData: CreateAdSetRequest = req.body;
      // Validate required fields
      if (!adSetData.name || !adSetData.campaignId || !adSetData.optimizationGoal || !adSetData.billingEvent || !adSetData.bidAmount || !adSetData.targeting || !adSetData.facebookAdAccountId || !adSetData.startTime || !adSetData.endTime) {
        res.status(400).json({ success: false, message: 'Missing required fields' } as ApiResponse);
        return;
      }
      // Validate optimizationGoal
      const { OPTIMIZATION_GOALS } = require('../../common/constants/optimizationGoals');
      if (!OPTIMIZATION_GOALS.includes(adSetData.optimizationGoal)) {
        res.status(400).json({ success: false, message: 'Invalid optimizationGoal' } as ApiResponse);
        return;
      }
      // Validate billingEvent
      const { BILLING_EVENTS } = require('../../common/constants/billingEvents');
      if (!BILLING_EVENTS.includes(adSetData.billingEvent)) {
        res.status(400).json({ success: false, message: 'Invalid billingEvent' } as ApiResponse);
        return;
      }
      const adSetService = this.createAdSetService(userId);
      const adSet = await adSetService.createAdSet(userId, adSetData);
      res.status(201).json({ success: true, message: 'Ad set created', data: adSet } as ApiResponse);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create ad set', error: (error as Error).message } as ApiResponse);
    }
  };

  getAdSetsByCampaign = async (req: Request, res: Response) => {
    try {
      const { campaignId } = req.params;
      const adSetService = this.createAdSetService((req as any).user?.userId);
      const adSets = await adSetService.getAdSetsByCampaign(campaignId);
      res.json({ success: true, data: adSets } as ApiResponse);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad sets', error: (error as Error).message } as ApiResponse);
    }
  };

  getAdSetById = async (req: Request, res: Response) => {
    try {
      const { adSetId } = req.params;
      const adSetService = this.createAdSetService((req as any).user?.userId);
      const adSet = await adSetService.getAdSetById(adSetId);
      if (!adSet) {
        res.status(404).json({ success: false, message: 'Ad set not found' } as ApiResponse);
        return;
      }
      res.json({ success: true, data: adSet } as ApiResponse);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch ad set', error: (error as Error).message } as ApiResponse);
    }
  };

  updateAdSet = async (req: Request, res: Response) => {
    try {
      const { adSetId } = req.params;
      const update: UpdateAdSetRequest = req.body;
      const adSetService = this.createAdSetService((req as any).user?.userId);
      const adSet = await adSetService.updateAdSet(adSetId, update);
      if (!adSet) {
        res.status(404).json({ success: false, message: 'Ad set not found' } as ApiResponse);
        return;
      }
      res.json({ success: true, message: 'Ad set updated', data: adSet } as ApiResponse);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update ad set', error: (error as Error).message } as ApiResponse);
    }
  };

  deleteAdSet = async (req: Request, res: Response) => {
    try {
      const { adSetId } = req.params;
      const adSetService = this.createAdSetService((req as any).user?.userId);
      await adSetService.deleteAdSet(adSetId);
      res.json({ success: true, message: 'Ad set deleted' } as ApiResponse);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete ad set', error: (error as Error).message } as ApiResponse);
    }
  };
}
