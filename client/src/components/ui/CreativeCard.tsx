import React, { useState } from 'react';
import { Edit, Trash2, Copy, MoreVertical, Eye, BarChart3, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Creative } from '../../services/creative';

interface CreativeCardProps {
  creative: Creative;
  onEdit: (creative: Creative) => void;
  onDelete: (creative: Creative) => void;
  onDuplicate?: (creative: Creative) => void;
  onToggleStatus?: (creative: Creative) => void;
  onViewInsights?: (creative: Creative) => void;
  onPreview?: (creative: Creative) => void;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({
  creative,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewInsights,
  onPreview,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success text-white';
      case 'paused':
        return 'bg-warning text-white';
      case 'pending_review':
        return 'bg-blue-500 text-white';
      case 'disapproved':
        return 'bg-error text-white';
      case 'preapproved':
        return 'bg-green-500 text-white';
      case 'deleted':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCreativeType = () => {
    if (creative.object_story_id) return 'Page Post';
    if (creative.object_story_spec?.link_data) return 'Link Ad';
    if (creative.object_story_spec?.video_data) return 'Video Ad';
    if (creative.object_story_spec?.photo_data) return 'Photo Ad';
    if (creative.asset_feed_spec) return 'Dynamic Ad';
    if (creative.template_url) return 'Template Ad';
    return 'Unknown';
  };

  const getImageUrl = () => {
    if (creative.image_url) return creative.image_url;
    if (creative.object_story_spec?.link_data?.image_url) return creative.object_story_spec.link_data.image_url;
    if (creative.object_story_spec?.photo_data?.image_url) return creative.object_story_spec.photo_data.image_url;
    if (creative.thumbnail_url) return creative.thumbnail_url;
    return null;
  };

  const getHeadline = () => {
    if (creative.title) return creative.title;
    if (creative.object_story_spec?.link_data?.name) return creative.object_story_spec.link_data.name;
    if (creative.object_story_spec?.photo_data?.name) return creative.object_story_spec.photo_data.name;
    return creative.name;
  };

  const getDescription = () => {
    if (creative.object_story_spec?.link_data?.description) return creative.object_story_spec.link_data.description;
    if (creative.object_story_spec?.link_data?.message) return creative.object_story_spec.link_data.message;
    if (creative.object_story_spec?.photo_data?.description) return creative.object_story_spec.photo_data.description;
    return null;
  };

  const imageUrl = getImageUrl();
  const headline = getHeadline();
  const description = getDescription();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{creative.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(creative.status)}`}>
                {formatStatus(creative.status)}
              </span>
              <span className="text-sm text-gray-500">{getCreativeType()}</span>
            </div>
            <p className="text-sm text-gray-600">
              Creative ID: {creative.id}
            </p>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="p-2"
            >
              <MoreVertical size={16} />
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {onPreview && (
                    <button
                      onClick={() => {
                        onPreview(creative);
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Eye size={16} className="mr-2" />
                      Preview
                    </button>
                  )}
                  {onViewInsights && (
                    <button
                      onClick={() => {
                        onViewInsights(creative);
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <BarChart3 size={16} className="mr-2" />
                      View Insights
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onEdit(creative);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Creative
                  </button>
                  {onDuplicate && (
                    <button
                      onClick={() => {
                        onDuplicate(creative);
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Copy size={16} className="mr-2" />
                      Duplicate
                    </button>
                  )}
                  {onToggleStatus && (
                    <button
                      onClick={() => {
                        onToggleStatus(creative);
                        setShowActions(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      {creative.status.toLowerCase() === 'active' ? (
                        <>
                          <Pause size={16} className="mr-2" />
                          Pause Creative
                        </>
                      ) : (
                        <>
                          <Play size={16} className="mr-2" />
                          Activate Creative
                        </>
                      )}
                    </button>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(creative);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Creative Preview */}
          {(imageUrl || headline || description) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="space-y-2">
                {imageUrl && (
                  <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={headline || 'Creative preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik08NyA0MlY3OEg5M1Y0Mkg4N1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxyZWN0IHg9Ijc3IiB5PSI1MiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                )}
                {headline && (
                  <h5 className="font-medium text-gray-900 text-sm">{headline}</h5>
                )}
                {description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                )}
              </div>
            </div>
          )}

          {/* Creative Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {creative.call_to_action_type && (
              <div>
                <span className="text-gray-600">Call to Action</span>
                <p className="font-semibold">{formatStatus(creative.call_to_action_type)}</p>
              </div>
            )}
            {creative.authorization_category && (
              <div>
                <span className="text-gray-600">Category</span>
                <p className="font-semibold">{formatStatus(creative.authorization_category)}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};