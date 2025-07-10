import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth-server/routes/auth.routes';
import campaignRoutes from './ads-server/routes/campaign.routes';
import adSetRoutes from './ads-server/routes/adsets.routes';
import { AuthService } from './auth-server/services/auth.service';
import { AuthMiddleware } from './auth-server/middleware/auth.middleware';
import { DatabaseConnection, config, RedisCacheService } from './common';

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Express TypeScript Server with MongoDB!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MongoDB connected'
  });
});

app.get('/api/health', async (req: Request, res: Response) => {
  const dbConnection = DatabaseConnection.getInstance();
  const cacheService = RedisCacheService.getInstance();
  const cacheStats = await cacheService.getStats();
  
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbConnection.isConnectionActive() ? 'connected' : 'disconnected',
    cache: {
      status: cacheService.isConnectionActive() ? 'connected' : 'disconnected',
      entries: cacheStats.size,
      keys: cacheStats.keys.length
    }
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Campaign routes (protected)
app.use('/api/campaigns', AuthMiddleware.authenticateToken, campaignRoutes);
app.use('/api/adsets', AuthMiddleware.authenticateToken, adSetRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Connect to MongoDB
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    
    // Connect to Redis
    const cacheService = RedisCacheService.getInstance();
    await cacheService.connect();
    
    // Initialize demo users if needed
    if (config.server.env === 'development') {
      const authService = new AuthService();
      await authService.initializeDemoUsers();
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints available at http://localhost:${PORT}/api/auth`);
      console.log(`🗄️  MongoDB connected to: ${config.database.uri}/${config.database.name}`);
      
      if (config.server.env === 'development') {
        console.log(`👥 Demo users available:`);
        console.log(`   Admin: admin@example.com / Admin123!`);
        console.log(`   User:  user@example.com / User123!`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    // Shutdown cache service
    const cacheService = RedisCacheService.getInstance();
    await cacheService.shutdown();
    console.log('✅ Cache service shutdown');
    
    // Disconnect database
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.disconnect();
    console.log('✅ Database disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();