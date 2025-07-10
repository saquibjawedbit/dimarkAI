import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { campaignService, Campaign as BackendCampaign } from '../../services/campaign';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign: BackendCampaign | null;
}

export const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  campaign,
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    objective: campaign?.objective || 'LINK_CLICKS',
    status: campaign?.status || 'PAUSED',
    dailyBudget: campaign?.dailyBudget || 0,
    lifetimeBudget: campaign?.lifetimeBudget || '',
    bidStrategy: campaign?.bidStrategy || 'LOWEST_COST_WITHOUT_CAP',
    startTime: campaign?.startTime ? campaign.startTime.split('T')[0] : '',
    endTime: campaign?.endTime ? campaign.endTime.split('T')[0] : '',
    targetingSpec: campaign?.targetingSpec || {
      ageMin: 18,
      ageMax: 65,
      genders: [1, 2],
      geoLocations: { countries: ['US'] },
    },
    facebookAdAccountId: campaign?.facebookAdAccountId || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        objective: campaign.objective || 'LINK_CLICKS',
        status: campaign.status || 'PAUSED',
        dailyBudget: campaign.dailyBudget || 0,
        lifetimeBudget: campaign.lifetimeBudget || '',
        bidStrategy: campaign.bidStrategy || 'LOWEST_COST_WITHOUT_CAP',
        startTime: campaign.startTime ? campaign.startTime.split('T')[0] : '',
        endTime: campaign.endTime ? campaign.endTime.split('T')[0] : '',
        targetingSpec: campaign.targetingSpec || {
          ageMin: 18,
          ageMax: 65,
          genders: [1, 2],
          geoLocations: { countries: ['US'] },
        },
        facebookAdAccountId: campaign.facebookAdAccountId || '',
      });
    }
  }, [campaign]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleTargetingChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      targetingSpec: {
        ...prev.targetingSpec,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!campaign) return;
      // Fix status type to only allow 'ACTIVE' | 'PAUSED'
      const updateData = {
        ...formData,
        status: formData.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED' as 'ACTIVE' | 'PAUSED',
      };
      await campaignService.updateCampaign(campaign._id, updateData as any);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Objective</label>
            <select
              name="objective"
              value={formData.objective}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 mt-1"
            >
              <option value="AWARENESS">Brand Awareness</option>
              <option value="TRAFFIC">Website Traffic</option>
              <option value="ENGAGEMENT">Post Engagement</option>
              <option value="LEADS">Lead Generation</option>
              <option value="APP_INSTALLS">App Installs</option>
              <option value="SALES">Sales & Conversions</option>
              <option value="LINK_CLICKS">Link Clicks</option>
              <option value="POST_ENGAGEMENT">Post Engagement</option>
              <option value="PAGE_LIKES">Page Likes</option>
              <option value="EVENT_RESPONSES">Event Responses</option>
              <option value="MESSAGES">Messages</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="CATALOG_SALES">Catalog Sales</option>
              <option value="STORE_TRAFFIC">Store Traffic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 mt-1"
            >
              <option value="PAUSED">Paused</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Budget</label>
            <Input
              name="dailyBudget"
              type="number"
              value={formData.dailyBudget}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lifetime Budget</label>
            <Input
              name="lifetimeBudget"
              type="number"
              value={formData.lifetimeBudget}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bid Strategy</label>
            <select
              name="bidStrategy"
              value={formData.bidStrategy}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 mt-1"
            >
              <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost (Automatic)</option>
              <option value="LOWEST_COST_WITH_BID_CAP">Lowest Cost with Bid Cap</option>
              <option value="TARGET_COST">Target Cost</option>
              <option value="COST_CAP">Cost Cap</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                name="startTime"
                type="date"
                value={formData.startTime}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <Input
                name="endTime"
                type="date"
                value={formData.endTime}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
          {/* Targeting fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Age</label>
              <Input
                type="number"
                value={formData.targetingSpec?.ageMin || 18}
                onChange={e => handleTargetingChange('ageMin', parseInt(e.target.value) || 18)}
                min="13"
                max="65"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Age</label>
              <Input
                type="number"
                value={formData.targetingSpec?.ageMax || 65}
                onChange={e => handleTargetingChange('ageMax', parseInt(e.target.value) || 65)}
                min="13"
                max="65"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.targetingSpec?.genders?.includes(1)}
                  onChange={e => {
                    const genders = formData.targetingSpec?.genders || [];
                    if (e.target.checked) {
                      handleTargetingChange('genders', [...genders.filter((g: number) => g !== 1), 1]);
                    } else {
                      handleTargetingChange('genders', genders.filter((g: number) => g !== 1));
                    }
                  }}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.targetingSpec?.genders?.includes(2)}
                  onChange={e => {
                    const genders = formData.targetingSpec?.genders || [];
                    if (e.target.checked) {
                      handleTargetingChange('genders', [...genders.filter((g: number) => g !== 2), 2]);
                    } else {
                      handleTargetingChange('genders', genders.filter((g: number) => g !== 2));
                    }
                  }}
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Countries</label>
            <Input
              type="text"
              value={formData.targetingSpec?.geoLocations?.countries?.join(', ') || ''}
              onChange={e => {
                const countries = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                handleTargetingChange('geoLocations', {
                  ...formData.targetingSpec?.geoLocations,
                  countries,
                });
              }}
              placeholder="US, CA, GB (country codes separated by commas)"
              className="mt-1"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 p-6 border-t">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};
