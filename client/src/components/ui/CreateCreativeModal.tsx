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
      },
      photo_data: {
        image_hash: '',
        url: '',
        message: '',
        name: '',
        description: '',
        call_to_action: {
          type: 'LEARN_MORE',
          value: {
            link: ''
          }
        }
      }
    }
  });

  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [showPages, setShowPages] = useState(false);

  // Load available pages
  const loadAvailablePages = async () => {
    setLoadingPages(true);
    try {
      const response = await creativeService.getUserPages();
      if (response.data) {
        setAvailablePages(response.data);
        setShowPages(true);
        if (response.data.length === 0) {
          setError('No Facebook Pages found. This may be due to insufficient permissions or no pages associated with your account.');
        }
      }
    } catch (err: any) {
      console.error('Failed to load available pages:', err);
      setError('Failed to load Facebook Pages. You may need to enter the Page ID manually.');
    } finally {
      setLoadingPages(false);
    }
  };

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

  const handlePhotoDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        photo_data: {
          ...prev.object_story_spec?.photo_data,
          [field]: value
        }
      }
    }));
  };

  const handlePhotoCallToActionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        photo_data: {
          ...prev.object_story_spec?.photo_data,
          call_to_action: {
            ...prev.object_story_spec?.photo_data?.call_to_action,
            [field]: value
          }
        }
      }
    }));
  };

  const handlePhotoCallToActionValueChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      object_story_spec: {
        ...prev.object_story_spec,
        photo_data: {
          ...prev.object_story_spec?.photo_data,
          call_to_action: {
            ...prev.object_story_spec?.photo_data?.call_to_action,
            value: {
              ...prev.object_story_spec?.photo_data?.call_to_action?.value,
              [field]: value
            }
          }
        }
      }
    }));
  };

  // Helper function to clean up empty values
  const cleanObject = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.filter(item => item !== null && item !== undefined);
    
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object') {
          const cleanedValue = cleanObject(value);
          if (cleanedValue !== undefined && (
            (typeof cleanedValue === 'object' && !Array.isArray(cleanedValue) && Object.keys(cleanedValue).length > 0) ||
            (Array.isArray(cleanedValue) && cleanedValue.length > 0) ||
            (typeof cleanedValue !== 'object')
          )) {
            cleaned[key] = cleanedValue;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
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
        
        // Validate URL format
        const linkUrl = formData.object_story_spec.link_data.link;
        try {
          new URL(linkUrl);
        } catch (urlError) {
          throw new Error('Please enter a valid URL (e.g., https://example.com)');
        }
        
        if (!formData.object_story_spec?.link_data?.message) {
          throw new Error('Message is required for link creatives');
        }
        if (!formData.object_story_spec?.page_id) {
          throw new Error('Facebook Page ID is required for link creatives');
        }
        if (!/^\d+$/.test(formData.object_story_spec.page_id)) {
          throw new Error('Facebook Page ID should be numeric (numbers only)');
        }
      }

      if (creativeType === 'image') {
        if (!formData.object_story_spec?.photo_data?.image_hash) {
          throw new Error('Image hash is required for image creatives');
        }
        if (!formData.object_story_spec?.page_id) {
          throw new Error('Facebook Page ID is required for image creatives');
        }
        if (!/^\d+$/.test(formData.object_story_spec.page_id)) {
          throw new Error('Facebook Page ID should be numeric (numbers only)');
        }
      }

      // Prepare creative data based on type
      let creativeData = {
        name: formData.name,
        status: formData.status,
        object_story_spec: {
          page_id: formData.object_story_spec?.page_id
        }
      } as any;

      if (creativeType === 'link') {
        // For link creatives, only include link_data
        const linkData = {
          link: formData.object_story_spec?.link_data?.link,
          message: formData.object_story_spec?.link_data?.message,
          name: formData.object_story_spec?.link_data?.name,
          description: formData.object_story_spec?.link_data?.description,
          image_url: formData.object_story_spec?.link_data?.image_url,
          call_to_action: formData.object_story_spec?.link_data?.call_to_action
        };
        // Clean up empty values for link_data
        creativeData.object_story_spec.link_data = cleanObject(linkData);
      } else if (creativeType === 'image') {
        // For image creatives, only include photo_data
        const photoData = {
          image_hash: formData.object_story_spec?.photo_data?.image_hash,
          url: formData.object_story_spec?.photo_data?.url,
          message: formData.object_story_spec?.photo_data?.message,
          name: formData.object_story_spec?.photo_data?.name,
          description: formData.object_story_spec?.photo_data?.description,
          call_to_action: formData.object_story_spec?.photo_data?.call_to_action
        };
        // Clean up empty values for photo_data
        creativeData.object_story_spec.photo_data = cleanObject(photoData);
      }

      // Clean up empty values for the entire object
      creativeData = cleanObject(creativeData);

      console.log('Sending creative data:', JSON.stringify(creativeData, null, 2));

      // Final validation of the payload structure
      if (!creativeData.object_story_spec?.page_id) {
        throw new Error('Page ID is required in object_story_spec');
      }

      if (creativeType === 'link' && !creativeData.object_story_spec?.link_data) {
        throw new Error('Link data is required for link creatives');
      }

      if (creativeType === 'image' && !creativeData.object_story_spec?.photo_data) {
        throw new Error('Photo data is required for image creatives');
      }

      // Ensure we don't have both link_data and photo_data
      if (creativeData.object_story_spec?.link_data && creativeData.object_story_spec?.photo_data) {
        throw new Error('Cannot have both link_data and photo_data in the same creative');
      }

      try {
        const response = await creativeService.createCreative(creativeData);
        console.log('Creative created successfully:', response);
        onSuccess();
        onClose();
      } catch (createError: any) {
        console.error('Detailed error creating creative:', createError);
        
        // Try to extract more specific error information
        let errorMessage = createError.message || 'Failed to create creative';
        
        // Check for common Facebook API errors
        if (errorMessage.includes('Invalid parameter')) {
          errorMessage += '\n\nCommon issues:\n- Facebook Page ID might be incorrect (should be numeric only)\n- Image hash might be invalid (for image creatives)\n- Link URL might be invalid (for link creatives)\n- Required fields might be missing\n- Page permissions might be insufficient\n- Creative payload structure might be incorrect';
        }
        
        if (errorMessage.includes('Insufficient permissions')) {
          errorMessage = 'Insufficient permissions. Please make sure:\n- Your Facebook account has admin access to the page\n- The app has the necessary permissions\n- The access token is valid';
        }
        
        if (errorMessage.includes('Invalid Page ID')) {
          errorMessage = 'Invalid Facebook Page ID. Please check:\n- The Page ID is correct (numeric only)\n- You have admin access to the page\n- The page is active and published';
        }
        
        throw new Error(errorMessage);
      }
      
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
          },
          photo_data: {
            image_hash: '',
            url: '',
            message: '',
            name: '',
            description: '',
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
              <div className="text-red-800 text-sm whitespace-pre-line">{error}</div>
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
                Facebook Page ID <span className="text-red-500">*</span>
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
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                The Facebook Page ID where the creative will be posted. You can find this in your Facebook Page settings.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                <p className="text-blue-800 text-sm">
                  <strong>Tips for finding your Facebook Page ID:</strong><br/>
                  1. Go to your Facebook Page<br/>
                  2. Click "About" in the left sidebar<br/>
                  3. Scroll down to find "Page ID" or "Facebook Page ID"<br/>
                  4. It should be a long number (e.g., 123456789012345)<br/>
                  <br/>
                  <strong>Important:</strong> You must have admin access to the page and permission to create ads for it.<br/>
                  <br/>
                  <strong>Note:</strong> If the "Show My Available Pages" button doesn't work, it may be due to Facebook permissions. You can still enter the Page ID manually.
                </p>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={loadAvailablePages}
                    disabled={loadingPages}
                  >
                    {loadingPages ? 'Loading...' : 'Show My Available Pages'}
                  </Button>
                </div>
                {showPages && availablePages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-blue-800 mb-2">Your Available Pages:</p>
                    <div className="max-h-32 overflow-y-auto">
                      {availablePages.map((page: any) => (
                        <div key={page.id} className="flex items-center justify-between p-2 bg-white rounded border mb-1">
                          <div>
                            <span className="font-medium">{page.name}</span>
                            <span className="text-gray-500 ml-2">({page.id})</span>
                          </div>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                object_story_spec: {
                                  ...prev.object_story_spec,
                                  page_id: page.id
                                }
                              }));
                              setShowPages(false);
                            }}
                          >
                            Use This Page
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {showPages && availablePages.length === 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-red-600">No pages found with advertising permissions.</p>
                  </div>
                )}
              </div>
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

          {/* Image Creative Fields */}
          {creativeType === 'image' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Image Creative Details</h3>
              
              <div>
                <label htmlFor="imageHash" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Hash <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="imageHash"
                  value={formData.object_story_spec?.photo_data?.image_hash || ''}
                  onChange={(e) => handlePhotoDataChange('image_hash', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image hash from Facebook"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload your image to Facebook first and use the returned hash
                </p>
              </div>

              <div>
                <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  id="photoUrl"
                  value={formData.object_story_spec?.photo_data?.url || ''}
                  onChange={(e) => handlePhotoDataChange('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label htmlFor="photoMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="photoMessage"
                  value={formData.object_story_spec?.photo_data?.message || ''}
                  onChange={(e) => handlePhotoDataChange('message', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your photo caption/message"
                />
              </div>

              <div>
                <label htmlFor="photoName" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Name
                </label>
                <input
                  type="text"
                  id="photoName"
                  value={formData.object_story_spec?.photo_data?.name || ''}
                  onChange={(e) => handlePhotoDataChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter photo name"
                />
              </div>

              <div>
                <label htmlFor="photoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Description
                </label>
                <textarea
                  id="photoDescription"
                  value={formData.object_story_spec?.photo_data?.description || ''}
                  onChange={(e) => handlePhotoDataChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter photo description"
                />
              </div>

              <div>
                <label htmlFor="photoCtaType" className="block text-sm font-medium text-gray-700 mb-1">
                  Call to Action Type
                </label>
                <select
                  id="photoCtaType"
                  value={formData.object_story_spec?.photo_data?.call_to_action?.type || 'LEARN_MORE'}
                  onChange={(e) => handlePhotoCallToActionChange('type', e.target.value)}
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
                <label htmlFor="photoCtaLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Call to Action Link
                </label>
                <input
                  type="url"
                  id="photoCtaLink"
                  value={formData.object_story_spec?.photo_data?.call_to_action?.value?.link || ''}
                  onChange={(e) => handlePhotoCallToActionValueChange('link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Other creative types can be added here */}
          {creativeType !== 'link' && creativeType !== 'image' && (
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
