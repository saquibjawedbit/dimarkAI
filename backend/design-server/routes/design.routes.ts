import { Router } from 'express';
import { AuthMiddleware } from '../../auth-server/middleware/auth.middleware';
import { DesignController } from '../controller/design.controller';
import multer from 'multer';

// Configure multer for single image upload
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const designController = new DesignController();

// Use multer middleware to handle productImage upload
router.post(
  '/generate',
  AuthMiddleware.authenticateToken,
  upload.single('productImage'),
  designController.design.bind(designController)
);

export default router;