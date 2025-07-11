import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Copy, 
  MoreVertical,
  Target,
  DollarSign,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { campaignService } from '../../services/campaign';
import { OPTIMIZATION_GOALS } from '../../constants/optimizationGoals';
import { BILLING_EVENTS } from '../../constants/billingEvents';
import { BID_STRATEGIES } from '../../constants/bidStrategies';

interface AdSet {
  _id: string;
  name: string;
  status: string;
  budget: number;
  startTime: string;
  endTime: string;
  optimizationGoal?: string;
  billingEvent?: string;
  bidAmount?: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  targeting?: string;
  promotedObject?: string;
  // Performance metrics (mock data for now)
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  spend?: number;
}

interface CreateAdSetFormData {
  name: string;
  optimizationGoal: string;
  billingEvent: string;
  bidAmount: number;
  bidStrategy: string;
  dailyBudget: number;
  lifetimeBudget: number;
  status: string;
  targeting: string;
  promotedObject: string;
  startTime: string;
  endTime: string;
}

interface AdSetCardProps {
  adSet: AdSet;
  onEdit: (adSet: AdSet) => void;
  onDelete: (adSet: AdSet) => void;
  onToggleStatus: (adSet: AdSet) => void;
  onDuplicate: (adSet: AdSet) => void;
  onViewAds: (adSet: AdSet) => void;
}

