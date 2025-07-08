import { BaseRepository } from './BaseRepository';
import { User, IUser } from '../models/User';
import { User as UserType } from '../types/auth.types';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async findByRole(role: 'admin' | 'user'): Promise<IUser[]> {
    return await this.findMany({ role });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<IUser | null> {
    return await this.update(userId, { 
      password: hashedPassword,
      updatedAt: new Date()
    });
  }

  async emailExists(email: string): Promise<boolean> {
    return await this.exists({ email: email.toLowerCase() });
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<IUser> {
    return await this.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });
  }

  async getAllUsersWithoutPassword(): Promise<Omit<UserType, 'password'>[]> {
    const users = await this.model
      .find({})
      .select('-password')
      .exec();
    
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async getUserByIdWithoutPassword(userId: string): Promise<Omit<UserType, 'password'> | null> {
    const user = await this.model
      .findById(userId)
      .select('-password')
      .exec();
    
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
