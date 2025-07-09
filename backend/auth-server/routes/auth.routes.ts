import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', AuthMiddleware.rateLimit(5, 15 * 60 * 1000), authController.register.bind(authController));
router.post('/facebook-login', AuthMiddleware.rateLimit(5, 15 * 60 * 1000), authController.facebookLogin.bind(authController));
router.post('/login', AuthMiddleware.rateLimit(5, 15 * 60 * 1000), authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Protected routes (require authentication)
router.post('/logout', AuthMiddleware.authenticateToken, authController.logout.bind(authController));
router.get('/profile', AuthMiddleware.authenticateToken, authController.getProfile.bind(authController));
router.put('/password', AuthMiddleware.authenticateToken, authController.updatePassword.bind(authController));

// Facebook token management routes
router.get('/facebook-token/status', AuthMiddleware.authenticateToken, authController.hasFacebookToken.bind(authController));
router.get('/facebook-token', AuthMiddleware.authenticateToken, authController.getFacebookToken.bind(authController));
router.delete('/facebook-token', AuthMiddleware.authenticateToken, authController.removeFacebookToken.bind(authController));

// Admin routes (require admin role)
router.get('/users', 
    AuthMiddleware.authenticateToken, 
    AuthMiddleware.requireRole('admin'), 
    authController.getAllUsers.bind(authController)
);

router.delete('/users/:userId', 
    AuthMiddleware.authenticateToken, 
    AuthMiddleware.requireRole('admin'), 
    authController.deleteUser.bind(authController)
);

export default router;
