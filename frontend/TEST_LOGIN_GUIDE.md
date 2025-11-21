# Test Login Guide

This guide explains how to use the test login feature in the frontend.

## 🧪 Test Login Feature

The login page now includes a **"Fill Test Data"** button that automatically fills in test credentials for quick testing.

### How to Use

1. **Open the login page** at `http://localhost:3000/login`

2. **Choose login type:**
   - **Voter Login**: Leave "Login as Admin" unchecked
   - **Admin Login**: Check "Login as Admin"

3. **Click "Fill Test Data"** button
   - This will automatically fill in the test credentials
   - A notification will confirm the credentials were filled

4. **Click "Sign in"** to login

## 📋 Test Credentials

### Voter Account
- **Email**: `test@example.com`
- **Password**: `test123`
- **Status**: Unverified (pending admin verification)

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

## 🗄️ Setting Up Test Data

Before using test login, you need to create test accounts in the database:

### Option 1: Using the Script (Recommended)

Run the test data creation script:

```bash
cd Database_project/backend
node database/create-test-data.js
```

This will create:
- Test voter account (`test@example.com`)
- Test admin account (`admin`)
- Additional sample voters for testing

### Option 2: Manual Setup

1. **Create test voter** using registration page:
   - Go to `/register`
   - Fill in the form with test credentials
   - Register the account

2. **Create test admin** using the admin creation script:
   ```bash
   cd Database_project/backend
   node database/create-admin.js
   ```
   - Username: `admin`
   - Password: `admin123`

## 🎯 Testing Scenarios

### Test Voter Login Flow
1. Click "Fill Test Data" (without admin checkbox)
2. Click "Sign in"
3. Should redirect to `/dashboard`
4. Should see voter dashboard with account status

### Test Admin Login Flow
1. Check "Login as Admin"
2. Click "Fill Test Data"
3. Click "Sign in"
4. Should redirect to `/admin`
5. Should see admin dashboard

### Test Voter Verification
1. Login as admin
2. Navigate to "Manage Voters"
3. Find `test@example.com`
4. Click "Verify" button
5. Login as voter again to see updated status

## 🔧 Customizing Test Credentials

To change the test credentials, edit `src/pages/Login.jsx`:

```javascript
const testCredentials = {
  voter: {
    email: 'your-test-email@example.com',
    password: 'your-password'
  },
  admin: {
    username: 'your-admin-username',
    password: 'your-admin-password'
  }
}
```

**Remember**: Update the database with matching credentials!

## 🚨 Security Note

⚠️ **Important**: Test credentials are for development only!

- Never use test credentials in production
- Remove or disable test login feature in production builds
- Always use strong, unique passwords in production

## 🐛 Troubleshooting

### "Voter not found" Error
- Make sure you've run `create-test-data.js` script
- Or register the test voter manually

### "Invalid credentials" Error
- Verify the password matches in database
- Check if account exists in database
- Try resetting password using `create-test-data.js`

### Test Data Button Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

## 📝 Additional Test Accounts

The `create-test-data.js` script also creates additional test voters:

1. **John Doe** (`john@example.com`)
   - Password: `password123`
   - Status: Verified ✅

2. **Jane Smith** (`jane@example.com`)
   - Password: `password123`
   - Status: Unverified ⏳

3. **Bob Johnson** (`bob@example.com`)
   - Password: `password123`
   - Status: Verified ✅

You can use these for testing different scenarios!

