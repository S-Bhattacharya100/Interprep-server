# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Added the login flow that validates credentials, stores access and refresh tokens through Redux, and redirects successful logins to the dashboard.
- Created the `VerifyEmail` page to consume the verification token, complete email verification, automatically authenticate the user, and redirect to the dashboard.
- Added registration-page styling and completed registration form state and error handling with `useState` and `setError`.
- Updated the verification email service to build and send the client verification URL with the generated token, and added the resend-verification flow.
- Added a `useRef` guard in `VerifyEmail` to prevent duplicate verification requests during React effect re-runs.
- Fixed the `AppRoutes` verification route typo and aligned route configuration with the authentication pages.
- Updated `AuthInitializer` so `authInitialized` becomes true even when no access token or current user exists.
- Added complete dashboard logout handling: the frontend calls the backend logout endpoint, clears Redux and local tokens, and navigates to `/login`; the backend invalidates the stored refresh token.
- Fixed `vite.config.js` to properly use `@tailwindcss/vite` plugin for Tailwind CSS v4 integration in Vite dev server and build.
- Updated `client/src/utils/axiosInstance.js` with request and response interceptors for robust JWT token handling and error management.
- Added styled `Login` page using Tailwind CSS V4 and updated client styles.
- Installed and configured Tailwind CSS (client-side) with Vite plugin, PostCSS, and Autoprefixer.
- Added `AuthInitializer` to bootstrap the authenticated user on app startup and set `authInitialized` after the current-user check completes.
- Updated `authSlice` to keep the current user in Redux instead of persisting it in localStorage, and added the `authInitialized` flag to control route rendering during startup.
- Removed the `auth/me` fetch logic from the `Dashboard` component and centralized it in the app-level initializer.
- Added `PublicRoute` so already-authenticated users are redirected away from login/register pages instead of seeing them unnecessarily.
- Fixed the `AuthInitializer` naming typo and improved login error handling to surface cleaner API errors.
- Updated `ProtectedRoute` and `PublicRoute` to wait for auth initialization before deciding whether to render protected or guest pages.
- Updated `main.jsx` to mount `AuthInitializer` around the app so auth state is ready before routing decisions are made.
- Backend: added `GET /api/auth/me` (current user provider) to expose the authenticated user profile.
- Documentation and README updated to reflect the latest auth flow and route changes.

