import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from './Button';
import { adService, CreateAdRequest } from '../../services/ad';
import { creativeService } from '../../services/creative';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedAdsetId?: string;
  preselectedCreativeId?: string;
  adsets?: Array<{ _id: string; name: string; status: string }>;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedAdsetId,
  preselectedCreativeId,
  adsets: providedAdsets = []
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adsets, setAdsets] = useState<any[]>(providedAdsets);
  const [creatives, setCreatives] = useState<any[]>([]);
  const [creativesLoading, setCreativesLoading] = useState(false);

  const [formData, setFormData] = useState<CreateAdRequest>({
    name: '',
    adsetId: preselectedAdsetId || '',
    creativeId: preselectedCreativeId || '',
    status: 'PAUSED',
    conversionDomain: '',
    adLabels: [],
    adScheduleStartTime: '',
    adScheduleEndTime: ''
  });

  // Load creatives when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCreatives();
    }
  }, [isOpen]);

  // Update adsets when provided adsets change
  useEffect(() => {
    setAdsets(providedAdsets);
  }, [providedAdsets]);

  // Update form when preselected values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      adsetId: preselectedAdsetId || prev.adsetId,
      creativeId: preselectedCreativeId || prev.creativeId
    }));
  }, [preselectedAdsetId, preselectedCreativeId]);

  const loadCreatives = async () => {
    try {
      setCreativesLoading(true);
      const response = await creativeService.getCreatives({
        limit: 100,
        fields: ['id', 'name', 'status']
      });
      
      if (response?.data) {
        setCreatives(response.data);
      }
    } catch (err: any) {
      console.error('Failed to load creatives:', err);
    } finally {
      setCreativesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Ad name is required');
      return;
    }
    
    if (!formData.adsetId) {
      setError('Please select an ad set');
      return;
    }
    
    if (!formData.creativeId) {
      setError('Please select a creative');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare the data
      const adData: CreateAdRequest = {
        name: formData.name.trim(),
        adsetId: formData.adsetId,
        creativeId: formData.creativeId,
        status: formData.status,
        conversionDomain: formData.conversionDomain || undefined,
        adScheduleStartTime: formData.adScheduleStartTime || undefined,
        adScheduleEndTime: formData.adScheduleEndTime || undefined
      };

      console.log('Creating ad with data:', adData);

      const response = await adService.createAd(adData);
      
      if (response.data) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError('Failed to create ad');
      }
    } catch (err: any) {
      console.error('CreateAdModal handleSubmit error:', err);
      setError(err.message || 'An error occurred while creating the ad');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      adsetId: preselectedAdsetId || '',
      creativeId: preselectedCreativeId || '',
      status: 'PAUSED',
      conversionDomain: '',
      adLabels: [],
      adScheduleStartTime: '',
      adScheduleEndTime: ''
    });
    setError(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Ad</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter ad name"
                  />
                </div>

                <div>
                  <label htmlFor="adsetId" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Set *
                  </label>
                  <select
                    id="adsetId"
                    required
                    disabled={!!preselectedAdsetId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    value={formData.adsetId}
                    onChange={(e) => setFormData({ ...formData, adsetId: e.target.value })}
                  >
                    <option value="">
                      Select an ad set
                    </option>
                    {adsets.map((adset) => (
                      <option key={adset._id} value={adset._id}>
                        {adset.name} - {adset.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="creativeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Creative *
                  </label>
                  <select
                    id="creativeId"
                    required
                    disabled={creativesLoading || !!preselectedCreativeId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    value={formData.creativeId}
                    onChange={(e) => setFormData({ ...formData, creativeId: e.target.value })}
                  >
                    <option value="">
                      {creativesLoading ? 'Loading creatives...' : 'Select a creative'}
                    </option>
                    {creatives.map((creative) => (
                      <option key={creative.id} value={creative.id}>
                        {creative.name} - {creative.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="PAUSED">Paused</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended to start as Paused and activate after review
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Settings</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="conversionDomain" className="block text-sm font-medium text-gray-700 mb-1">
                    Conversion Domain
                  </label>
                  <input
                    type="text"
                    id="conversionDomain"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.conversionDomain}
                    onChange={(e) => setFormData({ ...formData, conversionDomain: e.target.value })}
                    placeholder="example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Domain where conversions happen (optional)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adScheduleStartTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Start
                    </label>
                    <input
                      type="datetime-local"
                      id="adScheduleStartTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.adScheduleStartTime}
                      onChange={(e) => setFormData({ ...formData, adScheduleStartTime: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="adScheduleEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule End
                    </label>
                    <input
                      type="datetime-local"
                      id="adScheduleEndTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.adScheduleEndTime}
                      onChange={(e) => setFormData({ ...formData, adScheduleEndTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !formData.name.trim() || !formData.adsetId || !formData.creativeId}
              leftIcon={loading ? undefined : <Plus size={16} />}
            >
              {loading ? 'Creating...' : 'Create Ad'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
