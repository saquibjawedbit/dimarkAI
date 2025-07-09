# Backend Express TypeScript Server

A robust Express server built with TypeScript that provides authentication and user management functionality with Facebook integration.

## Features

- **TypeScript**: Full TypeScript support with proper type definitions
- **Express.js**: Fast, minimalist web framework
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Complete user registration and login system
- **Facebook Integration**: OAuth login with Facebook
- **Facebook Ads Account Integration**: Automatic fetching and storage of Facebook Ads Account IDs
- **Password Security**: Bcrypt password hashing
- **MongoDB Integration**: Mongoose ODM for database operations
- **CORS**: Cross-Origin Resource Sharing enabled
- **Request Logging**: Automatic logging of incoming requests
- **Error Handling**: Centralized error handling middleware
- **Health Check**: Endpoint to monitor server health

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env

# Start development server
npm run dev
```

## Documentation

- **[Facebook Ads Account Integration](./README_ADS_ACCOUNT.md)** - Detailed guide for ads account functionality
- **[MongoDB Setup](./README_MONGODB.md)** - Database configuration guide

## API Endpoints

### GET /
- Returns welcome message and server info

### GET /api/health
- Health check endpoint
- Returns server status and uptime

### GET /api/users
- Returns a list of mock users

### POST /api/users
- Creates a new user
- Requires `name` and `email` in request body

## Scripts

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## Development

The server runs on `http://localhost:3001` by default. You can change the port by setting the `PORT` environment variable.

```bash
PORT=4000 npm run dev
```

## Project Structure

```
backend/
├── index.tsx          # Main server file
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── dist/              # Compiled JavaScript output
```
