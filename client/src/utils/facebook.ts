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
      scope: 'public_profile,email',
      return_scopes: true
    });
  });
};
