import React from 'react';
import { TrendingUp, TrendingDown, Users, Target, CreditCard, Zap, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface MetricCardProps {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ name, value, change, trend, icon, color = 'gray' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{name}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-3">
          {trend === 'up' ? (
            <TrendingUp size={16} className="text-success mr-1" />
          ) : (
            <TrendingDown size={16} className="text-error mr-1" />
          )}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-success' : 'text-error'
          }`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs. previous period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const metrics = [
    {
      name: 'Total Impressions',
      value: '152,435',
      change: '+24.5%',
      trend: 'up' as const,
      icon: <Users size={20} />,
      color: 'gray',
    },
    {
      name: 'Click-Through Rate',
      value: '4.28%',
      change: '+1.2%',
      trend: 'up' as const,
      icon: <Target size={20} />,
      color: 'primary',
    },
    {
      name: 'Cost Per Click',
      value: '₹0.36',
      change: '-5.3%',
      trend: 'down' as const,
      icon: <CreditCard size={20} />,
      color: 'accent',
    },
    {
      name: 'Conversion Rate',
      value: '3.14%',
      change: '+0.8%',
      trend: 'up' as const,
      icon: <Zap size={20} />,
      color: 'success',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Campaign "Summer Sale" published',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'Ad creative updated for "New Product Launch"',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: 3,
      action: 'Budget increased for "Holiday Campaign"',
      time: '1 day ago',
      status: 'warning',
    },
    {
      id: 4,
      action: 'New audience segment created',
      time: '2 days ago',
      status: 'info',
    },
  ];

  return (
    <div className="pt-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">
              Here's an overview of your advertising performance and recent activity.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="secondary" leftIcon={<Calendar size={16} />}>
              Last 7 days
            </Button>
            <Button variant="primary" leftIcon={<RefreshCw size={16} />}>
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Campaigns</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Ad Spend (This Month)</span>
                <span className="font-semibold">₹4,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue Generated</span>
                <span className="font-semibold text-success">₹12,890</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return on Ad Spend</span>
                <span className="font-semibold text-success">3.04x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' :
                    'bg-primary-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Optimize Budget Allocation</CardTitle>
                <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                  High Impact
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your "Summer Collection" campaign is outperforming others by 2.8x ROAS. 
                Consider reallocating 30% more budget to maximize returns.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" size="sm">
                  Not Now
                </Button>
                <Button variant="primary" size="sm">
                  Apply Suggestion
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Audience Expansion</CardTitle>
                <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-medium">
                  Opportunity
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Similar audiences to your best-performing segments are available. 
                Expanding could increase reach by 45% with similar conversion rates.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
                <Button variant="primary" size="sm">
                  Create Audience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
