export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  adsAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  adsAccountId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
