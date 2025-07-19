import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface DatabaseConfig {
  uri: string;
  name: string;
}

interface JWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

interface ServerConfig {
  port: number;
  env: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

interface GeminiConfig {
  apiKey: string;
}

interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  redis: RedisConfig;
  gemini: GeminiConfig;
  allowedOrigin: string;
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'auth_app',
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '60m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  allowedOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

if (config.server.env === 'production') {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
}
