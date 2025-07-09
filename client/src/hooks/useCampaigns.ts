import { useState, useEffect } from 'react';
import { campaignService, Campaign, CampaignFilters } from '../services/campaign';

export const useCampaigns = (initialFilters: CampaignFilters = {}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async (filters: CampaignFilters = initialFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await campaignService.getCampaigns({
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...filters,
      });
      
      if (response.data) {
        setCampaigns(response.data.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load campaigns');
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: any) => {
    try {
      const response = await campaignService.createCampaign(campaignData);
      if (response.data) {
        // Reload campaigns after creation
        await loadCampaigns();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to create campaign');
    }
  };

  const updateCampaign = async (campaignId: string, updateData: any) => {
    try {
      const response = await campaignService.updateCampaign(campaignId, updateData);
      if (response.data) {
        // Reload campaigns after update
        await loadCampaigns();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to update campaign');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      // Reload campaigns after deletion
      await loadCampaigns();
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to delete campaign');
    }
  };

  const pauseCampaign = async (campaignId: string) => {
    try {
      await campaignService.pauseCampaign(campaignId);
      // Reload campaigns after pause
      await loadCampaigns();
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to pause campaign');
    }
  };

  const activateCampaign = async (campaignId: string) => {
    try {
      await campaignService.activateCampaign(campaignId);
      // Reload campaigns after activation
      await loadCampaigns();
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to activate campaign');
    }
  };

  const duplicateCampaign = async (campaignId: string) => {
    try {
      await campaignService.duplicateCampaign(campaignId);
      // Reload campaigns after duplication
      await loadCampaigns();
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to duplicate campaign');
    }
  };

  // Load campaigns on hook initialization
  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    loadCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    pauseCampaign,
    activateCampaign,
    duplicateCampaign,
  };
};
