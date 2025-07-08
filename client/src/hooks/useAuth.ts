import { useState, useCallback } from 'react';
import { authService } from '../services/auth';
import { AuthResponse, RegisterRequest, LoginRequest, UpdatePasswordRequest } from '../services/api';

export interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  facebookLogin: (accessToken: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updatePassword: (passwordData: UpdatePasswordRequest) => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);


  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Registering user:', userData);
      const response = await authService.register(userData);
      console.log('Registration response:', response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (passwordData: UpdatePasswordRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.updatePassword(passwordData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const facebookLogin = useCallback(async (accessToken: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.facebookLogin(accessToken);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Facebook login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    updatePassword,
    clearError,
    facebookLogin,
  };
};
