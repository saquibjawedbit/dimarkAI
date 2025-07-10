import React, { useEffect, useState } from 'react';
import { OPTIMIZATION_GOALS } from '../../constants/optimizationGoals';
import { BILLING_EVENTS } from '../../constants/billingEvents';
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
  dailyBudget: number;
  lifetimeBudget: number;
  status: string;
  targeting: string;
  promotedObject: string;
  facebookAdAccountId: string;
  startTime: string;
  endTime: string;
}

interface AdSetsPanelProps {
  campaignId: string;
  campaignName: string;
  onClose: () => void;
}

export const AdSetsPanel: React.FC<AdSetsPanelProps> = ({ campaignId, campaignName, onClose }) => {
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdSet, setNewAdSet] = useState<CreateAdSetFormData>({
    name: '',
    optimizationGoal: '',
    billingEvent: '',
    bidAmount: 0,
    dailyBudget: 0,
    lifetimeBudget: 0,
    status: 'ACTIVE',
    targeting: '',
    promotedObject: '',
    facebookAdAccountId: '',
    startTime: '',
    endTime: '',
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
    try {
      // Compose payload according to CreateAdSetRequest
      const payload = {
        campaignId,
        name: newAdSet.name,
        optimizationGoal: newAdSet.optimizationGoal,
        billingEvent: newAdSet.billingEvent,
        bidAmount: Number(newAdSet.bidAmount),
        dailyBudget: Number(newAdSet.dailyBudget),
        lifetimeBudget: Number(newAdSet.lifetimeBudget),
        status: newAdSet.status,
        targeting: newAdSet.targeting,
        promotedObject: newAdSet.promotedObject,
        facebookAdAccountId: newAdSet.facebookAdAccountId,
        startTime: newAdSet.startTime,
        endTime: newAdSet.endTime,
      };
      await campaignService.createAdSet(campaignId, payload);
      setShowCreateModal(false);
      setNewAdSet({
        name: '', optimizationGoal: '', billingEvent: '', bidAmount: 0, dailyBudget: 0, lifetimeBudget: 0,
        status: 'ACTIVE', targeting: '', promotedObject: '', facebookAdAccountId: '', startTime: '', endTime: ''
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-200">
              <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowCreateModal(false)}>&times;</button>
              <h3 className="text-2xl font-bold mb-6 text-primary-700">Create Ad Set</h3>
              <form onSubmit={handleCreateAdSet} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500" value={newAdSet.name} onChange={e => setNewAdSet({ ...newAdSet, name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Optimization Goal</label>
                    <select className="w-full border rounded-lg px-4 py-2" value={newAdSet.optimizationGoal} onChange={e => setNewAdSet({ ...newAdSet, optimizationGoal: e.target.value })} required>
                      <option value="">Select optimization goal</option>
                      {OPTIMIZATION_GOALS.map(goal => (
                        <option key={goal} value={goal}>{goal.replace(/_/g, ' ').replace('NONE', 'None')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Event</label>
                    <select className="w-full border rounded-lg px-4 py-2" value={newAdSet.billingEvent} onChange={e => setNewAdSet({ ...newAdSet, billingEvent: e.target.value })} required>
                      <option value="">Select billing event</option>
                      {BILLING_EVENTS.map(event => (
                        <option key={event} value={event}>{event.replace(/_/g, ' ').replace('NONE', 'None')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bid Amount</label>
                    <input type="number" className="w-full border rounded-lg px-4 py-2" value={newAdSet.bidAmount} onChange={e => setNewAdSet({ ...newAdSet, bidAmount: Number(e.target.value) })} min={0} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Budget</label>
                    <input type="number" className="w-full border rounded-lg px-4 py-2" value={newAdSet.dailyBudget} onChange={e => setNewAdSet({ ...newAdSet, dailyBudget: Number(e.target.value) })} min={0} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lifetime Budget</label>
                    <input type="number" className="w-full border rounded-lg px-4 py-2" value={newAdSet.lifetimeBudget} onChange={e => setNewAdSet({ ...newAdSet, lifetimeBudget: Number(e.target.value) })} min={0} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select className="w-full border rounded-lg px-4 py-2" value={newAdSet.status} onChange={e => setNewAdSet({ ...newAdSet, status: e.target.value })}>
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Targeting (JSON)</label>
                  <textarea className="w-full border rounded-lg px-4 py-2" value={newAdSet.targeting} onChange={e => setNewAdSet({ ...newAdSet, targeting: e.target.value })} rows={2} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Promoted Object (JSON)</label>
                  <textarea className="w-full border rounded-lg px-4 py-2" value={newAdSet.promotedObject} onChange={e => setNewAdSet({ ...newAdSet, promotedObject: e.target.value })} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Ad Account ID</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={newAdSet.facebookAdAccountId} onChange={e => setNewAdSet({ ...newAdSet, facebookAdAccountId: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full border rounded-lg px-4 py-2" value={newAdSet.startTime} onChange={e => setNewAdSet({ ...newAdSet, startTime: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full border rounded-lg px-4 py-2" value={newAdSet.endTime} onChange={e => setNewAdSet({ ...newAdSet, endTime: e.target.value })} required />
                  </div>
                </div>
                {createError && <div className="text-red-600 text-sm font-semibold">{createError}</div>}
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="secondary" className="px-5 py-2.5 font-semibold" onClick={() => setShowCreateModal(false)} type="button">Cancel</Button>
                  <Button variant="primary" type="submit" isLoading={creating} className="px-5 py-2.5 font-semibold">Create</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
