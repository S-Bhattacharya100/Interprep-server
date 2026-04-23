# Interprep Server

A Node.js backend server for the Interprep - Real-Time Interview Preparation Platform. This server provides authentication, user management, and role-based access control for the interview preparation application.

## Features

- User authentication with JWT tokens
- Email verification before account activation
- Auto-login after email verification
- Forgot password with reset token
- Secure password reset via email link
- Role-based authorization (User/Admin)
- Password hashing with bcrypt
- MongoDB database integration
- Input validation with Joi
- Error handling middleware
- HTTP request logging with Morgan
- CORS support
- Email service with Nodemailer
- Generic email service for extensibility
- Interview problem management (DSA, HR, System Design)
- Problem filtering by difficulty and category
- Pagination support for problems

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **Logging**: Morgan
- **CORS**: cors middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/interprep
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:3000
   ```
   
   **Note:** For Gmail, use [App Passwords](https://myaccount.google.com/apppasswords) instead of your regular password (requires 2-Step Verification)

4. Start MongoDB service (if running locally)

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string", "role": "user"|"admin" }`
- **Response**: User account created, verification email sent
- **Note**: User account is not verified yet and cannot access protected routes

#### Verify Email
- **GET** `/api/auth/verify-email?token=verification_token`
- **Description**: Verifies user email and auto-logs them in with tokens
- **Response**: Returns `accessToken`, `refreshToken`, and user data
- **Note**: Token is sent via email and expires in 10 minutes

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Requirement**: User must have verified their email first
- **Response**: Returns `accessToken`, `refreshToken`, and user data

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Body**: `{ "refreshToken": "string" }`
- **Response**: Returns new `accessToken`

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: `{ "refreshToken": "string" }`

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**: `{ "email": "string" }`
- **Response**: Reset link sent to email
- **Requirement**: User must not be currently logged in
- **Note**: Reset token expires in 10 minutes

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ "token": "string", "newPassword": "string" }`
- **Response**: Password reset successful
- **Note**: Token must be valid and not expired

### Protected Routes

#### User Access
- **GET** `/api/auth/user`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: user

#### Admin Access
- **GET** `/api/auth/admin`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: admin

### Problem Routes (`/api/problem`)

#### Create Problem
- **POST** `/api/problem`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: Admin only
- **Body**: 
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "DSA|HR|System Design",
    "difficulty": "Easy|Medium|Hard",
    "tags": ["string"],
    "constraints": "string",
    "examples": [
      {
        "input": "string",
        "output": "string",
        "explanation": "string"
      }
    ]
  }
  ```
- **Response**: Created problem object with `createdBy` user ID and timestamps

#### Get Problems
- **GET** `/api/problem?difficulty=Easy&category=DSA&page=1&limit=10`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `difficulty` (optional): Easy | Medium | Hard
  - `category` (optional): DSA | HR | System Design
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**: Array of problems with count and pagination

## Project Structure

