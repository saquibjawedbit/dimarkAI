import { Request } from 'express';
import { JWTPayload } from './types/auth.types';

// Database
export { DatabaseConnection } from './database/connection';

// Services
export { RedisCacheService, FacebookTokenCache } from './services/cache.service';

// Models
export { User, IUser } from './models/User';

// Repositories
export { BaseRepository } from './repositories/BaseRepository';
export { UserRepository } from './repositories/UserRepository';

// Types
export * from './types';

// Utils
export { AuthUtil } from './utils/auth.util';
export * from './utils/errors';

// Config
export { config } from './config/config';

// Interfaces
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
