# MongoDB Setup Guide

This project has been migrated from in-memory storage to MongoDB with a proper architecture using models, repositories, and common utilities.

## Project Structure

```
backend/
├── common/                     # Shared utilities and configurations
│   ├── config/
│   │   └── config.ts          # Environment configuration
│   ├── database/
│   │   └── connection.ts      # MongoDB connection management
│   ├── models/
│   │   └── User.ts           # User model schema
│   ├── repositories/
│   │   ├── BaseRepository.ts  # Generic repository pattern
│   │   └── UserRepository.ts  # User-specific repository
│   ├── types/
│   │   ├── auth.types.ts     # Authentication type definitions
│   │   └── index.ts          # Common type exports
│   ├── utils/
│   │   ├── auth.util.ts      # Authentication utilities
│   │   └── errors.ts         # Custom error classes
│   └── index.ts              # Common exports
├── auth-server/               # Authentication module
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── types/
└── index.ts                  # Main server file
```

## Features

### Database Layer
- **MongoDB Connection**: Singleton pattern with connection management
- **Models**: Mongoose models with schema validation
- **Repositories**: Repository pattern for data access abstraction
- **Base Repository**: Generic CRUD operations

### Authentication System
- **JWT Tokens**: Separate access and refresh tokens
- **Password Security**: bcrypt hashing with salt rounds
- **Role-based Access**: Admin and user roles
- **Error Handling**: Custom error classes for different scenarios

### Common Utilities
- **Configuration Management**: Environment-based config
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Classes**: Structured error handling
- **Authentication Utils**: Token generation, validation, password handling

## Environment Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Configure MongoDB**:
   Update the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=auth_app
   ```

4. **Set JWT Secrets**:
   ```env
   JWT_ACCESS_SECRET=your-super-secret-access-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   ```

## Running the Application

1. **Development Mode**:
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

3. **Running Tests**:
   ```bash
   npm test
   ```

## Demo Users

In development mode, the following demo users are automatically created:

- **Admin User**: 
  - Email: `admin@example.com`
  - Password: `Admin123!`
  - Role: `admin`

- **Regular User**: 
  - Email: `user@example.com`
  - Password: `User123!`
  - Role: `user`

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token

### Protected Endpoints
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/logout` - Logout user

### Admin Endpoints
- `GET /api/auth/users` - Get all users
- `DELETE /api/auth/users/:userId` - Delete user

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  email: string (unique, lowercase),
  password: string (hashed),
  role: 'admin' | 'user',
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The application uses custom error classes for structured error handling:

- `ValidationError` (400) - Input validation errors
- `AuthenticationError` (401) - Authentication failures
- `AuthorizationError` (403) - Access denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Data conflicts (e.g., duplicate email)
- `DatabaseError` (500) - Database operation errors

## Security Features

- Password strength validation
- JWT token expiration
- Rate limiting on auth endpoints
- Role-based access control
- Input sanitization and validation
- Secure password hashing

## MongoDB Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

## Migration from In-Memory Storage

The project has been successfully migrated from in-memory Map storage to MongoDB:

- ✅ User data now persists in MongoDB
- ✅ Repository pattern for data access
- ✅ Proper error handling with custom exceptions
- ✅ Configuration management
- ✅ Type safety maintained
- ✅ All existing API endpoints work unchanged

## Development Tips

1. **Database Queries**: Use the repository methods instead of direct MongoDB queries
2. **Error Handling**: Use custom error classes for consistent error responses
3. **Configuration**: Add new config values to `common/config/config.ts`
4. **New Models**: Follow the pattern in `common/models/User.ts`
5. **Testing**: Mock the repository layer for unit tests
