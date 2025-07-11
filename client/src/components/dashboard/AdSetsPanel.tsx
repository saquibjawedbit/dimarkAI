import React, { useEffect, useState } from 'react';
import { OPTIMIZATION_GOALS } from '../../constants/optimizationGoals';
import { BILLING_EVENTS } from '../../constants/billingEvents';
import { BID_STRATEGIES } from '../../constants/bidStrategies';
import { Button } from '../ui/Button';
import { campaignService } from '../../services/campaign';
import { Plus } from 'lucide-react';

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

interface AdSetsPanelProps {
  campaignId: string;
  campaignName: string;
  onClose: () => void;
}

// Helper function to get safe billing events for new Facebook accounts
const getSafeBillingEvents = () => {
  // These are typically available to new accounts immediately
  const safeBillingEvents = [
    'IMPRESSIONS',
    'LINK_CLICKS',
    'POST_ENGAGEMENT'
  ];
  
  // Return intersection of safe events and available events
  return BILLING_EVENTS.filter(event => safeBillingEvents.includes(event));
};

// Validation functions
const validateAdSetForm = (formData: CreateAdSetFormData): string[] => {
  const errors: string[] = [];

  // Required fields
  if (!formData.name.trim()) {
    errors.push('Ad set name is required');
  }
  if (!formData.optimizationGoal) {
    errors.push('Optimization goal is required');
  }
  if (!formData.billingEvent) {
    errors.push('Billing event is required');
  }
  if (!formData.bidStrategy) {
    errors.push('Bid strategy is required');
  }
  if (!formData.startTime) {
    errors.push('Start time is required');
  }
  if (!formData.endTime) {
    errors.push('End time is required');
  }

  // Billing event validation for new accounts
  const safeBillingEvents = getSafeBillingEvents();
  if (formData.billingEvent && !safeBillingEvents.includes(formData.billingEvent)) {
    errors.push('Selected billing event may not be available for new Facebook accounts. Try IMPRESSIONS, LINK_CLICKS, or POST_ENGAGEMENT.');
  }

  // Budget validation - allow zero budgets if campaign has budget
  const hasBudget = formData.dailyBudget > 0 || formData.lifetimeBudget > 0;
  
  if (!hasBudget) {
    // This is OK - campaign might have budget, so we'll allow zero budgets
    // but add a note for the user
  }
  
  if (formData.dailyBudget > 0 && formData.lifetimeBudget > 0) {
    errors.push('Choose either daily budget OR lifetime budget, not both');
  }
  if (formData.dailyBudget > 0 && formData.dailyBudget < 1) {
    errors.push('Daily budget must be at least $1');
  }
  if (formData.lifetimeBudget > 0 && formData.lifetimeBudget < 10) {
    errors.push('Lifetime budget must be at least $10');
  }

  // Bid amount validation based on strategy
  if (formData.bidStrategy === 'LOWEST_COST_WITHOUT_CAP') {
    // No bid amount should be set for this strategy
    if (formData.bidAmount > 0) {
      errors.push('Bid amount cannot be set with "LOWEST_COST_WITHOUT_CAP" strategy');
    }
  } else if (formData.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || formData.bidStrategy === 'COST_CAP') {
    // Bid amount is required for these strategies
    if (!formData.bidAmount || formData.bidAmount <= 0) {
      errors.push('Bid amount is required for "LOWEST_COST_WITH_BID_CAP" and "COST_CAP" strategies');
    }
  }
  
  // General bid amount validation
  if (formData.bidAmount < 0) {
    errors.push('Bid amount cannot be negative');
  }

  // Date validation
  if (formData.startTime && formData.endTime) {
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (end <= start) {
      errors.push('End time must be after start time');
    }
  }

  // Targeting validation - only validate if targeting is provided
  if (formData.targeting.trim()) {
    try {
      const targeting = JSON.parse(formData.targeting);
      if (!targeting.geo_locations || !targeting.geo_locations.countries) {
        errors.push('Targeting must include geo_locations with countries');
      }
    } catch (e) {
      errors.push('Targeting must be valid JSON');
    }
  } else {
    errors.push('Targeting is required');
  }

  // Promoted object validation (if provided) - this is optional
  if (formData.promotedObject.trim()) {
    try {
      const promotedObj = JSON.parse(formData.promotedObject);
      if (promotedObj.page_id && (promotedObj.page_id.includes('<') || promotedObj.page_id.includes('>'))) {
        errors.push('Promoted object contains placeholder values. Use real IDs or leave empty.');
      }
    } catch (e) {
      errors.push('Promoted object must be valid JSON');
    }
  }

  return errors;
};

