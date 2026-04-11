# Interprep Server

A Node.js backend server for the Interprep - Real-Time Interview Preparation Platform. This server provides authentication, user management, and role-based access control for the interview preparation application.

## Features

- User authentication with JWT tokens
- Role-based authorization (User/Admin)
- Password hashing with bcrypt
- MongoDB database integration
- Input validation with Joi
- Error handling middleware
- CORS support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
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
   ```

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

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Body**: `{ "refreshToken": "string" }`

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: `{ "refreshToken": "string" }`

### Protected Routes

#### User Access
- **GET** `/api/auth/user`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: user

#### Admin Access
- **GET** `/api/auth/admin`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: admin

## Project Structure

```
server/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
└── src/
    ├── config/
    │   └── db.js         # Database connection
    ├── constants/
    │   ├── roles.js      # User roles
    │   └── statusCodes.js # HTTP status codes
    ├── controllers/
    │   └── auth.controller.js # Authentication logic
    ├── dto/
    │   └── user.dto.js   # Data transfer objects
    ├── middleware/
    │   ├── auth.middleware.js    # JWT authentication
    │   ├── error.middleware.js   # Error handling
    │   ├── role.middleware.js    # Role authorization
    │   └── validate.middleware.js # Input validation
    ├── models/
    │   └── user.model.js # User schema
    ├── routes/
    │   ├── auth.routes.js  # Auth endpoints
    │   ├── admin.routes.js # Admin endpoints
    │   └── user.routes.js  # User endpoints
    ├── services/
    │   └── token.service.js # JWT token generation
    └── utils/
        ├── apiError.js    # Custom error class
        ├── asyncHandler.js # Async error wrapper
        └── validators/
            └── auth.validator.js # Joi validation schemas
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret key for JWT access tokens | Yes |
| `REFRESH_TOKEN_SECRET` | Secret key for JWT refresh tokens | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
- **joi**: Schema validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Development Dependencies

- **nodemon**: Development server auto-restart

## Error Handling

The server includes comprehensive error handling:
- Custom `ApiError` class for consistent error responses
- Global error handler middleware
- Async error wrapper for route handlers
- Input validation with detailed error messages

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure token storage

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