import { AuthService } from '../auth-server/services/auth.service';

async function testAdsAccountId() {
  console.log('🧪 Testing Ads Account ID functionality\n');
  
  try {
    const authService = new AuthService();
    
    // Test 1: User registration with ads account ID
    console.log('1. Testing user registration with ads account ID...');
    const registerResult = await authService.register({
      name: 'Test User with Ads',
      email: 'testadsuser@example.com',
      password: 'TestUser123!',
      role: 'user',
      adsAccountId: '123456789'
    });
    
    console.log('   Registration result:', {
      name: registerResult.user.name,
      email: registerResult.user.email,
      adsAccountId: (registerResult.user as any).adsAccountId
    });
    
    const hasAdsAccountId = (registerResult.user as any).adsAccountId === '123456789';
    console.log(`   ✅ User registration with ads account ID: ${hasAdsAccountId ? 'PASS' : 'FAIL'}\n`);
    
    // Test 2: User registration without ads account ID
    console.log('2. Testing user registration without ads account ID...');
    const registerResult2 = await authService.register({
      name: 'Test User No Ads',
      email: 'testnoadsuser@example.com',
      password: 'TestUser123!',
      role: 'user'
    });
    
    console.log('   Registration result:', {
      name: registerResult2.user.name,
      email: registerResult2.user.email,
      adsAccountId: (registerResult2.user as any).adsAccountId
    });
    
    const noAdsAccountId = !(registerResult2.user as any).adsAccountId;
    console.log(`   ✅ User registration without ads account ID: ${noAdsAccountId ? 'PASS' : 'FAIL'}\n`);
    
    console.log('🎉 All ads account ID tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAdsAccountId();
}

export { testAdsAccountId };
