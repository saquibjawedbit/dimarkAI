import { apiService } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  businessName?: string;
  businessType?: string;
  profilePicture?: string;
  facebookPages?: any[];
  facebookAdAccounts?: any[];
}

export class UserService {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiService.get<{ users: User[]; count: number }>('/api/auth/users');
    
    if (response.data?.users) {
      return response.data.users;
    }
    
    throw new Error(response.message || 'Failed to get users');
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    const response = await apiService.delete(`/api/auth/users/${userId}`);
    
    if (!response.message) {
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>('/api/auth/profile', profileData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('access_token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseURL}/api/auth/profile/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.profilePictureUrl;
    }

    throw new Error('Failed to upload profile picture');
  }
}

// Export singleton instance
export const userService = new UserService();
