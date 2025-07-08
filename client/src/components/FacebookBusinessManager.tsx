import React, { useState, useEffect } from 'react';
import { Facebook, Users, TrendingUp, Settings, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface FacebookPage {
  id: string;
  name: string;
  access_token?: string;
  category: string;
  category_list?: any[];
  link?: string;
  picture?: any;
  fan_count?: number;
  verification_status?: string;
}

interface FacebookAdAccount {
  id: string;
  name: string;
  account_id: string;
  currency: string;
  timezone_name: string;
  account_status: number;
  funding_source?: string;
  spend_cap?: string;
  balance?: string;
}

interface FacebookBusiness {
  id: string;
  name: string;
  verification_status: string;
  primary_page?: any;
  created_time?: string;
}

interface BusinessData {
  pages: FacebookPage[];
  adAccounts: FacebookAdAccount[];
  businesses: FacebookBusiness[];
}

export const FacebookBusinessManager: React.FC = () => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load business data from localStorage
    const storedData = localStorage.getItem('facebook_business_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBusinessData(parsedData);
      } catch (error) {
        console.error('Failed to parse Facebook business data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const getAccountStatus = (status: number): { text: string; color: string } => {
    switch (status) {
      case 1: return { text: 'Active', color: 'text-green-600' };
      case 2: return { text: 'Disabled', color: 'text-red-600' };
      case 3: return { text: 'Unsettled', color: 'text-yellow-600' };
      case 7: return { text: 'Pending Review', color: 'text-blue-600' };
      case 9: return { text: 'In Grace Period', color: 'text-orange-600' };
      case 101: return { text: 'Closed', color: 'text-gray-600' };
      default: return { text: 'Unknown', color: 'text-gray-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="text-center p-8">
        <Facebook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Facebook Business Data</h3>
        <p className="text-gray-600 mb-4">Connect your Facebook account to manage your business assets.</p>
        <Button variant="primary">
          <Facebook className="w-4 h-4 mr-2" />
          Connect Facebook
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Facebook Business Manager</h2>
        <Button variant="secondary" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Facebook Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Facebook className="w-5 h-5 mr-2 text-blue-600" />
            Facebook Pages ({businessData.pages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businessData.pages.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No Facebook pages found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessData.pages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{page.name}</h3>
                    {page.verification_status === 'blue_verified' && (
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{page.category}</p>
                  {page.fan_count && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Users className="w-4 h-4 mr-1" />
                      {page.fan_count.toLocaleString()} followers
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" className="flex-1">
                      Manage
                    </Button>
                    {page.link && (
                      <a href={page.link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="secondary">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ad Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Ad Accounts ({businessData.adAccounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businessData.adAccounts.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No ad accounts found.</p>
          ) : (
            <div className="space-y-4">
              {businessData.adAccounts.map((account) => {
                const status = getAccountStatus(account.account_status);
                return (
                  <div key={account.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-600">ID: {account.account_id}</p>
                      </div>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Currency:</span>
                        <p className="font-medium">{account.currency}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Timezone:</span>
                        <p className="font-medium">{account.timezone_name}</p>
                      </div>
                      {account.balance && (
                        <div>
                          <span className="text-gray-600">Balance:</span>
                          <p className="font-medium">{account.balance} {account.currency}</p>
                        </div>
                      )}
                      {account.spend_cap && (
                        <div>
                          <span className="text-gray-600">Spend Cap:</span>
                          <p className="font-medium">{account.spend_cap} {account.currency}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="primary">
                        Create Campaign
                      </Button>
                      <Button size="sm" variant="secondary">
                        View Analytics
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Accounts */}
      {businessData.businesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-600" />
              Business Accounts ({businessData.businesses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessData.businesses.map((business) => (
                <div key={business.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{business.name}</h3>
                      <p className="text-sm text-gray-600">ID: {business.id}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      business.verification_status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {business.verification_status === 'verified' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  {business.created_time && (
                    <p className="text-sm text-gray-600 mb-3">
                      Created: {new Date(business.created_time).toLocaleDateString()}
                    </p>
                  )}
                  <Button size="sm" variant="secondary">
                    Manage Business
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
