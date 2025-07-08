# DiMark AI - AI-powered AdTech Platform

A full-stack application for creating and managing AI-powered Facebook advertisements.

## Features

### Authentication
- ✅ Email/Password Registration and Login
- ✅ Facebook OAuth Login/Signup
- ✅ JWT-based authentication with refresh tokens
- ✅ Password validation and hashing
- ✅ Role-based access control (User/Admin)

### Facebook Integration
- ✅ Facebook SDK integration
- ✅ Facebook Login/Signup functionality
- ✅ Facebook Pages and Ad Accounts retrieval
- ✅ Access token management

### User Management
- ✅ User profile management
- ✅ Password updates
- ✅ Admin user management
- ✅ Profile picture uploads

### Frontend Features
- ✅ Modern React application with TypeScript
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected routes
- ✅ Error handling and loading states
- ✅ Form validation

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB integration with Mongoose
- ✅ Rate limiting and security middleware
- ✅ Facebook token verification
- ✅ Comprehensive error handling

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Facebook Developer Account

### Installation

1. **Clone and Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

2. **Configure Environment Variables**
   
   Backend `.env`:
   ```bash
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRY=1h
   JWT_REFRESH_EXPIRY=7d
   ```
   
   Frontend `.env`:
   ```bash
   VITE_API_URL=http://localhost:3000
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   VITE_NODE_ENV=development
   ```

3. **Set Up Facebook App** (See [FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md) for detailed instructions)
   - Create a Facebook App on developers.facebook.com
   - Add Facebook Login product
   - Configure OAuth redirect URIs
   - Get your App ID and update environment variables

4. **Start Development Servers**
   ```bash
   # Backend (runs on port 3000)
   cd backend
   npm run dev
   
   # Frontend (runs on port 5173)
   cd client
   npm run dev
   ```

5. **Visit the Application**
   - Open http://localhost:5173
   - Test regular signup/login
   - Test Facebook login/signup

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/facebook-login` - Facebook login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Admin (Protected)
- `GET /api/auth/users` - Get all users
- `DELETE /api/auth/users/:id` - Delete user

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Facebook SDK for JavaScript

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS middleware
- Rate limiting

## Project Structure

```
├── backend/
│   ├── auth-server/          # Authentication module
│   ├── common/               # Shared utilities and types
│   ├── scripts/              # Database scripts
│   └── tests/                # Test files
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
└── docs/                     # Documentation
```

## Security Features

- Password strength validation
- JWT access/refresh token pattern
- Rate limiting on auth endpoints
- CORS configuration
- Facebook token verification
- Input validation and sanitization
- Role-based access control

## Development

### Running Tests
```bash
cd backend
npm run test
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
# dimarkAI
