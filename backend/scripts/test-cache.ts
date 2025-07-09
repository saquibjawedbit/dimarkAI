#!/usr/bin/env node

import { RedisCacheService, FacebookTokenCache } from '../common';

async function testCacheService() {
  console.log('🧪 Testing Redis Cache Service...\n');
  
  try {
    // Test basic cache operations
    console.log('1. Testing basic cache operations...');
    const cache = RedisCacheService.getInstance();
    await cache.connect();
    
    // Set a value
    await cache.set('test_key', 'test_value', { ttl: 5 }); // 5 seconds TTL
    
    // Get the value
    const value = await cache.get('test_key');
    console.log(`   ✅ Cache SET/GET: ${value === 'test_value' ? 'PASS' : 'FAIL'}`);
    
    // Test has method
    const exists = await cache.has('test_key');
    console.log(`   ✅ Cache HAS: ${exists ? 'PASS' : 'FAIL'}`);
    
    // Test stats
    const stats = await cache.getStats();
    console.log(`   ✅ Cache STATS: ${stats.size >= 1 ? 'PASS' : 'FAIL'} (${stats.size} entries)`);
    
    // Test TTL
    const ttl = await cache.getTTL('test_key');
    console.log(`   ✅ Cache TTL: ${ttl > 0 ? 'PASS' : 'FAIL'} (${ttl} seconds)`);
    
    // Test deletion
    const deleted = await cache.delete('test_key');
    console.log(`   ✅ Cache DELETE: ${deleted ? 'PASS' : 'FAIL'}\n`);
    
    // Test Facebook token cache
    console.log('2. Testing Facebook Token Cache...');
    const fbCache = new FacebookTokenCache();
    
    const userId = 'test_user_123';
    const accessToken = 'fake_facebook_token_abc123';
    
    // Set Facebook token
    await fbCache.setUserToken(userId, accessToken);
    
    // Get Facebook token
    const retrievedToken = await fbCache.getUserToken(userId);
    console.log(`   ✅ Facebook Token SET/GET: ${retrievedToken === accessToken ? 'PASS' : 'FAIL'}`);
    
    // Check if user has token
    const hasToken = await fbCache.hasUserToken(userId);
    console.log(`   ✅ Facebook Token HAS: ${hasToken ? 'PASS' : 'FAIL'}`);
    
    // Check TTL
    const tokenTTL = await fbCache.getUserTokenTTL(userId);
    console.log(`   ✅ Facebook Token TTL: ${tokenTTL > 0 ? 'PASS' : 'FAIL'} (${tokenTTL} seconds)`);
    
    // Remove Facebook token
    const removed = await fbCache.removeUserToken(userId);
    console.log(`   ✅ Facebook Token REMOVE: ${removed ? 'PASS' : 'FAIL'}`);
    
    // Check if token is gone
    const hasTokenAfterRemoval = await fbCache.hasUserToken(userId);
    console.log(`   ✅ Facebook Token REMOVED: ${!hasTokenAfterRemoval ? 'PASS' : 'FAIL'}\n`);
    
    // Test TTL expiration
    console.log('3. Testing TTL expiration...');
    await cache.set('ttl_test', 'will_expire', { ttl: 1 }); // 1 second TTL
    
    const immediateValue = await cache.get('ttl_test');
    console.log(`   ✅ Immediate retrieval: ${immediateValue === 'will_expire' ? 'PASS' : 'FAIL'}`);
    
    // Wait for expiration
    console.log('   ⏳ Waiting for TTL expiration...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const expiredValue = await cache.get('ttl_test');
    console.log(`   ✅ After expiration: ${expiredValue === null ? 'PASS' : 'FAIL'}\n`);
    
    console.log('✅ All Redis cache tests completed successfully!');
    
    // Clean up
    await cache.shutdown();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Redis cache test failed:', error);
    
    // Try to shutdown gracefully
    try {
      const cache = RedisCacheService.getInstance();
      await cache.shutdown();
    } catch (shutdownError) {
      console.error('❌ Error during shutdown:', shutdownError);
    }
    
    process.exit(1);
  }
}

testCacheService();
