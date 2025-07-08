import React, { useState } from 'react';
import { PlusCircle, BarChart2, Calendar, RefreshCw, Target, Zap, ChevronDown, TrendingUp, TrendingDown, CreditCard, Users, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AdCard } from '../components/ui/AdCard';
import { useAuth } from '../contexts/AuthContext';
import { AdCreative } from '../types';
import { FacebookBusinessManager } from '../components/FacebookBusinessManager';

// Mock data
const mockAds: AdCreative[] = [
  {
    id: '1',
    userId: '1',
    headline: 'Summer Collection Sale',
    description: 'Get 25% off our latest summer styles. Limited time offer!',
    imageUrl: 'https://images.pexels.com/photos/5325588/pexels-photo-5325588.jpeg',
    callToAction: 'Shop Now',
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    headline: 'New Product Launch',
    description: 'Introducing our revolutionary product. Be the first to try it!',
    imageUrl: 'https://images.pexels.com/photos/5325600/pexels-photo-5325600.jpeg',
    callToAction: 'Learn More',
    status: 'draft',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    headline: 'Limited Time Discount',
    description: 'Use code SAVE20 for 20% off your first purchase.',
    imageUrl: 'https://images.pexels.com/photos/5325553/pexels-photo-5325553.jpeg',
    callToAction: 'Get Code',
    status: 'published',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('7d');
  const [ads] = useState<AdCreative[]>(mockAds);

  const metrics = [
    {
      name: 'Total Impressions',
      value: '152,435',
      change: '+24.5%',
      trend: 'up',
      icon: <Users size={20} />,
    },
    {
      name: 'Click-Through Rate',
      value: '4.28%',
      change: '+1.2%',
      trend: 'up',
      icon: <Target size={20} />,
    },
    {
      name: 'Cost Per Click',
      value: '$0.36',
      change: '-5.3%',
      trend: 'down',
      icon: <CreditCard size={20} />,
    },
    {
      name: 'Conversion Rate',
      value: '3.14%',
      change: '+0.8%',
      trend: 'up',
      icon: <Zap size={20} />,
    },
  ];

  const handlePublish = (ad: AdCreative) => {
    console.log('Publishing ad:', ad);
  };

  const handleEdit = (ad: AdCreative) => {
    console.log('Editing ad:', ad);
  };

  const handleDelete = (ad: AdCreative) => {
    console.log('Deleting ad:', ad);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Here's an overview of your ad performance.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <div className="relative">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Calendar size={16} className="mr-2" />
                Last {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : '90 days'}
                <ChevronDown size={16} className="ml-2" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
                <div className="py-1">
                  {['7d', '30d', '90d'].map((option) => (
                    <button
                      key={option}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                        timeframe === option ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setTimeframe(option)}
                    >
                      Last {option === '7d' ? '7 days' : option === '30d' ? '30 days' : '90 days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="primary" leftIcon={<RefreshCw size={16} />}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    metric.name === 'Click-Through Rate' ? 'bg-primary-100 text-primary-600' :
                    metric.name === 'Cost Per Click' ? 'bg-accent/10 text-accent' :
                    metric.name === 'Conversion Rate' ? 'bg-success/10 text-success' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {metric.icon}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  {metric.trend === 'up' ? (
                    <TrendingUp size={16} className="text-success mr-1" />
                  ) : (
                    <TrendingDown size={16} className="text-error mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-success' : 'text-error'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs. previous period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Ads */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Ads</h2>
            <Button variant="primary" leftIcon={<PlusCircle size={16} />}>
              Create New Ad
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onPublish={handlePublish}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Optimization Suggestions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Audience Targeting</CardTitle>
                  <div className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Clock size={12} className="mr-1" />
                    New Suggestion
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our AI detected that your ads are performing 43% better with women aged 25-34 in urban areas. Consider adjusting your targeting to focus more on this demographic.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" size="sm">
                    Ignore
                  </Button>
                  <Button variant="primary" size="sm">
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Budget Allocation</CardTitle>
                  <div className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <BarChart2 size={12} className="mr-1" />
                    High Impact
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your "Summer Collection" campaign is outperforming others by 2.8x ROAS. We recommend increasing its budget by 30% to maximize performance.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="secondary" size="sm">
                    Ignore
                  </Button>
                  <Button variant="primary" size="sm">
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Facebook Business Manager */}
        <div className="mt-8">
          <FacebookBusinessManager />
        </div>
      </div>
    </div>
  );
};