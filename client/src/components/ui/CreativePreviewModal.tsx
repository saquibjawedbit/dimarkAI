import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { Creative } from '../../services/creative';

interface CreativePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: Creative;
}

export const CreativePreviewModal: React.FC<CreativePreviewModalProps> = ({
  isOpen,
  onClose,
  creative
}) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async () => {
    if (!creative) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll create a mock preview based on the creative data
      // In a real implementation, this would call the Facebook API
      const mockPreview = {
        body: creative.object_story_spec?.link_data?.message || creative.object_story_spec?.video_data?.message || creative.object_story_spec?.photo_data?.message || '',
        title: creative.object_story_spec?.link_data?.name || creative.object_story_spec?.video_data?.title || creative.name,
        description: creative.object_story_spec?.link_data?.description || creative.object_story_spec?.video_data?.description || creative.object_story_spec?.photo_data?.description || '',
        link: creative.object_story_spec?.link_data?.link || '',
        image_url: creative.object_story_spec?.link_data?.image_url || creative.object_story_spec?.video_data?.image_url || creative.object_story_spec?.photo_data?.image_url || creative.image_url || '',
        call_to_action: creative.object_story_spec?.link_data?.call_to_action?.type || creative.object_story_spec?.video_data?.call_to_action?.type || creative.object_story_spec?.photo_data?.call_to_action?.type || 'Learn More',
        video_id: creative.object_story_spec?.video_data?.video_id || null
      };
      
      setPreviewData(mockPreview);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && creative) {
      generatePreview();
    }
  }, [isOpen, creative]);

  const getCreativeType = () => {
    if (creative?.object_story_spec?.link_data) return 'Link Ad';
    if (creative?.object_story_spec?.video_data) return 'Video Ad';
    if (creative?.object_story_spec?.photo_data) return 'Photo Ad';
    return 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Creative Preview</h2>
            <p className="text-sm text-gray-600 mt-1">{creative?.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {getCreativeType()}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Generating preview...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={generatePreview}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {previewData && (
            <div className="space-y-6">
              {/* Facebook Preview Frame */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Facebook Preview
                </h3>
                <div className="bg-white rounded-lg shadow-sm border max-w-md mx-auto">
                  {/* Facebook Post Structure */}
                  <div className="p-4">
                    {/* Page Info */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        FB
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-sm">Your Page</div>
                        <div className="text-xs text-gray-500">Sponsored</div>
                      </div>
                    </div>

                    {/* Post Content */}
                    {previewData.body && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-800">{previewData.body}</p>
                      </div>
                    )}

                    {/* Media Content */}
                    <div className="border rounded-lg overflow-hidden">
                      {previewData.image_url && (
                        <img
                          src={previewData.image_url}
                          alt="Creative preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      
                      {previewData.video_id && (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">Video Content</p>
                          </div>
                        </div>
                      )}

                      {/* Link Preview */}
                      <div className="p-3 bg-gray-50 border-t">
                        {previewData.link && (
                          <div className="text-xs text-gray-500 mb-1 uppercase">
                            {new URL(previewData.link).hostname}
                          </div>
                        )}
                        {previewData.title && (
                          <div className="font-semibold text-sm text-gray-900 mb-1">
                            {previewData.title}
                          </div>
                        )}
                        {previewData.description && (
                          <div className="text-xs text-gray-600">
                            {previewData.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call to Action */}
                    {previewData.call_to_action && (
                      <div className="mt-3">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
                          {previewData.call_to_action}
                        </button>
                      </div>
                    )}

                    {/* Engagement Buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <span className="text-sm">👍</span>
                          <span className="text-xs">Like</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <span className="text-sm">💬</span>
                          <span className="text-xs">Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                          <span className="text-sm">📤</span>
                          <span className="text-xs">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Creative Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Creative ID
                    </label>
                    <p className="text-sm text-gray-900">{creative.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      creative.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : creative.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {creative.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Creative Type
                    </label>
                    <p className="text-sm text-gray-900">{getCreativeType()}</p>
                  </div>
                  
                  {previewData.title && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                      </label>
                      <p className="text-sm text-gray-900">{previewData.title}</p>
                    </div>
                  )}
                  
                  {previewData.body && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Text
                      </label>
                      <p className="text-sm text-gray-900">{previewData.body}</p>
                    </div>
                  )}
                  
                  {previewData.description && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <p className="text-sm text-gray-900">{previewData.description}</p>
                    </div>
                  )}
                  
                  {previewData.link && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Destination URL
                      </label>
                      <a
                        href={previewData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {previewData.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {previewData.link && (
                  <button
                    onClick={() => window.open(previewData.link, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <ExternalLink size={16} />
                    <span>Visit Landing Page</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <span>Close Preview</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
