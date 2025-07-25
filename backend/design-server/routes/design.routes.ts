import { Router } from 'express';
import { AuthMiddleware } from '../../auth-server/middleware/auth.middleware';
import { DesignController } from '../controller/design.controller';

const router = Router();
const designController = new DesignController();

router.post('/generate', AuthMiddleware.authenticateToken, designController.design.bind(designController));

export default router;