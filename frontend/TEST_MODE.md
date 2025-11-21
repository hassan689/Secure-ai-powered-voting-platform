# Test Mode - Bypass Authentication

## Current Status: ✅ TEST MODE ENABLED

You can now access all frontend pages without logging in!

## How to Toggle Test Mode

### To Enable Test Mode (No Login Required):
1. Open `src/components/ProtectedRoute.jsx`
2. Set `const TEST_MODE = true`
3. Open `src/components/Layout.jsx`
4. Set `const TEST_MODE = true`
5. Open `src/pages/VoterDashboard.jsx`
6. Set `const TEST_MODE = true`

### To Disable Test Mode (Require Login):
1. Open `src/components/ProtectedRoute.jsx`
2. Set `const TEST_MODE = false`
3. Open `src/components/Layout.jsx`
4. Set `const TEST_MODE = false`
5. Open `src/pages/VoterDashboard.jsx`
6. Set `const TEST_MODE = false`

## What Test Mode Does:

- ✅ Bypasses authentication check in ProtectedRoute
- ✅ Shows a "TEST MODE" badge in the navigation
- ✅ Uses mock user data when no real user is logged in
- ✅ Allows browsing all pages without backend connection
- ✅ Disables logout functionality (shows alert instead)

## Mock User Data:

- Email: `test@example.com`
- VoterID: `1`
- Role: Voter (not admin)

## Testing Pages:

You can now directly access:
- `/dashboard` - Voter Dashboard
- `/elections` - Elections List
- `/vote-history` - Vote History
- `/notifications` - Notifications
- `/polling-stations` - Polling Stations
- `/education` - Education Resources
- `/feedback` - Feedback Form
- `/admin` - Admin Dashboard
- `/voters` - Voter List

## Note:

- API calls will still fail if backend is not running
- Some features may show errors without backend connection
- This is only for frontend UI testing