export const AdSetsPanel: React.FC<AdSetsPanelProps> = ({ campaignId, campaignName, onClose }) => {
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdSet, setNewAdSet] = useState<CreateAdSetFormData>({
    name: '',
    optimizationGoal: 'LINK_CLICKS', // Safer default for new accounts
    billingEvent: 'IMPRESSIONS', // Safer default for new accounts
    bidAmount: 0, // Will be controlled by bid strategy
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP', // Default strategy
    dailyBudget: 0, // Start with 0 - user can set if campaign has no budget
    lifetimeBudget: 0, // Start with 0 - user can set if campaign has no budget
    status: 'PAUSED', // Always start paused for safety
    targeting: JSON.stringify({
      geo_locations: { countries: ["US"] },
      age_min: 18,
      age_max: 65,
      publisher_platforms: ["facebook"],
      facebook_positions: ["feed"]
    }, null, 2),
    promotedObject: '',
    startTime: new Date().toISOString().slice(0, 16), // Current date/time
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 30 days from now
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdSets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await campaignService.getAdSetsByCampaign(campaignId);
        if (Array.isArray(response?.data)) {
          setAdSets(response.data);
        } else if (Array.isArray(response)) {
          setAdSets(response);
        } else {
          setAdSets([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load ad sets');
      } finally {
        setLoading(false);
      }
    };
    fetchAdSets();
  }, [campaignId, showCreateModal]);

  const handleCreateAdSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    // Validate form data
    const validationErrors = validateAdSetForm(newAdSet);
    if (validationErrors.length > 0) {
      setCreateError(validationErrors.join('. '));
      setCreating(false);
      return;
    }

    try {
      // Compose payload according to CreateAdSetRequest
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

      // Only add bid amount if it's required for the strategy
      if (newAdSet.bidStrategy === 'LOWEST_COST_WITH_BID_CAP' || 
          newAdSet.bidStrategy === 'COST_CAP' || 
          (newAdSet.bidStrategy === 'LOWEST_COST_WITH_MIN_ROAS' && newAdSet.bidAmount > 0)) {
        payload.bidAmount = Number(newAdSet.bidAmount);
      }
      // For LOWEST_COST_WITHOUT_CAP, don't include bidAmount at all
      // IMPORTANT: Do not send bidAmount even if it's 0

      console.log('Creating ad set with payload:', payload);
      console.log('Bid strategy:', newAdSet.bidStrategy, 'Bid amount:', newAdSet.bidAmount, 'Including bidAmount in payload:', 'bidAmount' in payload);
      await campaignService.createAdSet(campaignId, payload);
      
      setShowCreateModal(false);
      // Reset form to safer defaults
      setNewAdSet({
        name: '',
        optimizationGoal: 'LINK_CLICKS', // Safer default
        billingEvent: 'IMPRESSIONS', // Safer default
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
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create ad set');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border border-gray-200">
        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-extrabold mb-6 text-primary-700">Ad Sets for: <span className="text-gray-900">{campaignName}</span></h2>
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-gray-500 text-lg">Manage and create ad sets for this campaign.</span>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />} className="px-5 py-2.5 font-semibold" onClick={() => setShowCreateModal(true)}>
            Create Ad Set
          </Button>
        </div>
        {loading && <div className="py-12 text-center"><div className="w-10 h-10 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div><span className="text-lg text-gray-600">Loading ad sets...</span></div>}
        {error && <div className="text-red-600 mb-4 text-lg font-medium">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden shadow-lg bg-white">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-5 py-3 border text-left text-primary-700 font-semibold">Name</th>
                  <th className="px-5 py-3 border text-left text-primary-700 font-semibold">Status</th>
                  <th className="px-5 py-3 border text-left text-primary-700 font-semibold">Budget</th>
                  <th className="px-5 py-3 border text-left text-primary-700 font-semibold">Start</th>
                  <th className="px-5 py-3 border text-left text-primary-700 font-semibold">End</th>
                </tr>
              </thead>
              <tbody>
                {adSets.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-lg text-gray-500">No ad sets found.</td></tr>
                ) : (
                  adSets.map(adSet => (
                    <tr key={adSet._id} className="hover:bg-primary-50 transition cursor-pointer">
                      <td className="px-5 py-3 border font-semibold text-gray-900">{adSet.name}</td>
                      <td className="px-5 py-3 border">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${adSet.status === 'active' || adSet.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{adSet.status}</span>
                      </td>
                      <td className="px-5 py-3 border text-primary-700 font-semibold">${adSet.budget}</td>
                      <td className="px-5 py-3 border text-gray-700">{adSet.startTime?.split('T')[0]}</td>
                      <td className="px-5 py-3 border text-gray-700">{adSet.endTime?.split('T')[0]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="secondary" className="px-5 py-2.5 font-semibold" onClick={onClose}>Back to Campaigns</Button>
        </div>

        {/* Create AdSet Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowCreateModal(false)}>&times;</button>
                <h3 className="text-2xl font-bold text-primary-700">Create Ad Set</h3>
              </div>
              <div className="p-6">
              <form onSubmit={handleCreateAdSet} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500" value={newAdSet.name} onChange={e => setNewAdSet({ ...newAdSet, name: e.target.value })} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Optimization Goal</label>
                    <select className="w-full border rounded-lg px-4 py-2 text-sm" value={newAdSet.optimizationGoal} onChange={e => setNewAdSet({ ...newAdSet, optimizationGoal: e.target.value })} required>
                      <option value="">Select goal</option>
                      {OPTIMIZATION_GOALS.map(goal => (
                        <option key={goal} value={goal}>{goal.replace(/_/g, ' ').replace('NONE', 'None')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Event</label>
                    <select className="w-full border rounded-lg px-4 py-2 text-sm" value={newAdSet.billingEvent} onChange={e => setNewAdSet({ ...newAdSet, billingEvent: e.target.value })} required>
                      <option value="">Select event</option>
                      {BILLING_EVENTS.map(event => {
                        const isSafe = getSafeBillingEvents().includes(event);
                        return (
                          <option key={event} value={event}>
                            {event.replace(/_/g, ' ').replace('NONE', 'None')}
                            {isSafe ? ' ✓' : ' (may require established account)'}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      New accounts should use IMPRESSIONS, LINK_CLICKS, or POST_ENGAGEMENT
                    </p>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bid Amount ($)
                    </label>
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
                      placeholder="0.50"
                      disabled={newAdSet.bidStrategy === 'LOWEST_COST_WITHOUT_CAP'}
                      aria-label="Bid amount - disabled for LOWEST_COST_WITHOUT_CAP strategy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select className="w-full border rounded-lg px-4 py-2 text-sm" value={newAdSet.status} onChange={e => setNewAdSet({ ...newAdSet, status: e.target.value })}>
                      <option value="PAUSED">Paused</option>
                      <option value="ACTIVE">Active</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Bid Strategy:</strong> No Cap = Facebook optimizes freely, Bid Cap = Set max bid, Cost Cap = Control avg cost
                  </p>
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
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Min $1 (or use lifetime)</p>
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
                      placeholder="300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Min $10 (or use daily)</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Budget Note:</strong> If the campaign has a budget set, ad set budgets will be ignored by Facebook. You can leave both fields at 0 if the campaign controls the budget.
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs text-orange-800">
                    <strong>New Account Note:</strong> If your Facebook business account is new, some billing events may not be available immediately. Facebook requires new accounts to follow policies for several weeks before accessing all options.
                  </p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Targeting (JSON)</label>
                  <textarea 
                    className="w-full border rounded-lg px-4 py-2 font-mono text-xs" 
                    value={newAdSet.targeting} 
                    onChange={e => setNewAdSet({ ...newAdSet, targeting: e.target.value })} 
                    rows={3}
                    placeholder='{"geo_locations": {"countries": ["US"]}, "age_min": 18, "age_max": 65}'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Promoted Object (JSON) - Optional</label>
                  <textarea 
                    className="w-full border rounded-lg px-4 py-2 font-mono text-xs" 
                    value={newAdSet.promotedObject} 
                    onChange={e => setNewAdSet({ ...newAdSet, promotedObject: e.target.value })} 
                    rows={2}
                    placeholder='{"page_id": "your_page_id"} or leave empty'
                  />
                </div>
                {createError && <div className="text-red-600 text-sm font-semibold">{createError}</div>}
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="secondary" className="px-5 py-2.5 font-semibold" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                  <Button variant="primary" type="submit" isLoading={creating} className="px-5 py-2.5 font-semibold">Create</Button>
                </div>
              </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
