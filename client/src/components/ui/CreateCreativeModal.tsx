import React, { useState, useEffect } from 'react';
import { X, Image, Video, Link as LinkIcon, Palette } from 'lucide-react';
import { Button } from './Button';
import { creativeService, CreateCreativeRequest, CreativeConstants } from '../../services/creative';

interface CreateCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CreativeType = 'link' | 'image' | 'video' | 'carousel' | 'collection';

export const CreateCreativeModal: React.FC<CreateCreativeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [constants, setConstants] = useState<CreativeConstants | null>(null);
  const [creativeType, setCreativeType] = useState<CreativeType>('link');
  
  const [formData, setFormData] = useState<CreateCreativeRequest>({
    name: '',
    status: 'PAUSED',
    object_story_spec: {
      page_id: '',
      link_data: {
        link: '',
        message: '',
        name: '',
        description: '',
        image_url: '',
        call_to_action: {
          type: 'LEARN_MORE',
          value: {
            link: ''
          }
        }
      }
    }
  });

  // Load creative constants
  useEffect(() => {
    const loadConstants = async () => {
      try {
        const response = await creativeService.getCreativeConstants();
        if (response.data) {
          setConstants(response.data);
        }
      } catch (err) {
        console.error('Failed to load creative constants:', err);
      }
    };

    if (isOpen) {
      loadConstants();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        link_data: {
          ...prev.object_story_spec?.link_data,
          [field]: value
        }
      }
    }));
  };

  const handleCallToActionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        link_data: {
          ...prev.object_story_spec?.link_data,
          call_to_action: {
            ...prev.object_story_spec?.link_data?.call_to_action,
            [field]: value
          }
        }
      }
    }));
  };

  const handleCallToActionValueChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        link_data: {
          ...prev.object_story_spec?.link_data,
          call_to_action: {
            ...prev.object_story_spec?.link_data?.call_to_action,
            value: {
              ...prev.object_story_spec?.link_data?.call_to_action?.value,
              [field]: value
            }
          }
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Creative name is required');
      }

      if (creativeType === 'link') {
        if (!formData.object_story_spec?.link_data?.link) {
          throw new Error('Link URL is required for link creatives');
        }
        if (!formData.object_story_spec?.link_data?.message) {
          throw new Error('Message is required for link creatives');
        }
      }

      await creativeService.createCreative(formData);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        status: 'PAUSED',
        object_story_spec: {
          page_id: '',
          link_data: {
            link: '',
            message: '',
            name: '',
            description: '',
            image_url: '',
            call_to_action: {
              type: 'LEARN_MORE',
              value: {
                link: ''
              }
            }
          }
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create creative');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Creative</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Creative Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Creative Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setCreativeType('link')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  creativeType === 'link'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <LinkIcon size={24} />
                <span className="text-sm font-medium">Link</span>
              </button>
              <button
                type="button"
                onClick={() => setCreativeType('image')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  creativeType === 'image'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image size={24} />
                <span className="text-sm font-medium">Image</span>
              </button>
              <button
                type="button"
                onClick={() => setCreativeType('video')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  creativeType === 'video'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video size={24} />
                <span className="text-sm font-medium">Video</span>
              </button>
              <button
                type="button"
                onClick={() => setCreativeType('carousel')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  creativeType === 'carousel'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Palette size={24} />
                <span className="text-sm font-medium">Carousel</span>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Creative Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter creative name"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {constants?.statusTypes.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pageId" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Page ID
              </label>
              <input
                type="text"
                id="pageId"
                value={formData.object_story_spec?.page_id || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  object_story_spec: {
                    ...prev.object_story_spec,
                    page_id: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter Facebook Page ID"
              />
            </div>
          </div>

          {/* Link Creative Fields */}
          {creativeType === 'link' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Link Creative Details</h3>
              
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="link"
                  value={formData.object_story_spec?.link_data?.link || ''}
                  onChange={(e) => handleLinkDataChange('link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.object_story_spec?.link_data?.message || ''}
                  onChange={(e) => handleLinkDataChange('message', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your ad message"
                  required
                />
              </div>

              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  id="headline"
                  value={formData.object_story_spec?.link_data?.name || ''}
                  onChange={(e) => handleLinkDataChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter headline"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.object_story_spec?.link_data?.description || ''}
                  onChange={(e) => handleLinkDataChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.object_story_spec?.link_data?.image_url || ''}
                  onChange={(e) => handleLinkDataChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="ctaType" className="block text-sm font-medium text-gray-700 mb-1">
                  Call to Action Type
                </label>
                <select
                  id="ctaType"
                  value={formData.object_story_spec?.link_data?.call_to_action?.type || 'LEARN_MORE'}
                  onChange={(e) => handleCallToActionChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {constants?.callToActionTypes.slice(0, 20).map(cta => (
                    <option key={cta} value={cta}>
                      {cta.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Call to Action Link
                </label>
                <input
                  type="url"
                  id="ctaLink"
                  value={formData.object_story_spec?.link_data?.call_to_action?.value?.link || ''}
                  onChange={(e) => handleCallToActionValueChange('link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Other creative types can be added here */}
          {creativeType !== 'link' && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-gray-600 text-center">
                {creativeType.charAt(0).toUpperCase() + creativeType.slice(1)} creative type is coming soon!
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Creative'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
