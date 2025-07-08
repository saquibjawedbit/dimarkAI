import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth';
import { userService, User, UserProfile } from '../services/user';

export interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  getProfile: () => Promise<User>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  uploadProfilePicture: (file: File) => Promise<string>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getProfile = useCallback(async (): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadProfilePicture = useCallback(async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profilePictureUrl = await userService.uploadProfilePicture(file);
      
      if (user) {
        const updatedUser = { ...user, profilePicture: profilePictureUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return profilePictureUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile picture';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (authService.isAuthenticated()) {
      await getProfile();
    }
  }, [getProfile]);

  // Initialize user from localStorage and refresh if authenticated
  useEffect(() => {
    const initializeUser = async () => {
      // First, try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }

      // If authenticated, refresh profile from server
      if (authService.isAuthenticated()) {
        try {
          await getProfile();
        } catch (error) {
          console.error('Failed to refresh profile:', error);
          // If refresh fails, clear stored data
          setUser(null);
          localStorage.removeItem('user');
          authService.logout();
        }
      }
    };

    initializeUser();
  }, [getProfile]);

  const isAuthenticated = authService.isAuthenticated() && !!user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    getProfile,
    updateProfile,
    uploadProfilePicture,
    refreshProfile,
    clearError,
  };
};
