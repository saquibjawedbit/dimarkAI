import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft, 
  Target
} from 'lucide-react';
import { Button } from '../ui/Button';
import { FacebookAdCard } from '../ui/FacebookAdCard';
import { CreateAdModal } from '../ui/CreateAdModal';
import { adService } from '../../services/ad';
import { campaignService } from '../../services/campaign';
import { Ad } from '../../types';

interface AdsManagementProps {}

export const AdsManagement: React.FC<AdsManagementProps> = () => {
  const { campaignId, adsetId } = useParams<{ campaignId: string; adsetId: string }>();
  const navigate = useNavigate();
  
  const [ads, setAds] = useState<Ad[]>([]);
  const [adsets, setAdsets] = useState<any[]>([]);
  const [campaignName, setCampaignName] = useState<string>('');
  const [adsetName, setAdsetName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load campaign and adset info
  useEffect(() => {
    const loadCampaignAndAdsetInfo = async () => {
      if (!campaignId || !adsetId) return;
      
      try {
        // Load campaign info
        const campaignResponse = await campaignService.getCampaignById(campaignId);
        if (campaignResponse?.data) {
          setCampaignName(campaignResponse.data.name);
        }
        
        // Load adsets to get the current adset name
        const adsetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
        if (adsetsResponse?.data) {
          const adsetsData = Array.isArray(adsetsResponse.data) ? adsetsResponse.data : [adsetsResponse.data];
          setAdsets(adsetsData);
          const currentAdset = adsetsData.find(adset => adset._id === adsetId);
          if (currentAdset) {
            setAdsetName(currentAdset.name);
          }
        }
      } catch (err) {
        console.error('Error loading campaign/adset info:', err);
      }
    };
    
    loadCampaignAndAdsetInfo();
  }, [campaignId, adsetId]);

  // Load ads for this adset
  useEffect(() => {
    const loadAds = async () => {
      if (!adsetId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await adService.getAdsByAdSet(adsetId);
        if (response?.data) {
          setAds(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          setAds([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load ads');
        console.error('Error loading ads:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAds();
  }, [adsetId]);

  // Filter ads based on search and status
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle ad actions
  const handleCreateAd = () => {
    setShowCreateModal(true);
  };

  const handleAdCreated = () => {
    // Reload ads after creation
    const loadAds = async () => {
      if (!adsetId) return;
      
      try {
        const response = await adService.getAdsByAdSet(adsetId);
        if (response?.data) {
          setAds(Array.isArray(response.data) ? response.data : [response.data]);
        }
      } catch (err) {
        console.error('Error reloading ads:', err);
      }
    };
    
    loadAds();
  };

  const handleEditAd = (ad: Ad) => {
    console.log('Edit ad:', ad);
    // TODO: Implement edit functionality
  };

  const handleDeleteAd = async (ad: Ad) => {
    if (!window.confirm(`Are you sure you want to delete "${ad.name}"?`)) {
      return;
    }

    try {
      await adService.deleteAd(ad.id);
      handleAdCreated(); // Reload ads
    } catch (err: any) {
      alert(err?.message || 'Failed to delete ad');
    }
  };

  const handleToggleAdStatus = async (ad: Ad) => {
    try {
      if (ad.status === 'ACTIVE') {
        await adService.pauseAd(ad.id);
      } else {
        await adService.activateAd(ad.id);
      }
      handleAdCreated(); // Reload ads
    } catch (err: any) {
      alert(err?.message || 'Failed to update ad status');
    }
  };

  const handleDuplicateAd = async (ad: Ad) => {
    try {
      await adService.duplicateAd(ad.id);
      handleAdCreated(); // Reload ads
    } catch (err: any) {
      alert(err?.message || 'Failed to duplicate ad');
    }
  };

  const handleViewInsights = (ad: Ad) => {
    console.log('View insights for ad:', ad);
    // TODO: Implement insights functionality
  };

  const handlePreviewAd = (ad: Ad) => {
    console.log('Preview ad:', ad);
    // TODO: Implement preview functionality
  };

  const handleBackToAdSets = () => {
    navigate(`/dashboard/campaigns/${campaignId}/adsets`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToAdSets}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Ad Sets</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ads for: {adsetName}
            </h1>
            <p className="text-gray-600">
              Campaign: {campaignName}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={handleCreateAd}
        >
          Create Ad
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search ads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="DISAPPROVED">Disapproved</option>
            <option value="PREAPPROVED">Pre-approved</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading ads...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={handleAdCreated}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <FacebookAdCard
              key={ad.id}
              ad={ad}
              onEdit={handleEditAd}
              onDelete={handleDeleteAd}
              onToggleStatus={handleToggleAdStatus}
              onDuplicate={handleDuplicateAd}
              onViewInsights={handleViewInsights}
              onPreview={handlePreviewAd}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAds.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No ads found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? 'No ads match your search criteria.'
              : 'Get started by creating your first ad for this ad set.'}
          </p>
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />}
            onClick={handleCreateAd}
          >
            Create Ad
          </Button>
        </div>
      )}

      {/* Create Ad Modal */}
      <CreateAdModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleAdCreated}
        adsets={adsets}
        preselectedAdsetId={adsetId}
      />
    </div>
  );
};
