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
    dailyBudget: campaign?.dailyBudget || 0,
    // Add other fields as needed
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        dailyBudget: campaign.dailyBudget || 0,
        // Add other fields as needed
      });
    }
  }, [campaign]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!campaign) return;
      await campaignService.updateCampaign(campaign._id, formData);
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
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
            <label className="block text-sm font-medium text-gray-700">Daily Budget</label>
            <Input
              name="dailyBudget"
              type="number"
              value={formData.dailyBudget}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          {/* Add more fields as needed */}
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
