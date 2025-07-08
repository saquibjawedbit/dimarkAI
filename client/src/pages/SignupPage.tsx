import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Facebook } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/layout/Logo';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, signupWithFacebook, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      console.log('Registering user:', { name, email, password });
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleFacebookSignup = async () => {
    clearError();
    try {
      await signupWithFacebook();
      navigate('/dashboard');
    } catch (err) {
      console.error('Facebook signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Join DiMark AI and start creating AI-powered Facebook ads.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="bg-error-light/20 text-error p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                leftIcon={<User size={18} />}
              />
              
              <Input
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                leftIcon={<Mail size={18} />}
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                helperText="Must be at least 8 characters"
                leftIcon={<Lock size={18} />}
              />
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
              
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="secondary"
                fullWidth
                leftIcon={<Facebook size={18} />}
                onClick={handleFacebookSignup}
              >
                Sign up with Facebook
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};