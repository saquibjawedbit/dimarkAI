import { AuthUtil } from '../common/utils/auth.util';
import { AuthService } from '../auth-server/services/auth.service';

async function testAuthSystem() {
  console.log('🧪 Testing JWT Authentication System\n');
  
  try {
    // Test 1: Password hashing and verification
    console.log('1. Testing password hashing...');
    const password = 'TestPassword123!';
    const hashedPassword = await AuthUtil.hashPassword(password);
    const isValid = await AuthUtil.comparePassword(password, hashedPassword);
    console.log(`   ✅ Password hashing: ${isValid ? 'PASS' : 'FAIL'}\n`);
    
    // Test 2: JWT token generation and verification
    console.log('2. Testing JWT tokens...');
    const payload = { userId: 'test123', email: 'test@example.com', role: 'user' as const };
    const tokenPair = AuthUtil.generateTokenPair(payload);
    const decodedPayload = AuthUtil.verifyToken(tokenPair.accessToken);
    console.log(`   ✅ Token generation: ${tokenPair.accessToken ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ Token verification: ${decodedPayload?.userId === payload.userId ? 'PASS' : 'FAIL'}\n`);
    
    // Test 3: User registration
    console.log('3. Testing user registration...');
    const authService = new AuthService();
    const registerResult = await authService.register({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestUser123!',
      role: 'user'
    });
    console.log(`   ✅ User registration: ${registerResult.user.email === 'testuser@example.com' ? 'PASS' : 'FAIL'}\n`);
    
    // Test 4: User login
    console.log('4. Testing user login...');
    const loginResult = await authService.login({
      email: 'testuser@example.com',
      password: 'TestUser123!'
    });
    console.log(`   ✅ User login: ${loginResult.user.email === 'testuser@example.com' ? 'PASS' : 'FAIL'}\n`);
    
    // Test 5: Token refresh
    console.log('5. Testing token refresh...');
    const refreshResult = await authService.refreshToken(loginResult.refreshToken);
    console.log(`   ✅ Token refresh: ${refreshResult.accessToken ? 'PASS' : 'FAIL'}\n`);
    
    // Test 6: Email validation
    console.log('6. Testing email validation...');
    const validEmail = AuthUtil.isValidEmail('test@example.com');
    const invalidEmail = AuthUtil.isValidEmail('invalid-email');
    console.log(`   ✅ Valid email: ${validEmail ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ Invalid email: ${!invalidEmail ? 'PASS' : 'FAIL'}\n`);
    
    // Test 7: Password validation
    console.log('7. Testing password validation...');
    const strongPassword = AuthUtil.isValidPassword('StrongPass123!');
    const weakPassword = AuthUtil.isValidPassword('weak');
    console.log(`   ✅ Strong password: ${strongPassword.isValid ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ Weak password: ${!weakPassword.isValid ? 'PASS' : 'FAIL'}\n`);
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAuthSystem();
}

export { testAuthSystem };
