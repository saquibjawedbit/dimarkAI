import React, { useState } from 'react';
import { X, Target, DollarSign, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { campaignService, CreateCampaignRequest } from '../../services/campaign';
import { CAMPAIGN_OBJECTIVES } from '../../constants/campaign';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BID_STRATEGIES = [
  { value: 'LOWEST_COST_WITHOUT_CAP', label: 'Lowest Cost (Automatic)' },
  { value: 'LOWEST_COST_WITH_BID_CAP', label: 'Lowest Cost with Bid Cap' },
  { value: 'TARGET_COST', label: 'Target Cost' },
  { value: 'COST_CAP', label: 'Cost Cap' },
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    name: '',
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED',
    dailyBudget: 50,
    bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
    facebookAdAccountId: 'act_123456789', // TODO: Get from user's connected Facebook ad accounts
    startTime: new Date().toISOString().split('T')[0],
    targetingSpec: {
      ageMin: 18,
      ageMax: 65,
      genders: [1, 2], // 1 = male, 2 = female
      geoLocations: {
        countries: ['US'],
      },
    },
  });

  const handleInputChange = (field: keyof CreateCampaignRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTargetingChange = (field: string, value: any) => {
    setFormData(prev => ({
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
      // Convert date strings to ISO format if they exist
      const campaignData: CreateCampaignRequest = {
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
      };

      const response = await campaignService.createCampaign(campaignData);
      
      if (response.data) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          objective: 'OUTCOME_TRAFFIC',
          status: 'PAUSED',
          dailyBudget: 50,
          bidStrategy: 'LOWEST_COST_WITHOUT_CAP',
          facebookAdAccountId: 'act_123456789',
          startTime: new Date().toISOString().split('T')[0],
          targetingSpec: {
            ageMin: 18,
            ageMax: 65,
            genders: [1, 2],
            geoLocations: {
              countries: ['US'],
            },
          },
        });
        setCurrentStep(1);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create campaign. Please try again.');
      console.error('Campaign creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.objective;
      case 2:
        return formData.dailyBudget && formData.dailyBudget > 0;
      case 3:
        return true; // Targeting is optional
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Budget & Schedule</span>
            <span>Targeting</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary-600 mb-4">
                <Target size={20} />
                <h3 className="text-lg font-medium">Basic Campaign Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Objective *
                </label>
                <select
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  {CAMPAIGN_OBJECTIVES.map((objective) => (
                    <option key={objective.value} value={objective.value}>
                      {objective.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'ACTIVE' | 'PAUSED')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="PAUSED">Paused (Recommended)</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary-600 mb-4">
                <DollarSign size={20} />
                <h3 className="text-lg font-medium">Budget & Schedule</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Budget ($) *
                  </label>
                  <Input
                    type="number"
                    value={formData.dailyBudget || ''}
                    onChange={(e) => handleInputChange('dailyBudget', parseFloat(e.target.value) || 0)}
                    placeholder="50.00"
                    min="1"
                    step="0.01"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lifetime Budget ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.lifetimeBudget || ''}
                    onChange={(e) => handleInputChange('lifetimeBudget', parseFloat(e.target.value) || undefined)}
                    placeholder="Optional"
                    min="1"
                    step="0.01"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidding Strategy
                </label>
                <select
                  value={formData.bidStrategy}
                  onChange={(e) => handleInputChange('bidStrategy', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  {BID_STRATEGIES.map((strategy) => (
                    <option key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startTime?.split('T')[0] || ''}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={formData.endTime?.split('T')[0] || ''}
                    onChange={(e) => handleInputChange('endTime', e.target.value || undefined)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Targeting */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary-600 mb-4">
                <Settings size={20} />
                <h3 className="text-lg font-medium">Audience Targeting</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Age
                  </label>
                  <Input
                    type="number"
                    value={formData.targetingSpec?.ageMin || 18}
                    onChange={(e) => handleTargetingChange('ageMin', parseInt(e.target.value) || 18)}
                    min="13"
                    max="65"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Age
                  </label>
                  <Input
                    type="number"
                    value={formData.targetingSpec?.ageMax || 65}
                    onChange={(e) => handleTargetingChange('ageMax', parseInt(e.target.value) || 65)}
                    min="13"
                    max="65"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetingSpec?.genders?.includes(1)}
                      onChange={(e) => {
                        const genders = formData.targetingSpec?.genders || [];
                        if (e.target.checked) {
                          handleTargetingChange('genders', [...genders.filter(g => g !== 1), 1]);
                        } else {
                          handleTargetingChange('genders', genders.filter(g => g !== 1));
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
                      onChange={(e) => {
                        const genders = formData.targetingSpec?.genders || [];
                        if (e.target.checked) {
                          handleTargetingChange('genders', [...genders.filter(g => g !== 2), 2]);
                        } else {
                          handleTargetingChange('genders', genders.filter(g => g !== 2));
                        }
                      }}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countries
                </label>
                <Input
                  type="text"
                  value={formData.targetingSpec?.geoLocations?.countries?.join(', ') || ''}
                  onChange={(e) => {
                    const countries = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                    handleTargetingChange('geoLocations', {
                      ...formData.targetingSpec?.geoLocations,
                      countries,
                    });
                  }}
                  placeholder="US, CA, GB (country codes separated by commas)"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || !isStepValid()}
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
