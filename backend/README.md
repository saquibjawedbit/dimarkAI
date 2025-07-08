# Backend Express TypeScript Server

A simple Express server built with TypeScript that provides basic API endpoints.

## Features

- **TypeScript**: Full TypeScript support with proper type definitions
- **Express.js**: Fast, minimalist web framework
- **CORS**: Cross-Origin Resource Sharing enabled
- **Request Logging**: Automatic logging of incoming requests
- **Error Handling**: Centralized error handling middleware
- **Health Check**: Endpoint to monitor server health

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
