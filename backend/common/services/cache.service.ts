import { createClient, RedisClientType } from 'redis';
import { config } from '../config/config';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

export class RedisCacheService {
  private static instance: RedisCacheService;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
      database: config.redis.db,
    });

    this.setupEventHandlers();
  }

  public static getInstance(): RedisCacheService {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new RedisCacheService();
    }
    return RedisCacheService.instance;
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('📡 Redis client connecting...');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      console.log('✅ Redis client connected and ready');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      this.isConnected = false;
      console.log('🔌 Redis client disconnected');
    });
  }

  /**
   * Connect to Redis
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.client.connect();
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Set a value in cache with optional TTL
   * @param key - Cache key
   * @param value - Value to cache (will be JSON stringified)
   * @param options - Cache options including TTL in seconds
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    const stringValue = JSON.stringify(value);
    const ttl = options.ttl || 30 * 60; // Default 30 minutes in seconds

    try {
      await this.client.setEx(key, ttl, stringValue);
      console.log(`Cache SET: ${key} (expires in ${Math.round(ttl / 60)} minutes)`);
    } catch (error) {
      console.error('❌ Redis SET error:', error);
      throw error;
    }
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const value = await this.client.get(key);
      
      if (value === null) {
        return null;
      }

      console.log(`Cache HIT: ${key}`);
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('❌ Redis GET error:', error);
      return null;
    }
  }

  /**
   * Delete a specific key from cache
   * @param key - Cache key
   * @returns true if key existed and was deleted
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const result = await this.client.del(key);
      const deleted = result > 0;
      
      if (deleted) {
        console.log(`Cache DELETE: ${key}`);
      }
      
      return deleted;
    } catch (error) {
      console.error('❌ Redis DELETE error:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in cache
   * @param key - Cache key
   * @returns true if key exists
   */
  async has(key: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('❌ Redis EXISTS error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ size: number; keys: string[]; connected: boolean }> {
    if (!this.isConnected) {
      return { size: 0, keys: [], connected: false };
    }

    try {
      const keys = await this.client.keys('*');
      return {
        size: keys.length,
        keys: keys,
        connected: this.isConnected
      };
    } catch (error) {
      console.error('❌ Redis KEYS error:', error);
      return { size: 0, keys: [], connected: this.isConnected };
    }
  }

  /**
   * Clear all cache entries (be careful with this in production!)
   */
  async clear(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.client.flushDb();
      console.log('Cache CLEAR: All entries removed');
    } catch (error) {
      console.error('❌ Redis FLUSHDB error:', error);
      throw error;
    }
  }

  /**
   * Get TTL for a key
   * @param key - Cache key
   * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
   */
  async getTTL(key: string): Promise<number> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('❌ Redis TTL error:', error);
      return -2;
    }
  }

  /**
   * Set expiry for an existing key
   * @param key - Cache key
   * @param seconds - TTL in seconds
   * @returns true if expiry was set
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error('❌ Redis EXPIRE error:', error);
      return false;
    }
  }

  /**
   * Check if Redis is connected
   */
  isConnectionActive(): boolean {
    return this.isConnected;
  }

  /**
   * Gracefully shutdown the cache service
   */
  async shutdown(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.quit();
        console.log('✅ Redis cache service shutdown completed');
      } catch (error) {
        console.error('❌ Error during Redis shutdown:', error);
      }
    }
  }
}

// Specialized methods for Facebook access tokens
export class FacebookTokenCache {
  private static readonly TOKEN_TTL = 60 * 60; // 1 hour in seconds
  private cache: RedisCacheService;

  constructor() {
    this.cache = RedisCacheService.getInstance();
  }

  /**
   * Store Facebook access token for a user
   * @param userId - User ID
   * @param accessToken - Facebook access token
   */
  async setUserToken(userId: string, accessToken: string): Promise<void> {
    const key = this.getUserTokenKey(userId);
    await this.cache.set(key, accessToken, { ttl: FacebookTokenCache.TOKEN_TTL });
  }

  /**
   * Get Facebook access token for a user
   * @param userId - User ID
   * @returns Facebook access token or null if not found/expired
   */
  async getUserToken(userId: string): Promise<string | null> {
    const key = this.getUserTokenKey(userId);
    return await this.cache.get<string>(key);
  }

  /**
   * Remove Facebook access token for a user
   * @param userId - User ID
   * @returns true if token was removed
   */
  async removeUserToken(userId: string): Promise<boolean> {
    const key = this.getUserTokenKey(userId);
    return await this.cache.delete(key);
  }

  /**
   * Check if user has a valid Facebook access token
   * @param userId - User ID
   * @returns true if user has valid token
   */
  async hasUserToken(userId: string): Promise<boolean> {
    const key = this.getUserTokenKey(userId);
    return await this.cache.has(key);
  }

  /**
   * Get TTL for user's Facebook token
   * @param userId - User ID
   * @returns TTL in seconds
   */
  async getUserTokenTTL(userId: string): Promise<number> {
    const key = this.getUserTokenKey(userId);
    return await this.cache.getTTL(key);
  }

  /**
   * Generate cache key for user's Facebook token
   * @param userId - User ID
   * @returns Cache key
   */
  private getUserTokenKey(userId: string): string {
    return `facebook_token:${userId}`;
  }
}
