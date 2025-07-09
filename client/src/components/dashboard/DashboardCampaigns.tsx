import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Play, Pause, Edit, Trash2, Copy, MoreVertical, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { AdCard } from '../ui/AdCard';
import { CreateCampaignModal } from '../ui/CreateCampaignModal';
import { AdCreative } from '../../types';
import { campaignService, Campaign as BackendCampaign } from '../../services/campaign';

// Mock campaign data
const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Collection 2024',
    status: 'active',
    budget: 2500,
    spent: 1890,
    impressions: 45230,
    clicks: 1234,
    conversions: 89,
    ctr: 2.73,
    cpc: 1.53,
    roas: 3.24,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    adsCount: 5,
  },
  {
    id: '2',
    name: 'Back to School Promo',
    status: 'paused',
    budget: 1800,
    spent: 845,
    impressions: 23450,
    clicks: 567,
    conversions: 34,
    ctr: 2.42,
    cpc: 1.49,
    roas: 2.87,
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    adsCount: 3,
  },
  {
    id: '3',
    name: 'Holiday Campaign',
    status: 'draft',
    budget: 5000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    adsCount: 0,
  },
];

const mockAds: AdCreative[] = [
  {
    id: '1',
    userId: '1',
    headline: 'Summer Collection Sale',
    description: 'Get 25% off our latest summer styles. Limited time offer!',
    imageUrl: 'https://images.pexels.com/photos/5325588/pexels-photo-5325588.jpeg',
    callToAction: 'Shop Now',
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    headline: 'New Product Launch',
    description: 'Introducing our revolutionary product. Be the first to try it!',
    imageUrl: 'https://images.pexels.com/photos/5325600/pexels-photo-5325600.jpeg',
    callToAction: 'Learn More',
    status: 'draft',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

type Campaign = typeof mockCampaigns[0];

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onToggleStatus: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'paused':
        return 'bg-warning text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{campaign.adsCount} ads</span>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="p-2"
            >
              <MoreVertical size={16} />
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(campaign);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Campaign
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(campaign);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Copy size={16} className="mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onToggleStatus(campaign);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    {campaign.status === 'active' ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Pause Campaign
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Start Campaign
                      </>
                    )}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(campaign);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Budget and Spend */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Budget Usage</span>
              <span className="font-medium">
                {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Impressions</span>
              <p className="font-semibold">{formatNumber(campaign.impressions)}</p>
            </div>
            <div>
              <span className="text-gray-600">Clicks</span>
              <p className="font-semibold">{formatNumber(campaign.clicks)}</p>
            </div>
            <div>
              <span className="text-gray-600">CTR</span>
              <p className="font-semibold">{campaign.ctr}%</p>
            </div>
            <div>
              <span className="text-gray-600">ROAS</span>
              <p className="font-semibold text-success">{campaign.roas}x</p>
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="text-sm text-gray-600">
            <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ads] = useState<AdCreative[]>(mockAds);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'ads'>('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Convert backend campaign to component campaign format
  const mapBackendCampaign = (backendCampaign: BackendCampaign): Campaign => ({
    id: backendCampaign._id,
    name: backendCampaign.name,
    status: backendCampaign.status.toLowerCase() as 'active' | 'paused' | 'draft',
    budget: backendCampaign.dailyBudget || 0,
    spent: backendCampaign.spend || 0,
    impressions: backendCampaign.impressions || 0,
    clicks: backendCampaign.clicks || 0,
    conversions: backendCampaign.conversions || 0,
    ctr: backendCampaign.ctr || 0,
    cpc: backendCampaign.cpc || 0,
    roas: backendCampaign.roas || 0,
    startDate: backendCampaign.startTime?.split('T')[0] || new Date().toISOString().split('T')[0],
    endDate: backendCampaign.endTime?.split('T')[0] || '',
    adsCount: 0, // This would need to come from a separate API call
  });

  // Load campaigns from backend
  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await campaignService.getCampaigns({
        page: 1,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      if (response.data) {
        const mappedCampaigns = response.data.data.map(mapBackendCampaign);
        setCampaigns(mappedCampaigns);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load campaigns');
      console.error('Error loading campaigns:', err);
      // Fallback to mock data on error
      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  };

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditCampaign = (campaign: Campaign) => {
    console.log('Editing campaign:', campaign);
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (!window.confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      return;
    }

    try {
      await campaignService.deleteCampaign(campaign.id);
      // Reload campaigns after deletion
      await loadCampaigns();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete campaign');
    }
  };

  const handleToggleCampaignStatus = async (campaign: Campaign) => {
    try {
      if (campaign.status === 'active') {
        await campaignService.pauseCampaign(campaign.id);
      } else {
        await campaignService.activateCampaign(campaign.id);
      }
      // Reload campaigns after status change
      await loadCampaigns();
    } catch (err: any) {
      alert(err?.message || 'Failed to update campaign status');
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      await campaignService.duplicateCampaign(campaign.id);
      // Reload campaigns after duplication
      await loadCampaigns();
    } catch (err: any) {
      alert(err?.message || 'Failed to duplicate campaign');
    }
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    // Reload campaigns after creation
    loadCampaigns();
  };

  const handlePublishAd = (ad: AdCreative) => {
    console.log('Publishing ad:', ad);
  };

  const handleEditAd = (ad: AdCreative) => {
    console.log('Editing ad:', ad);
  };

  const handleDeleteAd = (ad: AdCreative) => {
    console.log('Deleting ad:', ad);
  };

  return (
    <div className="pt-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-2">
            Manage your advertising campaigns and ad creatives
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleCreateCampaign}>
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ads'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ad Creatives ({ads.length})
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === 'campaigns' && (
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'campaigns' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEditCampaign}
              onDelete={handleDeleteCampaign}
              onToggleStatus={handleToggleCampaignStatus}
              onDuplicate={handleDuplicateCampaign}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onPublish={handlePublishAd}
              onEdit={handleEditAd}
              onDelete={handleDeleteAd}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'campaigns' && filteredCampaigns.length === 0) ||
        (activeTab === 'ads' && ads.length === 0)) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {activeTab === 'campaigns' ? <Target size={24} className="text-gray-400" /> : <Plus size={24} className="text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? `No ${activeTab} match your search criteria.`
              : `Get started by creating your first ${activeTab.slice(0, -1)}.`}
          </p>
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Create {activeTab === 'campaigns' ? 'Campaign' : 'Ad Creative'}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadCampaigns}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
