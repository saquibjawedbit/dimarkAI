export interface FacebookSDK {
  init: (params: any) => void;
  login: (callback: (response: any) => void, params?: any) => void;
  api: (path: string, paramsOrCallback: any, callbackOrMethod?: any, finalCallback?: any) => void;
  getLoginStatus: (callback: (response: any) => void) => void;
  logout: (callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const initializeFacebookSDK = (appId: string): Promise<void> => {
  return new Promise((resolve) => {
    // Check if SDK is already loaded
    if (window.FB) {
      resolve();
      return;
    }

    // Define fbAsyncInit
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    // Load the SDK
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  });
};

export const loginWithFacebook = (): Promise<{
  accessToken: string;
  userInfo: {
    id: string;
    name: string;
    email: string;
  };
}> => {
  return new Promise((resolve, reject) => {
    window.FB.login((loginResponse: any) => {
      if (loginResponse.status === 'connected') {
        const accessToken = loginResponse.authResponse.accessToken;
        
        // Get user info
        window.FB.api('/me', { fields: 'id,name,email' }, (userResponse: any) => {
          if (userResponse && !userResponse.error) {
            // Email might not be available due to privacy settings
            const email = userResponse.email || `${userResponse.id}@facebook.temp`;
            
            resolve({
              accessToken,
              userInfo: {
                id: userResponse.id,
                name: userResponse.name || 'Facebook User',
                email: email
              }
            });
          } else {
            reject(new Error(userResponse?.error?.message || 'Failed to get user info'));
          }
        });
      } else {
        reject(new Error('Facebook login was cancelled or failed'));
      }
    }, { 
      scope: [
        'public_profile',
        'email',
        'pages_show_list',
        'pages_read_engagement', 
        'pages_manage_metadata',
        'pages_manage_ads',
        'ads_management',
        'ads_read',
        'business_management',
        'pages_manage_posts'
      ].join(','),
      return_scopes: true
    });
  });
};

export const loginWithFacebookBusiness = (): Promise<{
  accessToken: string;
  userInfo: {
    id: string;
    name: string;
    email: string;
  };
  businessData?: {
    pages: any[];
    adAccounts: any[];
    businesses: any[];
  };
}> => {
  return new Promise((resolve, reject) => {
    window.FB.login((loginResponse: any) => {
      if (loginResponse.status === 'connected') {
        const accessToken = loginResponse.authResponse.accessToken;
        
        // Get user info
        window.FB.api('/me', { fields: 'id,name,email' }, (userResponse: any) => {
          if (userResponse && !userResponse.error) {
            // Email might not be available due to privacy settings
            const email = userResponse.email || `${userResponse.id}@facebook.temp`;
            
            const userInfo = {
              id: userResponse.id,
              name: userResponse.name || 'Facebook User',
              email: email
            };

            // Get business data if permissions are granted
            const businessDataPromises = [
              // Get Facebook Pages
              new Promise((resolvePages) => {
                window.FB.api('/me/accounts', { access_token: accessToken }, (pagesResponse: any) => {
                  resolvePages(pagesResponse?.data || []);
                });
              }),
              
              // Get Ad Accounts
              new Promise((resolveAds) => {
                window.FB.api('/me/adaccounts', { 
                  access_token: accessToken,
                  fields: 'id,name,account_id,currency,timezone_name,account_status'
                }, (adResponse: any) => {
                  resolveAds(adResponse?.data || []);
                });
              }),
              
              // Get Business Accounts
              new Promise((resolveBusiness) => {
                window.FB.api('/me/businesses', { 
                  access_token: accessToken,
                  fields: 'id,name,verification_status'
                }, (businessResponse: any) => {
                  resolveBusiness(businessResponse?.data || []);
                });
              })
            ];

            Promise.all(businessDataPromises)
              .then(([pages, adAccounts, businesses]) => {
                resolve({
                  accessToken,
                  userInfo,
                  businessData: {
                    pages: pages as any[],
                    adAccounts: adAccounts as any[],
                    businesses: businesses as any[]
                  }
                });
              })
              .catch((error) => {
                console.warn('Failed to fetch business data:', error);
                // Still resolve with user info even if business data fails
                resolve({
                  accessToken,
                  userInfo
                });
              });
          } else {
            reject(new Error(userResponse?.error?.message || 'Failed to get user info'));
          }
        });
      } else {
        reject(new Error('Facebook login was cancelled or failed'));
      }
    }, { 
      scope: [
        'public_profile',
        'email',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_metadata',
        'ads_management',
        'ads_read',
        'business_management',
        'pages_manage_posts'
      ].join(','),
      return_scopes: true
    });
  });
};

export const getBusinessAssets = (accessToken: string): Promise<{
  pages: any[];
  adAccounts: any[];
  businesses: any[];
}> => {
  return new Promise((resolve, reject) => {
    const businessDataPromises = [
      // Get Facebook Pages with detailed info
      new Promise((resolvePages) => {
        window.FB.api('/me/accounts', { 
          access_token: accessToken,
          fields: 'id,name,access_token,category,category_list,link,picture,fan_count,verification_status'
        }, (pagesResponse: any) => {
          resolvePages(pagesResponse?.data || []);
        });
      }),
      
      // Get Ad Accounts with detailed info
      new Promise((resolveAds) => {
        window.FB.api('/me/adaccounts', { 
          access_token: accessToken,
          fields: 'id,name,account_id,currency,timezone_name,account_status,funding_source,spend_cap,balance'
        }, (adResponse: any) => {
          resolveAds(adResponse?.data || []);
        });
      }),
      
      // Get Business Accounts
      new Promise((resolveBusiness) => {
        window.FB.api('/me/businesses', { 
          access_token: accessToken,
          fields: 'id,name,verification_status,primary_page,created_time'
        }, (businessResponse: any) => {
          resolveBusiness(businessResponse?.data || []);
        });
      })
    ];

    Promise.all(businessDataPromises)
      .then(([pages, adAccounts, businesses]) => {
        resolve({
          pages: pages as any[],
          adAccounts: adAccounts as any[],
          businesses: businesses as any[]
        });
      })
      .catch(reject);
  });
};
