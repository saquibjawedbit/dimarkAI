import React, { useState } from 'react';
import { Play, Pause, Edit, Trash2, Copy, MoreVertical, Eye, BarChart3, ExternalLink } from 'lucide-react';
import { Ad } from '../../types/ad.types';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface FacebookAdCardProps {
  ad: Ad;
  onEdit: (ad: Ad) => void;
  onDelete: (ad: Ad) => void;
  onDuplicate: (ad: Ad) => void;
  onToggleStatus: (ad: Ad) => void;
  onViewInsights: (ad: Ad) => void;
  onPreview: (ad: Ad) => void;
}

export const FacebookAdCard: React.FC<FacebookAdCardProps> = ({
  ad,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewInsights,
  onPreview
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success text-white';
      case 'PAUSED':
        return 'bg-warning text-white';
      case 'DELETED':
        return 'bg-red-500 text-white';
      case 'ARCHIVED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEffectiveStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-success';
      case 'PAUSED':
      case 'CAMPAIGN_PAUSED':
      case 'ADSET_PAUSED':
        return 'text-warning';
      case 'PENDING_REVIEW':
        return 'text-blue-600';
      case 'DISAPPROVED':
        return 'text-red-600';
      case 'WITH_ISSUES':
        return 'text-orange-600';
      case 'IN_PROCESS':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{ad.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                {ad.status}
              </span>
              <span className={`text-xs font-medium ${getEffectiveStatusColor(ad.effectiveStatus)}`}>
                {ad.effectiveStatus}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Created: {formatDate(ad.createdAt)}
            </div>
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
                  <button
                    onClick={() => {
                      onPreview(ad);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Eye size={16} className="mr-2" />
                    Preview Ad
                  </button>
                  <button
                    onClick={() => {
                      onViewInsights(ad);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <BarChart3 size={16} className="mr-2" />
                    View Insights
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onEdit(ad);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Ad
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(ad);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Copy size={16} className="mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onToggleStatus(ad);
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    {ad.status === 'ACTIVE' ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Pause Ad
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Activate Ad
                      </>
                    )}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(ad);
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
          {/* Performance Metrics */}
          {(ad.impressions || ad.clicks || ad.spend) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {ad.impressions && (
                  <div>
                    <span className="text-gray-600">Impressions</span>
                    <p className="font-semibold">{formatNumber(ad.impressions)}</p>
                  </div>
                )}
                {ad.clicks && (
                  <div>
                    <span className="text-gray-600">Clicks</span>
                    <p className="font-semibold">{formatNumber(ad.clicks)}</p>
                  </div>
                )}
                {ad.spend && (
                  <div>
                    <span className="text-gray-600">Spend</span>
                    <p className="font-semibold">{formatCurrency(ad.spend)}</p>
                  </div>
                )}
                {ad.ctr && (
                  <div>
                    <span className="text-gray-600">CTR</span>
                    <p className="font-semibold">{ad.ctr.toFixed(2)}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Labels */}
          {ad.adLabels && ad.adLabels.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
              <div className="flex flex-wrap gap-1">
                {ad.adLabels.map((label) => (
                  <span
                    key={label.id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {ad.issues && ad.issues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Issues</h4>
              <div className="space-y-1">
                {ad.issues.slice(0, 2).map((issue, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {issue.message || 'Issue detected'}
                  </div>
                ))}
                {ad.issues.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{ad.issues.length - 2} more issues
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {ad.recommendations && ad.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">Recommendations</h4>
              <div className="space-y-1">
                {ad.recommendations.slice(0, 2).map((recommendation, index) => (
                  <div key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    {recommendation.message || 'Recommendation available'}
                  </div>
                ))}
                {ad.recommendations.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{ad.recommendations.length - 2} more recommendations
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule */}
          {(ad.adScheduleStartTime || ad.adScheduleEndTime) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule</h4>
              <div className="text-xs text-gray-600">
                {ad.adScheduleStartTime && (
                  <div>Start: {formatDate(ad.adScheduleStartTime)}</div>
                )}
                {ad.adScheduleEndTime && (
                  <div>End: {formatDate(ad.adScheduleEndTime)}</div>
                )}
              </div>
            </div>
          )}

          {/* Preview Link */}
          {ad.previewShareableLink && (
            <div>
              <a
                href={ad.previewShareableLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={14} className="mr-1" />
                View Preview
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
