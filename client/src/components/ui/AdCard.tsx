import React from 'react';
import { Calendar, Clock, BarChart, Target, Facebook } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { AdCreative } from '../../types';

interface AdCardProps {
  ad: AdCreative;
  className?: string;
  onPublish?: (ad: AdCreative) => void;
  onEdit?: (ad: AdCreative) => void;
  onDelete?: (ad: AdCreative) => void;
}

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  className,
  onPublish,
  onEdit,
  onDelete,
}) => {
  const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    published: 'bg-success-light text-success-dark',
    archive: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={ad.imageUrl || 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg'}
          alt={ad.headline}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              statusColors[ad.status]
            )}
          >
            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
          </span>
        </div>
        {ad.status === 'published' && (
          <div className="absolute top-3 left-3 bg-white/90 p-1 rounded-full">
            <Facebook size={16} className="text-primary-600" />
          </div>
        )}
      </div>
      
      <CardHeader className="pt-4">
        <CardTitle className="line-clamp-1">{ad.headline}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 line-clamp-2 mb-4">{ad.description}</p>
        
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>Created: {new Date(ad.createdAt).toLocaleDateString()}</span>
          </div>
          {ad.status === 'published' && (
            <div className="flex items-center text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>Running for: 5 days</span>
            </div>
          )}
          {ad.status === 'published' && (
            <div className="flex items-center text-success">
              <BarChart size={16} className="mr-2" />
              <span>CTR: 2.8%</span>
            </div>
          )}
          {ad.status === 'published' && (
            <div className="flex items-center text-primary-600">
              <Target size={16} className="mr-2" />
              <span>Audience: Men, 25-45</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-end space-x-2">
        {ad.status === 'draft' && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onPublish?.(ad)}
          >
            Publish
          </Button>
        )}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onEdit?.(ad)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete?.(ad)}
          className="text-error hover:text-error-dark"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};