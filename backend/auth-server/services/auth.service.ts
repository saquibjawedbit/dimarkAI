import { 
  AuthUtil, 
  JWTPayload, 
  UserRepository,
  AuthenticationError,
  ValidationError,
  ConflictError,
  NotFoundError,
  RegisterRequest,
  LoginRequest,
  AuthResponse
} from '../../common';
import { User } from '../../common/types/auth.types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  
  /**
   * Register a new user
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    const { name, email, password, role = 'user', adsAccountId } = registerData;
    
    // Validate name
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
    
    // Validate email format
    if (!AuthUtil.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }
    
    // Validate password strength
    const passwordValidation = AuthUtil.isValidPassword(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await AuthUtil.hashPassword(password);
    
    // Create user
    const user = await this.userRepository.createUser({
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
      adsAccountId
    });
    
    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    const { accessToken, refreshToken } = AuthUtil.generateTokenPair(tokenPayload);
    
    // Return response without password
    const userResponse = await this.userRepository.getUserByIdWithoutPassword(user._id);
    
    return {
      user: userResponse!,
      accessToken,
      refreshToken
    };
  }

  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    // Validate access token
    if (!accessToken) {
      throw new ValidationError('Facebook access token is required');
    }

    // Verify Facebook token and get user info
    const facebookUser = await AuthUtil.verifyFacebookToken(accessToken);
    if (!facebookUser) {
      throw new AuthenticationError('Invalid Facebook access token');
    }

    // Fetch Facebook Ads Account ID
    const adsAccountId = await AuthUtil.fetchFacebookAdsAccountId(accessToken); 
    // Check if user already exists
    let user = await this.userRepository.findByEmail(facebookUser.email);
    if (!user) {
      // Create new user if not exists
      // Generate a random password for social login users (they won't use it for login)
      const randomPassword = AuthUtil.generateRandomPassword();
      const hashedPassword = await AuthUtil.hashPassword(randomPassword);
      
      user = await this.userRepository.createUser({
        name: facebookUser.name,
        email: facebookUser.email,
        password: hashedPassword, // Hashed random password for social login
        role: 'user', // Default role for social login
        adsAccountId: adsAccountId || undefined
      });
    } else {
      // Update existing user's ads account ID if they don't have one and we found one
      if (!user.adsAccountId && adsAccountId) {
        await this.userRepository.updateAdsAccountId(user._id, adsAccountId);
        // Refresh user data to include the updated adsAccountId
        user = await this.userRepository.findById(user._id);
        if (!user) {
          throw new NotFoundError('User not found after update');
        }
      }
    }
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    const { accessToken: newAccessToken, refreshToken } = AuthUtil.generateTokenPair(tokenPayload);
    // Return response without password
    const userResponse = await this.userRepository.getUserByIdWithoutPassword(user._id);
    return {
      user: userResponse!,
      accessToken: newAccessToken,
      refreshToken
    };
  }
  
  /**
   * Login user
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { email, password } = loginData;
    
    // Validate email format
    if (!AuthUtil.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }
    
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await AuthUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    const { accessToken, refreshToken } = AuthUtil.generateTokenPair(tokenPayload);
    
    // Return response without password
    const userResponse = await this.userRepository.getUserByIdWithoutPassword(user._id);
    
    return {
      user: userResponse!,
      accessToken,
      refreshToken
    };
  }
  
  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const payload = AuthUtil.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AuthenticationError('Invalid refresh token');
    }
    
    // Check if user still exists
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Generate new tokens
    const tokenPayload: JWTPayload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    return AuthUtil.generateTokenPair(tokenPayload);
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    return await this.userRepository.getUserByIdWithoutPassword(userId);
  }
  
  /**
   * Update user password
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Verify current password
    const isCurrentPasswordValid = await AuthUtil.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }
    
    // Validate new password
    const passwordValidation = AuthUtil.isValidPassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError(`New password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Hash new password
    const hashedNewPassword = await AuthUtil.hashPassword(newPassword);
    
    // Update user password
    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }
  
  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.delete(userId);
  }
  
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return await this.userRepository.getAllUsersWithoutPassword();
  }
  
  /**
   * Initialize with demo users (for development)
   */
  async initializeDemoUsers(): Promise<void> {
    try {
      // Check if admin user already exists
      const adminExists = await this.userRepository.findByEmail('admin@example.com');
      if (!adminExists) {
        await this.register({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'Admin123!',
          role: 'admin'
        });
        console.log('Demo admin user created');
      }
      
      // Check if regular user already exists
      const userExists = await this.userRepository.findByEmail('user@example.com');
      if (!userExists) {
        await this.register({
          name: 'Demo User',
          email: 'user@example.com',
          password: 'User123!',
          role: 'user'
        });
        console.log('Demo regular user created');
      }
      
      console.log('Demo users initialization completed');
    } catch (error) {
      console.log('Error during demo users initialization:', error);
    }
  }
}