# Express JWT Authentication API

A secure authentication and authorization system using Express.js with JWT tokens and role-based access control.

## Features Implemented

- User registration with validation
- Secure password hashing with bcrypt
- JWT-based authentication with access and refresh tokens
- Role-based access control (user, moderator, admin)
- Protected and public routes
- User profile management
- Admin role management
- Rate limiting for security
- Refresh token mechanism
- Secure error handling

## Setup Instructions

1. Clone the repository
2. Install dependencies:
  ( npm install)
3. Create a `.env` file with the following variables:
   PORT=3000
   JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
   JWT_EXPIRATION=3600
   REFRESH_TOKEN_EXPIRATION=604800
   
4. Start the server:
   (npm run dev)

## API Endpoints

### Public Routes

- `GET /api/public` - Public endpoint accessible by anyone

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate refresh token

### Protected Routes

- `GET /api/protected` - Requires authentication
- `GET /api/moderator` - Requires moderator or admin role
- `GET /api/admin` - Requires admin role

### User Management

- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile (email, password)
- `PUT /api/users/:id/role` - Update user role (admin only)

## Testing Endpoints

### Register User

POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123!",
  "role": "user"
}

### Login

POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Password123!"
}

### Access Protected Route

GET /api/protected
Authorization: Bearer <access_token>

### Update User Profile


PUT /api/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "NewPassword123!"
}


### Admin: Update User Role

PUT /api/users/:id/role
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "role": "moderator"
}


## Security Features

- Password hashing with bcrypt
- JWT token expiration
- Refresh token rotation
- Rate limiting on sensitive endpoints
- Secure error messages (no internal info leakage)
- Role-based access control
- Input validation