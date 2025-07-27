import React, { useState, useEffect } from 'react';
import { X, Image, Video, Link as LinkIcon, Palette, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { creativeService, CreateCreativeRequest, CreativeConstants } from '@/lib/services/creative';
import { geminiService, GenerateTextRequest, RephraseTextRequest } from '@/lib/services/gemini';

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

  // AI generation states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiProductName, setAiProductName] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiTargetAudience, setAiTargetAudience] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'>('persuasive');
  const [aiObjective, setAiObjective] = useState<'brand_awareness' | 'reach' | 'traffic' | 'engagement' | 'app_installs' | 'video_views' | 'lead_generation' | 'conversions'>('conversions');

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

  // AI Generation Functions
  const generateAiText = async () => {
    if (!aiProductName.trim()) {
      setAiError('Please enter a product name to generate text');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const request: GenerateTextRequest = {
        productName: aiProductName,
        description: aiDescription || undefined,
        targetAudience: aiTargetAudience || undefined,
        campaignObjective: aiObjective,
        tone: aiTone,
        platform: 'facebook',
        adFormat: 'single_image',
        callToAction: formData.object_story_spec?.link_data?.call_to_action?.type || 'LEARN_MORE',
        additionalContext: 'This is for a Facebook ad creative'
      };

      const response = await geminiService.generateAdText(request);

      if (response.success && response.data) {
        // Parse the generated text and populate the form
        let generatedText: string | Record<string, any> = response.data.generatedText;

        if (typeof generatedText === 'string') {
          const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/i);
          if (jsonMatch && jsonMatch[1]) {
            try {
              generatedText = JSON.parse(jsonMatch[1]);
            } catch (e) {
              console.error("Failed to parse JSON:", e);
              generatedText = {}; // fallback to empty object
            }
          }
        }

        // First line as headline, second as message, third as description
        if (typeof generatedText === 'object' && generatedText !== null) {
          handleLinkDataChange('name', generatedText.headline || '');
          handleLinkDataChange('message', generatedText.primary_text || '');
          handleLinkDataChange('description', generatedText.description || '');
        } else if (typeof generatedText === 'string') {
          // fallback: set message field with the string
          handleLinkDataChange('message', generatedText);
        }

        setAiSuccess('AI text generated successfully! Check the form fields below.');
        setShowAiHelper(false);

        // Clear success message after 5 seconds
        setTimeout(() => setAiSuccess(null), 5000);
      } else {
        setAiError(response.error || 'Failed to generate text');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiError('An error occurred while generating text');
    } finally {
      setAiLoading(false);
    }
  };

  const rephraseText = async (field: 'message' | 'name' | 'description') => {
    const currentText = field === 'message'
      ? formData.object_story_spec?.link_data?.message
      : field === 'name'
        ? formData.object_story_spec?.link_data?.name
        : formData.object_story_spec?.link_data?.description;

    if (!currentText?.trim()) {
      setAiError(`Please enter ${field} text to rephrase`);
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const request: RephraseTextRequest = {
        text: currentText,
        targetAudience: aiTargetAudience || 'general consumers',
        tone: aiTone,
        platform: 'facebook'
      };

      const response = await geminiService.rephraseText(request);

      if (response.success && response.data) {
        handleLinkDataChange(field, response.data.generatedText);
        setAiSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} rephrased successfully!`);

        // Clear success message after 3 seconds
        setTimeout(() => setAiSuccess(null), 3000);
      } else {
        setAiError(response.error || 'Failed to rephrase text');
      }
    } catch (error) {
      console.error('AI rephrase error:', error);
      setAiError('An error occurred while rephrasing text');
    } finally {
      setAiLoading(false);
    }
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
      // Reset AI form
      setShowAiHelper(false);
      setAiError(null);
      setAiSuccess(null);
      setAiLoading(false);
      setAiProductName('');
      setAiDescription('');
      setAiTargetAudience('');
      setAiTone('persuasive');
      setAiObjective('conversions');

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

          {aiSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-green-800 text-sm flex items-center">
                <Sparkles className="mr-2 text-green-600" size={16} />
                {aiSuccess}
              </div>
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
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${creativeType === 'link'
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
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${creativeType === 'image'
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
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${creativeType === 'video'
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
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${creativeType === 'carousel'
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
                  <strong>Tips for finding your Facebook Page ID:</strong><br />
                  1. Go to your Facebook Page<br />
                  2. Click "About" in the left sidebar<br />
                  3. Scroll down to find "Page ID" or "Facebook Page ID"<br />
                  4. It should be a long number (e.g., 123456789012345)<br />
                  <br />
                  <strong>Important:</strong> You must have admin access to the page and permission to create ads for it.<br />
                  <br />
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

              {/* AI Helper Section */}
              <div className="border-t border-b py-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <Sparkles className="mr-2 text-blue-500" size={18} />
                    AI Text Generator
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiHelper(!showAiHelper)}
                  >
                    {showAiHelper ? 'Hide' : 'Show'} AI Helper
                  </Button>
                </div>

                {showAiHelper && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={aiProductName}
                          onChange={(e) => setAiProductName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter product name"
                        />
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          value={aiTargetAudience}
                          onChange={(e) => setAiTargetAudience(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., young professionals"
                        />
                      </div> */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Description
                      </label>
                      <textarea
                        value={aiDescription}
                        onChange={(e) => setAiDescription(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe your product or service"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tone
                        </label>
                        <select
                          value={aiTone}
                          onChange={(e) => setAiTone(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="friendly">Friendly</option>
                          <option value="urgent">Urgent</option>
                          <option value="persuasive">Persuasive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Campaign Objective
                        </label>
                        <select
                          value={aiObjective}
                          onChange={(e) => setAiObjective(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="brand_awareness">Brand Awareness</option>
                          <option value="reach">Reach</option>
                          <option value="traffic">Traffic</option>
                          <option value="engagement">Engagement</option>
                          <option value="conversions">Conversions</option>
                          <option value="lead_generation">Lead Generation</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="button"
                        onClick={generateAiText}
                        disabled={aiLoading || !aiProductName.trim()}
                      >
                        {aiLoading ? 'Generating...' : 'Generate AI Text'}
                      </Button>
                    </div>

                    {aiError && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-800 text-sm">{aiError}</p>
                      </div>
                    )}

                    {aiSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-green-800 text-sm">{aiSuccess}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => rephraseText('message')}
                    disabled={aiLoading || !formData.object_story_spec?.link_data?.message}
                    className="text-xs"
                  >
                    AI Rephrase
                  </Button>
                </div>
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                    Headline
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => rephraseText('name')}
                    disabled={aiLoading || !formData.object_story_spec?.link_data?.name}
                    className="text-xs"
                  >
                    AI Rephrase
                  </Button>
                </div>
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
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => rephraseText('description')}
                    disabled={aiLoading || !formData.object_story_spec?.link_data?.description}
                    className="text-xs"
                  >
                    AI Rephrase
                  </Button>
                </div>
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

          {/* AI Features Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <Sparkles className="mr-3 text-blue-500 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">AI-Powered Text Generation</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Generate All Text:</strong> Use the AI Helper to create headline, message, and description at once</li>
                  <li>• <strong>Rephrase Individual Fields:</strong> Click "AI Rephrase" buttons to improve specific text fields</li>
                  <li>• <strong>Smart Optimization:</strong> AI considers Facebook's best practices for better ad performance</li>
                  <li>• <strong>Multiple Variations:</strong> Try different tones and objectives to find what works best</li>
                </ul>
              </div>
            </div>
          </div>

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