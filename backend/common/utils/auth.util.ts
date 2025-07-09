import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { JWTPayload, PasswordValidationResult, TokenPair } from '../types/auth.types';

export class AuthUtil {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyFacebookToken(token: string): Promise<any> {
    try {
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`);
      if (!response.ok) {
        throw new Error('Failed to verify Facebook token');
      }
      const data: any = await response.json();
      if (!data.id) {
        throw new Error('Invalid Facebook user data - missing user ID');
      }

      // Email might not be available due to privacy settings or scope limitations
      const email = data.email || `${data.id}@facebook.temp`;

      return {
        id: data.id,
        name: data.name || 'Facebook User',
        email: email
      };
    } catch (error) {
      throw new Error(`Facebook token verification failed: ${(error as Error).message}`);
    }
  }

  /**
   * Fetch Facebook Ads Account ID for the user
   */
  static async fetchFacebookAdsAccountId(token: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${token}&fields=id,name,account_status&limit=1`
      ); if (!response.ok) {
        console.log(response.body);
        console.warn('Failed to fetch Facebook Ads accounts - user might not have ads permissions');
        return null;
      }

      const data: any = await response.json();

      // Return the first active ads account ID if available
      if (data.data && data.data.length > 0) {
        const activeAccount = data.data.find((account: any) => account.account_status === 1);
        if (activeAccount) {
          // Remove 'act_' prefix if present
          return activeAccount.id.replace('act_', '');
        }
        // If no active account, return the first one
        return data.data[0].id.replace('act_', '');
      }

      return null;
    } catch (error) {
      console.warn('Error fetching Facebook Ads Account ID:', (error as Error).message);
      return null;
    }
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate JWT token pair (access + refresh)
   */
  static generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
    const tokenPayload: Record<string, any> = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    try {
      const accessToken = (jwt as any).sign(
        tokenPayload,
        config.jwt.accessTokenSecret,
        { expiresIn: config.jwt.accessTokenExpiry }
      );

      const refreshToken = (jwt as any).sign(
        tokenPayload,
        config.jwt.refreshTokenSecret,
        { expiresIn: config.jwt.refreshTokenExpiry }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new Error('Failed to generate JWT tokens');
    }
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return (jwt as any).verify(token, config.jwt.accessTokenSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return (jwt as any).verify(token, config.jwt.refreshTokenSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify token (backward compatibility)
   */
  static verifyToken(token: string): JWTPayload | null {
    // Try refresh token first (since this is usually called for refresh tokens)
    let payload = this.verifyRefreshToken(token);
    if (payload) return payload;

    // Try access token as fallback
    return this.verifyAccessToken(token);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Generate a secure random token
   */
  static generateRandomToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a secure random password for social login users
   */
  static generateRandomPassword(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    let result = '';

    // Ensure at least one of each required character type
    result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    result += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    result += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    result += '@$!%*?&'[Math.floor(Math.random() * 7)]; // Special char

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Shuffle the result to avoid predictable patterns
    return result.split('').sort(() => Math.random() - 0.5).join('');
  }
}
