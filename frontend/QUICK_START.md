# Quick Start Guide

## Prerequisites

1. **Backend must be running** on `http://localhost:5000`
2. Node.js v16+ installed
3. npm or yarn package manager

## Installation Steps

### 1. Navigate to Frontend Directory
```bash
cd Database_project/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Application

### As a Voter:
1. Go to `http://localhost:3000/register`
2. Fill in the registration form:
   - Full Name
   - CNIC
   - Email
   - Password
3. Click "Create account"
4. Login with your credentials at `http://localhost:3000/login`
5. You'll see the Voter Dashboard

### As an Admin:
1. Go to `http://localhost:3000/login`
2. Check "Login as Admin"
3. Enter admin username and password
4. You'll see the Admin Dashboard
5. Navigate to "Manage Voters" to verify voters

## Features

✅ **Voter Registration** - New voters can register
✅ **Voter Login** - Voters can login to their dashboard
✅ **Admin Login** - Admins can login separately
✅ **Voter Dashboard** - View account status and information
✅ **Admin Dashboard** - Overview and quick actions
✅ **Voter Management** - View and verify voters
✅ **Filter Voters** - Filter by verification status
✅ **Responsive Design** - Works on mobile and desktop

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_URL in `.env` file

### Build Issues
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Port Already in Use
- Change port in `vite.config.js` if port 3000 is taken

## Production Build

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy.

