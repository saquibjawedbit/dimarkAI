import { 
  apiService, 
  AuthResponse, 
  RegisterRequest, 
  LoginRequest, 
  UpdatePasswordRequest 
} from './api';

export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Registering user:', userData);
    const response = await apiService.post<AuthResponse>('/api/auth/register', userData);
    console.log('Registration response:', response);
    if (response.data) {
      // Store tokens
      apiService.setAccessToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/login', credentials);
    
    if (response.data) {
      // Store tokens
      apiService.setAccessToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      apiService.removeAccessToken();
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse['user']> {
    const response = await apiService.get<{ user: AuthResponse['user'] }>('/api/auth/profile');
    
    if (response.data?.user) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to get profile');
  }

  /**
   * Update user password
   */
  async updatePassword(passwordData: UpdatePasswordRequest): Promise<void> {
    const response = await apiService.put('/api/auth/password', passwordData);
    
    if (!response.message) {
      throw new Error('Failed to update password');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ accessToken: string; refreshToken: string }>('/api/auth/refresh-token', {
      refreshToken
    });
    
    if (response.data) {
      apiService.setAccessToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Token refresh failed');
  }

  /**
   * Facebook login
   */
  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/api/auth/facebook-login', {
      accessToken
    });
    
    if (response.data) {
      // Store tokens
      apiService.setAccessToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Facebook login failed');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

// Export singleton instance
export const authService = new AuthService();