const AdSetCard: React.FC<AdSetCardProps> = ({
  adSet,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onViewAds,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleMenuItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowActions(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{adSet.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adSet.status)}`}>
                {adSet.status.charAt(0).toUpperCase() + adSet.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                {adSet.optimizationGoal?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleActionClick}
              className="p-2"
            >
              <MoreVertical size={16} />
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={(e) => handleMenuItemClick(e, () => onViewAds(adSet))}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Target size={16} className="mr-2" />
                    View Ads
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleMenuItemClick(e, () => onEdit(adSet))}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Ad Set
                  </button>
                  <button
                    onClick={(e) => handleMenuItemClick(e, () => onDuplicate(adSet))}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Copy size={16} className="mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => handleMenuItemClick(e, () => onToggleStatus(adSet))}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    {adSet.status.toLowerCase() === 'active' ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Pause Ad Set
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Activate Ad Set
                      </>
                    )}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleMenuItemClick(e, () => onDelete(adSet))}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
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
          {/* Budget Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Daily Budget</p>
                <p className="font-semibold">{formatCurrency(adSet.dailyBudget || 0)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Lifetime Budget</p>
                <p className="font-semibold">{formatCurrency(adSet.lifetimeBudget || 0)}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Impressions</span>
              <p className="font-semibold">{formatNumber(adSet.impressions || 0)}</p>
            </div>
            <div>
              <span className="text-gray-600">Clicks</span>
              <p className="font-semibold">{formatNumber(adSet.clicks || 0)}</p>
            </div>
            <div>
              <span className="text-gray-600">CTR</span>
              <p className="font-semibold">{formatPercentage(adSet.ctr || 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Spend</span>
              <p className="font-semibold">{formatCurrency(adSet.spend || 0)}</p>
            </div>
            <div>
              <span className="text-gray-600">CPC</span>
              <p className="font-semibold">{formatCurrency(adSet.cpc || 0)}</p>
            </div>
            <div>
              <span className="text-gray-600">CPM</span>
              <p className="font-semibold">{formatCurrency(adSet.cpm || 0)}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              {new Date(adSet.startTime).toLocaleDateString()} - {new Date(adSet.endTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdSetsManagement: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [campaignName, setCampaignName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdSet, setEditingAdSet] = useState<AdSet | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newAdSet, setNewAdSet] = useState<CreateAdSetFormData>({
    name: '',
    optimizationGoal: 'LINK_CLICKS',
    billingEvent: 'IMPRESSIONS',
    bidAmount: 0,
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
    dailyBudget: 0,
    lifetimeBudget: 0,
    status: 'PAUSED',
    targeting: JSON.stringify({
      geo_locations: { countries: ["US"] },
      age_min: 18,
      age_max: 65,
      publisher_platforms: ["facebook"],
      facebook_positions: ["feed"]
    }, null, 2),
    promotedObject: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  // Close action menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // This will be handled by individual cards
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Load campaign info and ad sets
  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load campaign info
        const campaignResponse = await campaignService.getCampaignById(campaignId);
        if (campaignResponse?.data?.name) {
          setCampaignName(campaignResponse.data.name);
        }

        // Load ad sets
        const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
        if (Array.isArray(adSetsResponse?.data)) {
          setAdSets(adSetsResponse.data);
        } else if (Array.isArray(adSetsResponse)) {
          setAdSets(adSetsResponse);
        } else {
          setAdSets([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campaignId]);

  // Calculate summary stats
  const summaryStats = {
    totalAdSets: adSets.length,
    activeAdSets: adSets.filter(adSet => adSet.status.toLowerCase() === 'active').length,
    pausedAdSets: adSets.filter(adSet => adSet.status.toLowerCase() === 'paused').length,
    totalSpend: adSets.reduce((sum, adSet) => sum + (adSet.spend || 0), 0),
    totalImpressions: adSets.reduce((sum, adSet) => sum + (adSet.impressions || 0), 0),
    totalClicks: adSets.reduce((sum, adSet) => sum + (adSet.clicks || 0), 0),
    averageCTR: adSets.length > 0 ? adSets.reduce((sum, adSet) => sum + (adSet.ctr || 0), 0) / adSets.length : 0,
    totalDailyBudget: adSets.reduce((sum, adSet) => sum + (adSet.dailyBudget || 0), 0),
    totalLifetimeBudget: adSets.reduce((sum, adSet) => sum + (adSet.lifetimeBudget || 0), 0),
  };

  const filteredAdSets = adSets.filter(adSet => {
    const matchesSearch = adSet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || adSet.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const errors: string[] = [];

    if (!newAdSet.name.trim()) {
      errors.push('Ad set name is required');
    }

    if (!newAdSet.optimizationGoal) {
      errors.push('Optimization goal is required');
    }

    if (!newAdSet.billingEvent) {
      errors.push('Billing event is required');
    }

    if (newAdSet.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || newAdSet.bidStrategy === 'COST_CAP') {
      if (!newAdSet.bidAmount || newAdSet.bidAmount <= 0) {
        errors.push('Bid amount is required for selected bid strategy');
      }
    }

    if (newAdSet.dailyBudget > 0 && newAdSet.lifetimeBudget > 0) {
      errors.push('Choose either daily budget OR lifetime budget, not both');
    }

    if (newAdSet.dailyBudget > 0 && newAdSet.dailyBudget < 1) {
      errors.push('Daily budget must be at least $1');
    }

    if (newAdSet.lifetimeBudget > 0 && newAdSet.lifetimeBudget < 10) {
      errors.push('Lifetime budget must be at least $10');
    }

    if (newAdSet.targeting.trim()) {
      try {
        const targeting = JSON.parse(newAdSet.targeting);
        if (!targeting.geo_locations || !targeting.geo_locations.countries) {
          errors.push('Targeting must include geo_locations with countries');
        }
      } catch (e) {
        errors.push('Targeting must be valid JSON');
      }
    } else {
      errors.push('Targeting is required');
    }

    if (newAdSet.promotedObject.trim()) {
      try {
        JSON.parse(newAdSet.promotedObject);
      } catch (e) {
        errors.push('Promoted object must be valid JSON');
      }
    }

    if (newAdSet.startTime && newAdSet.endTime) {
      const start = new Date(newAdSet.startTime);
      const end = new Date(newAdSet.endTime);
      if (end <= start) {
        errors.push('End time must be after start time');
      }
    }

    return errors;
  };

  const handleCreateAdSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId) return;
    
    setCreating(true);
    setCreateError(null);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setCreateError(validationErrors.join('. '));
      setCreating(false);
      return;
    }

    try {
      const payload: any = {
        campaignId,
        name: newAdSet.name.trim(),
        optimizationGoal: newAdSet.optimizationGoal,
        billingEvent: newAdSet.billingEvent,
        bidStrategy: newAdSet.bidStrategy,
        dailyBudget: newAdSet.dailyBudget > 0 ? Number(newAdSet.dailyBudget) : 0,
        lifetimeBudget: newAdSet.lifetimeBudget > 0 ? Number(newAdSet.lifetimeBudget) : 0,
        status: newAdSet.status,
        targeting: newAdSet.targeting.trim(),
        promotedObject: newAdSet.promotedObject.trim(),
        startTime: newAdSet.startTime,
        endTime: newAdSet.endTime,
      };

      if (newAdSet.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || 
          newAdSet.bidStrategy === 'COST_CAP') {
        payload.bidAmount = Number(newAdSet.bidAmount);
      }

      await campaignService.createAdSet(campaignId, payload);
      
      setShowCreateModal(false);
      resetForm();
      setSuccessMessage('Ad set created successfully!');
      
      // Reload ad sets
      const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
      if (Array.isArray(adSetsResponse?.data)) {
        setAdSets(adSetsResponse.data);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create ad set');
    } finally {
      setCreating(false);
    }
  };

  const handleEditAdSet = (adSet: AdSet) => {
    setEditingAdSet(adSet);
    setNewAdSet({
      name: adSet.name,
      optimizationGoal: adSet.optimizationGoal || 'LINK_CLICKS',
      billingEvent: adSet.billingEvent || 'IMPRESSIONS',
      bidAmount: adSet.bidAmount || 0,
      bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
      dailyBudget: adSet.dailyBudget || 0,
      lifetimeBudget: adSet.lifetimeBudget || 0,
      status: adSet.status,
      targeting: adSet.targeting || JSON.stringify({
        geo_locations: { countries: ["US"] },
        age_min: 18,
        age_max: 65,
        publisher_platforms: ["facebook"],
        facebook_positions: ["feed"]
      }, null, 2),
      promotedObject: adSet.promotedObject || '',
      startTime: adSet.startTime?.slice(0, 16) || new Date().toISOString().slice(0, 16),
      endTime: adSet.endTime?.slice(0, 16) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
    setShowEditModal(true);
  };

  const handleUpdateAdSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId || !editingAdSet) return;
    
    setCreating(true);
    setCreateError(null);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setCreateError(validationErrors.join('. '));
      setCreating(false);
      return;
    }

    try {
      const payload: any = {
        name: newAdSet.name.trim(),
        optimizationGoal: newAdSet.optimizationGoal,
        billingEvent: newAdSet.billingEvent,
        bidStrategy: newAdSet.bidStrategy,
        dailyBudget: newAdSet.dailyBudget > 0 ? Number(newAdSet.dailyBudget) : 0,
        lifetimeBudget: newAdSet.lifetimeBudget > 0 ? Number(newAdSet.lifetimeBudget) : 0,
        status: newAdSet.status,
        targeting: newAdSet.targeting.trim(),
        promotedObject: newAdSet.promotedObject.trim(),
        startTime: newAdSet.startTime,
        endTime: newAdSet.endTime,
      };

      if (newAdSet.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || 
          newAdSet.bidStrategy === 'COST_CAP') {
        payload.bidAmount = Number(newAdSet.bidAmount);
      }

      await campaignService.updateAdSet(editingAdSet._id, payload);
      
      setShowEditModal(false);
      setEditingAdSet(null);
      resetForm();
      setSuccessMessage('Ad set updated successfully!');
      
      // Reload ad sets
      const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
      if (Array.isArray(adSetsResponse?.data)) {
        setAdSets(adSetsResponse.data);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to update ad set');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdSet = async (adSet: AdSet) => {
    if (!window.confirm(`Are you sure you want to delete "${adSet.name}"?`)) {
      return;
    }

    setActionLoading(adSet._id);
    try {
      await campaignService.deleteAdSet(adSet._id);
      setSuccessMessage('Ad set deleted successfully!');
      
      // Reload ad sets
      if (campaignId) {
        const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
        if (Array.isArray(adSetsResponse?.data)) {
          setAdSets(adSetsResponse.data);
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete ad set');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (adSet: AdSet) => {
    setActionLoading(adSet._id);
    try {
      const newStatus = adSet.status.toLowerCase() === 'active' ? 'PAUSED' : 'ACTIVE';
      await campaignService.updateAdSet(adSet._id, { status: newStatus });
      setSuccessMessage(`Ad set ${newStatus.toLowerCase()} successfully!`);
      
      // Reload ad sets
      if (campaignId) {
        const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
        if (Array.isArray(adSetsResponse?.data)) {
          setAdSets(adSetsResponse.data);
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update ad set status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewAds = (adSet: AdSet) => {
    navigate(`/dashboard/campaigns/${campaignId}/adsets/${adSet._id}/ads`);
  };

  const handleDuplicate = async (adSet: AdSet) => {
    if (!campaignId) return;
    
    setActionLoading(adSet._id);
    try {
      const payload: any = {
        campaignId,
        name: `${adSet.name} (Copy)`,
        optimizationGoal: adSet.optimizationGoal,
        billingEvent: adSet.billingEvent,
        bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
        dailyBudget: adSet.dailyBudget || 0,
        lifetimeBudget: adSet.lifetimeBudget || 0,
        status: 'PAUSED',
        targeting: adSet.targeting || JSON.stringify({
          geo_locations: { countries: ["US"] },
          age_min: 18,
          age_max: 65,
          publisher_platforms: ["facebook"],
          facebook_positions: ["feed"]
        }),
        promotedObject: adSet.promotedObject || '',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      };

      if (adSet.bidAmount) {
        payload.bidAmount = adSet.bidAmount;
      }

      await campaignService.createAdSet(campaignId, payload);
      setSuccessMessage('Ad set duplicated successfully!');
      
      // Reload ad sets
      const adSetsResponse = await campaignService.getAdSetsByCampaign(campaignId);
      if (Array.isArray(adSetsResponse?.data)) {
        setAdSets(adSetsResponse.data);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to duplicate ad set');
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setNewAdSet({
      name: '',
      optimizationGoal: 'LINK_CLICKS',
      billingEvent: 'IMPRESSIONS',
      bidAmount: 0,
      bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
      dailyBudget: 0,
      lifetimeBudget: 0,
      status: 'PAUSED',
      targeting: JSON.stringify({
        geo_locations: { countries: ["US"] },
        age_min: 18,
        age_max: 65,
        publisher_platforms: ["facebook"],
        facebook_positions: ["feed"]
      }, null, 2),
      promotedObject: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
  };

  const getSafeBillingEvents = () => {
    const safeBillingEvents = ['IMPRESSIONS', 'LINK_CLICKS', 'POST_ENGAGEMENT'];
    return BILLING_EVENTS.filter(event => safeBillingEvents.includes(event));
  };

  const renderAdSetForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleUpdateAdSet : handleCreateAdSet} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
        <input 
          type="text" 
          className="w-full border rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500" 
          value={newAdSet.name} 
          onChange={e => setNewAdSet({ ...newAdSet, name: e.target.value })} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Optimization Goal</label>
          <select 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.optimizationGoal} 
            onChange={e => setNewAdSet({ ...newAdSet, optimizationGoal: e.target.value })} 
            required
          >
            <option value="">Select goal</option>
            {OPTIMIZATION_GOALS.map(goal => (
              <option key={goal} value={goal}>{goal.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Event</label>
          <select 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.billingEvent} 
            onChange={e => setNewAdSet({ ...newAdSet, billingEvent: e.target.value })} 
            required
          >
            <option value="">Select event</option>
            {BILLING_EVENTS.map(event => {
              const isSafe = getSafeBillingEvents().includes(event);
              return (
                <option key={event} value={event}>
                  {event.replace(/_/g, ' ')} {isSafe ? '✓' : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bid Strategy</label>
          <select 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.bidStrategy} 
            onChange={e => setNewAdSet({ 
              ...newAdSet, 
              bidStrategy: e.target.value,
              bidAmount: e.target.value === 'LOWEST_COST_WITHOUT_CAP' ? 0 : newAdSet.bidAmount
            })} 
            required
          >
            {BID_STRATEGIES.map(strategy => (
              <option key={strategy.value} value={strategy.value}>{strategy.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bid Amount ($)</label>
          <input 
            type="number" 
            className={`w-full border rounded-lg px-4 py-2 text-sm ${
              newAdSet.bidStrategy === 'LOWEST_COST_WITHOUT_CAP' 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : ''
            }`} 
            value={newAdSet.bidAmount} 
            onChange={e => setNewAdSet({ ...newAdSet, bidAmount: Number(e.target.value) })} 
            min={0}
            step={0.01}
            disabled={newAdSet.bidStrategy === 'LOWEST_COST_WITHOUT_CAP'}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.status} 
            onChange={e => setNewAdSet({ ...newAdSet, status: e.target.value })}
          >
            <option value="PAUSED">Paused</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Budget ($)</label>
          <input 
            type="number" 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.dailyBudget} 
            onChange={e => setNewAdSet({ 
              ...newAdSet, 
              dailyBudget: Number(e.target.value),
              lifetimeBudget: Number(e.target.value) > 0 ? 0 : newAdSet.lifetimeBudget
            })} 
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lifetime Budget ($)</label>
          <input 
            type="number" 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.lifetimeBudget} 
            onChange={e => setNewAdSet({ 
              ...newAdSet, 
              lifetimeBudget: Number(e.target.value),
              dailyBudget: Number(e.target.value) > 0 ? 0 : newAdSet.dailyBudget
            })} 
            min={0}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
          <input 
            type="datetime-local" 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.startTime} 
            onChange={e => setNewAdSet({ ...newAdSet, startTime: e.target.value })} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time</label>
          <input 
            type="datetime-local" 
            className="w-full border rounded-lg px-4 py-2 text-sm" 
            value={newAdSet.endTime} 
            onChange={e => setNewAdSet({ ...newAdSet, endTime: e.target.value })} 
            required 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Targeting (JSON)
          <span className="text-gray-500 font-normal ml-1">- Define your audience</span>
        </label>
        <textarea 
          className="w-full border rounded-lg px-4 py-2 font-mono text-xs" 
          value={newAdSet.targeting} 
          onChange={e => setNewAdSet({ ...newAdSet, targeting: e.target.value })} 
          rows={3}
          placeholder='{"geo_locations": {"countries": ["US"]}, "age_min": 18, "age_max": 65}'
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Must include geo_locations with countries array. Example: US, CA, GB
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Promoted Object (JSON) - Optional
          <span className="text-gray-500 font-normal ml-1">- Link to your page/app</span>
        </label>
        <textarea 
          className="w-full border rounded-lg px-4 py-2 font-mono text-xs" 
          value={newAdSet.promotedObject} 
          onChange={e => setNewAdSet({ ...newAdSet, promotedObject: e.target.value })} 
          rows={2}
          placeholder='{"page_id": "your_page_id"} or leave empty'
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional. Use your Facebook page ID or app ID if promoting specific content
        </p>
      </div>
      
      {createError && (
        <div className="text-red-600 text-sm font-semibold">{createError}</div>
      )}
      
      <div className="flex justify-end gap-3 mt-6">
        <Button 
          variant="secondary" 
          onClick={() => {
            if (isEdit) {
              setShowEditModal(false);
              setEditingAdSet(null);
            } else {
              setShowCreateModal(false);
            }
            resetForm();
          }} 
          type="button"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={creating}
        >
          {isEdit ? 'Update' : 'Create'} Ad Set
        </Button>
      </div>
    </form>
  );

  if (!campaignId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
        <Button onClick={() => navigate('/dashboard/campaigns')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/campaigns')}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ad Sets</h1>
              <p className="text-gray-600">{campaignName}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                {summaryStats.totalAdSets} Ad Sets ({summaryStats.activeAdSets} Active, {summaryStats.pausedAdSets} Paused)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Spend: ${summaryStats.totalSpend.toFixed(2)}
              </span>
            </div>
          </div>
            
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />} 
              onClick={() => setShowCreateModal(true)}
            >
              Create Ad Set
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summaryStats.totalImpressions.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summaryStats.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{summaryStats.averageCTR.toFixed(2)}%</div>
              <div className="text-sm text-gray-500">Average CTR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">${summaryStats.totalDailyBudget.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Daily Budget</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search ad sets..."
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
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading ad sets...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Ad Sets Grid */}
        {!loading && !error && (
          <>
            {filteredAdSets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAdSets.map((adSet) => (
                  <AdSetCard
                    key={adSet._id}
                    adSet={adSet}
                    onEdit={handleEditAdSet}
                    onDelete={handleDeleteAdSet}
                    onToggleStatus={handleToggleStatus}
                    onDuplicate={handleDuplicate}
                    onViewAds={handleViewAds}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Target size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ad sets found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No ad sets match your search criteria.'
                    : 'Get started by creating your first ad set for this campaign.'}
                </p>
                <Button 
                  variant="primary" 
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Ad Set
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold text-gray-900">Create Ad Set</h3>
              </div>
              <div className="p-6">
                {renderAdSetForm()}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <h3 className="text-2xl font-bold text-gray-900">Edit Ad Set</h3>
              </div>
              <div className="p-6">
                {renderAdSetForm(true)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
