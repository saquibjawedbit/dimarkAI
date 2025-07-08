import React, { useState } from 'react';
import { useUserManagement } from '../hooks/useUserManagement';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, Shield, RefreshCw } from 'lucide-react';

export const UserManagementExample: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    updateProfile,
    updatePassword,
    refreshProfile,
    clearError,
    logout
  } = useUserManagement();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({ name });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) return;
    
    setIsUpdating(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshProfile = async () => {
    try {
      await refreshProfile();
      alert('Profile refreshed successfully!');
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Please log in to access user management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button
          onClick={handleLogout}
          variant="secondary"
          disabled={isLoading}
        >
          Logout
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <Button
                onClick={clearError}
                variant="secondary"
                className="mt-2 text-xs"
              >
                Clear Error
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <p className="text-sm text-gray-900 font-mono">{user?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Shield size={16} />
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-sm text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <Button
              onClick={handleRefreshProfile}
              variant="secondary"
              disabled={isLoading}
              leftIcon={<RefreshCw size={16} />}
              fullWidth
            >
              Refresh Profile
            </Button>
          </CardContent>
        </Card>

        {/* Update Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={16} />}
              placeholder="Enter your name"
            />
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating || !name.trim() || name === user?.name}
              isLoading={isUpdating}
              fullWidth
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Update Password Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              Update Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-4">
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdating || !currentPassword || !newPassword}
                isLoading={isUpdating}
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};