```
server/
├── app.js                 # Main Express app
├── server.js              # Server startup file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
└── src/
    ├── config/
    │   └── db.js                  # Database connection
    ├── constants/
    │   ├── roles.js               # User roles
    │   └── statusCodes.js         # HTTP status codes
    ├── controllers/
    │   ├── auth.controller.js     # Authentication logic
    │   └── problem.controller.js  # Problem management logic
    ├── dto/
    │   └── user.dto.js            # Data transfer objects
    ├── middleware/
    │   ├── auth.middleware.js     # JWT authentication
    │   ├── error.middleware.js    # Error handling
    │   ├── role.middleware.js     # Role authorization
    │   └── validate.middleware.js # Input validation
    ├── models/
    │   ├── user.model.js          # User schema
    │   ├── problem.model.js       # Problem schema
    │   └── submission.model.js    # Submission schema
    ├── routes/
    │   ├── auth.routes.js         # Auth endpoints
    │   ├── admin.routes.js        # Admin endpoints
    │   ├── user.routes.js         # User endpoints
    │   └── problem.routes.js      # Problem endpoints
    ├── services/
    │   ├── token.service.js       # JWT token generation
    │   └── email.service.js       # Email service (verification & password reset)
    └── utils/
        ├── token.utils.js         # Utility token generation (verification & reset)
        ├── apiError.js            # Custom error class
        ├── asyncHandler.js        # Async error wrapper
        └── validators/
            └── auth.validator.js  # Joi validation schemas
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret key for JWT access tokens (minimum 32 characters) | Yes |
| `REFRESH_TOKEN_SECRET` | Secret key for JWT refresh tokens (minimum 32 characters) | Yes |
| `EMAIL_USER` | Gmail address for sending verification emails | Yes |
| `EMAIL_PASS` | Gmail app password (not regular password) | Yes |
| `CLIENT_URL` | Frontend URL for verification email links | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Email Configuration

- **Service**: Gmail with OAuth
- **Verification Token**: 32-byte random hex string, expires in 10 minutes
- **Reset Password Token**: 32-byte random hex string, expires in 10 minutes
- **JWT Access Token Expiry**: 15 minutes
- **JWT Refresh Token Expiry**: 7 days
- **Generic Email Function**: Reusable for all email types

### Password Reset Flow

1. User requests password reset via `/forgot-password` endpoint
2. Reset token generated and stored with expiry time
3. Reset link sent to user's email
4. User clicks link and submits new password via `/reset-password` endpoint
5. Token validated - must exist and not be expired
6. Password updated with new bcrypt hash

## Data Models

### User Schema
- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (required, hashed with bcrypt)
- **role**: String (enum: "user", "admin", default: "user")
- **isVerified**: Boolean (default: false)
- **verificationToken**: String (32-byte hex token)
- **verificationTokenExpiry**: Date
- **resetPasswordToken**: String (32-byte hex token)
- **resetPasswordExpiry**: Date
- **refreshToken**: String (JWT token)

### Problem Schema
- **title**: String (required, trimmed)
- **description**: String (required)
- **category**: String (enum: "DSA", "HR", "System Design", required)
- **difficulty**: String (enum: "Easy", "Medium", "Hard", required)
- **tags**: Array of Strings
- **constraints**: String
- **examples**: Array of objects
  - **input**: String
  - **output**: String
  - **explanation**: String
- **createdBy**: ObjectId (reference to User, required)
- **timestamps**: Auto-generated createdAt and updatedAt

### Submission Schema
- **user**: ObjectId (reference to User, required)
- **problem**: ObjectId (reference to Problem, required)
- **code**: String (required) - Source code submitted by user
- **language**: String (enum: "java", "javascript", "python", "cpp", required)
- **status**: String (enum: "Pending", "Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", default: "Pending")
- **output**: String - Program output from execution
- **error**: String - Error message if execution failed
- **executionTime**: Number - Execution time in milliseconds
- **timestamps**: Auto-generated createdAt and updatedAt

**Status Descriptions:**
- **Pending**: Submission received, awaiting execution
- **Accepted**: Code passed all test cases
- **Wrong Answer**: Code executed but produced incorrect output
- **Runtime Error**: Code crashed during execution
- **Time Limit Exceeded**: Code took too long to execute

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
- **joi**: Schema validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemailer**: Email service for verification and password reset emails
- **morgan**: HTTP request logging middleware
- **crypto**: Secure token generation (built-in Node.js)

## Development Dependencies

- **nodemon**: Development server auto-restart

## Error Handling

The server includes comprehensive error handling:
- Custom `ApiError` class for consistent error responses
- Global error handler middleware
- Async error wrapper for route handlers
- Input validation with detailed error messages

## Logging

The server uses **Winston** for comprehensive logging:

### Log Files
- **`logs/error.log`** - Captures all errors with full context
- **`logs/combined.log`** - Captures all log levels (info, error, etc.)

### Log Format
Each log entry includes:
- Timestamp (ISO 8601)
- Log level
- Error message
- HTTP method and URL
- User ID (if authenticated)
- Stack trace (in development) or excluded (in production)
- Status code

### Log Output
- **Console** - Real-time output in development
- **File** - Persistent storage for debugging and monitoring

### Example Log Entry
```json
{
  "level": "error",
  "message": "\"password\" length must be at least 6 characters long",
  "statusCode": 400,
  "timestamp": "2026-04-17T16:29:02.257Z",
  "method": "POST",
  "url": "/api/auth/register",
  "user": null,
  "stack": "Error: ..."
}
```

### Accessing Logs
1. View real-time logs in console during development:
   ```bash
   npm run dev
   ```

2. View log files:
   ```bash
   # View error logs
   cat logs/error.log
   
   # View all logs
   cat logs/combined.log
   ```

3. Use `tail` for live log monitoring:
   ```bash
   tail -f logs/combined.log
   ```

## Security Features

- Password hashing with bcrypt (10-salt rounds)
- JWT-based authentication with token expiry
- Email verification to confirm user ownership
- Secure password reset with time-limited tokens
- Role-based access control (RBAC)
- Input validation and sanitization with Joi
- CORS configuration
- Secure token storage in database
- Refresh token rotation
- Unverified users cannot access protected routes
- Users must logout to request password reset
- Cryptographically secure token generation (32-byte random hex)
- App password usage for Gmail (not plain password)
- Token expiry checks on all time-sensitive operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details

## Author

Swapnamoy Bhattacharya