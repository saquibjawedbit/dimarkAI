import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as ApiUser } from '../services/user';
import { FacebookPage, FacebookAdAccount } from '../types';
import { facebookService } from '../services/facebook';
import { useUserManagement } from '../hooks/useUserManagement';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { LoginRequest, RegisterRequest } from '../services/api';
import { initializeFacebookSDK, loginWithFacebook } from '../utils/facebook';

// Extended user interface for Facebook integration
interface ExtendedUser extends ApiUser {
  businessName?: string;
  businessType?: string;
  profilePicture?: string;
  facebookPages?: FacebookPage[];
  facebookAdAccounts?: FacebookAdAccount[];
}

interface AuthContextType {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signupWithFacebook: () => Promise<void>;
  connectFacebookPage: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userManagement = useUserManagement();
  const authHook = useAuthHook();
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [facebookInitialized, setFacebookInitialized] = useState(false);

  // Initialize Facebook SDK
  useEffect(() => {
    const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (fbAppId && !facebookInitialized) {
      initializeFacebookSDK(fbAppId)
        .then(() => {
          setFacebookInitialized(true);
        })
        .catch((error) => {
          console.error('Failed to initialize Facebook SDK:', error);
        });
    }
  }, [facebookInitialized]);

  // Transform API user to extended user
  const user = userManagement.user ? {
    ...userManagement.user,
    businessName: '',
    businessType: '',
    facebookPages: [],
    facebookAdAccounts: []
  } as ExtendedUser : null;

  const login = async (email: string, password: string) => {
    const credentials: LoginRequest = { email, password };
    await userManagement.login(credentials);
  };

  const register = async (email: string, password: string, name: string) => {
    const userData: RegisterRequest = { email, password, name };
    await userManagement.register(userData);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await userManagement.updatePassword({ currentPassword, newPassword });
  };

  const signupWithFacebook = async () => {
    if (!facebookInitialized) {
      throw new Error('Facebook SDK not initialized');
    }

    setFacebookLoading(true);
    try {
      const { accessToken } = await loginWithFacebook();
      
      // Use the backend Facebook login endpoint
      await authHook.facebookLogin(accessToken);
      
      // After successful Facebook login, get user profile
      await userManagement.refreshProfile();

      // Get Facebook pages and ad accounts
      facebookService.setAccessToken(accessToken);
      const [pages, adAccounts] = await Promise.all([
        facebookService.getPages(),
        facebookService.getAdAccounts()
      ]);

      // Store Facebook data in localStorage for now
      localStorage.setItem('facebook_data', JSON.stringify({ pages, adAccounts }));
    } catch (error) {
      console.error('Facebook signup failed', error);
      throw new Error('Facebook signup failed. Please try again.');
    } finally {
      setFacebookLoading(false);
    }
  };

  const connectFacebookPage = async () => {
    if (!user) throw new Error('No user logged in');
    if (!facebookInitialized) {
      throw new Error('Facebook SDK not initialized');
    }

    setFacebookLoading(true);
    try {
      const { accessToken } = await loginWithFacebook();
      
      facebookService.setAccessToken(accessToken);
      const [pages, adAccounts] = await Promise.all([
        facebookService.getPages(),
        facebookService.getAdAccounts()
      ]);

      // Store Facebook data
      localStorage.setItem('facebook_data', JSON.stringify({ pages, adAccounts }));
    } catch (error) {
      console.error('Failed to connect Facebook page:', error);
      throw new Error('Failed to connect Facebook page. Please try again.');
    } finally {
      setFacebookLoading(false);
    }
  };

  const isLoading = userManagement.isLoading || facebookLoading || authHook.isLoading;
  const error = userManagement.error || authHook.error;

  const clearError = () => {
    userManagement.clearError();
    authHook.clearError();
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated: userManagement.isAuthenticated,
      isLoading,
      error,
      login,
      register,
      signupWithFacebook,
      connectFacebookPage,
      logout: userManagement.logout,
      clearError,
      updatePassword,
      refreshProfile: userManagement.refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};