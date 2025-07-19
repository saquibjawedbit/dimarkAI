import { Request, Response, NextFunction } from 'express';
import { AuthUtil, JWTPayload } from '../../common';
import { AuthService } from '../services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export class AuthMiddleware {
  /**
   * Verify JWT token middleware
   */
  static authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthUtil.extractTokenFromHeader(authHeader);
      if (!token) {
        res.status(401).json({
          error: 'Access denied',
          message: 'No token provided'
        });
        return;
      }
      
      const payload = AuthUtil.verifyAccessToken(token);
      if (!payload) {
        res.status(401).json({
          error: 'Access denied',
          message: 'Invalid or expired token'
        });
        return;
      }
      
      // Check if user still exists
      const authService = new AuthService();
      const user = await authService.getUserById(payload.userId);
      if (!user) {
        res.status(401).json({
          error: 'Access denied',
          message: 'User not found'
        });
        return;
      }
      
      req.user = {
        ...payload,
        adsAccountId: user.adsAccountId || null // Include ads account ID if available
      };
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Authentication failed'
      });
    }
  };
  
  /**
   * Check if user has required role
   */
  static requireRole(roles: string | string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
        return;
      }
      
      const userRole = req.user.role || 'user';
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!requiredRoles.includes(userRole)) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
        return;
      }
      
      next();
    };
  }
  
  /**
   * Optional authentication - doesn't fail if no token
   */
  static optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthUtil.extractTokenFromHeader(authHeader);
      
      if (token) {
        const payload = AuthUtil.verifyAccessToken(token);
        if (payload) {
          const authService = new AuthService();
          const user = await authService.getUserById(payload.userId);
          if (user) {
            req.user = payload;
          }
        }
      }
      
      next();
    } catch (error) {
      // Silent fail for optional auth
      next();
    }
  };
  
  /**
   * Rate limiting middleware (basic implementation)
   */
  static rateLimit(maxRequests: number = 10, windowMs: number = 15 * 60 * 1000) {
    const requests = new Map<string, { count: number; resetTime: number }>();
    
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      
      const clientRequests = requests.get(clientIp);
      
      if (!clientRequests || now > clientRequests.resetTime) {
        requests.set(clientIp, {
          count: 1,
          resetTime: now + windowMs
        });
        next();
        return;
      }
      
      if (clientRequests.count >= maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
        });
        return;
      }
      
      clientRequests.count++;
      requests.set(clientIp, clientRequests);
      next();
    };
  }
}
