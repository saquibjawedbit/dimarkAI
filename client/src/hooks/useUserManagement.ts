import { useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUser } from './useUser';
import { userService, User } from '../services/user';
import { LoginRequest, RegisterRequest, UpdatePasswordRequest } from '../services/api';

export interface UseUserManagementReturn {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth operations
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (passwordData: UpdatePasswordRequest) => Promise<void>;
  
  // Profile operations
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  
  // Admin operations
  getAllUsers: () => Promise<User[]>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const auth = useAuth();
  const userHook = useUser();

  // Combine loading states
  const isLoading = auth.isLoading || userHook.isLoading;
  
  // Combine errors (prioritize auth errors)
  const error = auth.error || userHook.error;

  const clearError = useCallback(() => {
    auth.clearError();
    userHook.clearError();
  }, [auth, userHook]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await auth.login(credentials);
      // After successful login, get user profile
      await userHook.getProfile();
    } catch (error) {
      throw error;
    }
  }, [auth, userHook]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
        console.log('Registering user:', userData);
      await auth.register(userData);
      // After successful registration, get user profile
      await userHook.getProfile();
    } catch (error) {
      throw error;
    }
  }, [auth, userHook]);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      // Clear user data
      localStorage.removeItem('user');
    } catch (error) {
      // Even if logout fails, clear local data
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  }, [auth]);

  const updatePassword = useCallback(async (passwordData: UpdatePasswordRequest) => {
    await auth.updatePassword(passwordData);
  }, [auth]);

  const refreshProfile = useCallback(async () => {
    await userHook.refreshProfile();
  }, [userHook]);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    await userHook.updateProfile(profileData);
  }, [userHook]);

  const uploadProfilePicture = useCallback(async (file: File) => {
    return await userHook.uploadProfilePicture(file);
  }, [userHook]);

  // Admin operations
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    try {
      const users = await userService.getAllUsers();
      return users;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await userService.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }, []);

  // Initialize user management
  const initialize = useCallback(async () => {
    try {
      if (userHook.isAuthenticated) {
        await userHook.refreshProfile();
      }
    } catch (error) {
      console.error('Failed to initialize user management:', error);
      // Clear authentication if initialization fails
      await logout();
    }
  }, [userHook, logout]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, []);

  return {
    // User state
    user: userHook.user,
    isAuthenticated: userHook.isAuthenticated,
    isLoading,
    error,
    
    // Auth operations
    login,
    register,
    logout,
    updatePassword,
    
    // Profile operations
    refreshProfile,
    updateProfile,
    uploadProfilePicture,
    
    // Admin operations
    getAllUsers,
    deleteUser,
    
    // Utility
    clearError,
    initialize,
  };
};
