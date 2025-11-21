# Voting Management System - Frontend

A modern React frontend for the Voting Management System built with Vite, React Router, and Tailwind CSS.

## Features

- 🔐 User Authentication (Voter Registration & Login)
- 👤 Admin Authentication
- 📊 Voter Dashboard
- 🛡️ Admin Dashboard
- ✅ Voter Verification System
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── context/         # React Context providers
│   └── AuthContext.jsx
├── pages/          # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── VoterDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── VoterList.jsx
├── services/       # API services
│   └── api.js
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /api/auth/register` - Register a new voter
- `POST /api/auth/login` - Login voter
- `POST /api/admin/login` - Admin login
- `GET /api/voters` - Get all voters
- `PUT /api/voters/verify/:VoterID` - Verify a voter

## Features in Detail

### Authentication
- Voter registration with validation
- Voter login
- Admin login
- Protected routes
- JWT token management

### Voter Dashboard
- View account information
- Check verification status
- Profile overview

### Admin Dashboard
- Overview statistics
- Quick access to voter management
- Navigation to different sections

### Voter Management
- View all voters
- Filter by verification status
- Verify unverified voters
- Real-time updates

## Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:5000/api
```

## License

ISC

