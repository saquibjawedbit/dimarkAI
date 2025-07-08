import { Request, Response } from 'express';
import { 
  LoginRequest, 
  RegisterRequest, 
  AppError 
} from '../../common';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * User registration
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            console.log('Registering user:', req.body);
            const registerData: RegisterRequest = req.body;
            
            if (!registerData.name || !registerData.email || !registerData.password) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Name, email and password are required'
                });
                return;
            }
            
            const result = await this.authService.register(registerData);
            
            res.status(201).json({
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async facebookLogin(req: Request, res: Response): Promise<void> {
        try {
            const { accessToken } = req.body;
            
            if (!accessToken) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Facebook access token is required'
                });
                return;
            }
            
            const result = await this.authService.facebookLogin(accessToken);
            
            res.status(200).json({
                message: 'Facebook login successful',
                data: result
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * User login
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const loginData: LoginRequest = req.body;
            
            if (!loginData.email || !loginData.password) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Email and password are required'
                });
                return;
            }
            
            const result = await this.authService.login(loginData);
            
            res.status(200).json({
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * User logout (client-side token removal)
     */
    async logout(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            message: 'Logout successful',
            data: { message: 'Token should be removed from client storage' }
        });
    }
    
    /**
     * Refresh access token
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Refresh token is required'
                });
                return;
            }
            
            const result = await this.authService.refreshToken(refreshToken);
            
            res.status(200).json({
                message: 'Token refreshed successfully',
                data: result
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * Get current user profile
     */
    async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Unauthorized',
                    message: 'User not authenticated'
                });
                return;
            }
            
            const user = await this.authService.getUserById(req.user.userId);
            
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    message: 'User profile not found'
                });
                return;
            }
            
            res.status(200).json({
                message: 'Profile retrieved successfully',
                data: { user }
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * Update user password
     */
    async updatePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Unauthorized',
                    message: 'User not authenticated'
                });
                return;
            }
            
            const { currentPassword, newPassword } = req.body;
            
            if (!currentPassword || !newPassword) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Current password and new password are required'
                });
                return;
            }
            
            await this.authService.updatePassword(req.user.userId, currentPassword, newPassword);
            
            res.status(200).json({
                message: 'Password updated successfully'
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * Get all users (admin only)
     */
    async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const users = await this.authService.getAllUsers();
            
            res.status(200).json({
                message: 'Users retrieved successfully',
                data: { users, count: users.length }
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    
    /**
     * Delete user (admin only)
     */
    async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'User ID is required'
                });
                return;
            }
            
            const deleted = await this.authService.deleteUser(userId);
            
            if (!deleted) {
                res.status(404).json({
                    error: 'User not found',
                    message: 'User not found or already deleted'
                });
                return;
            }
            
            res.status(200).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    /**
     * Central error handler
     */
    private handleError(res: Response, error: unknown): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                error: error.constructor.name,
                message: error.message
            });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({
                error: 'Server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}