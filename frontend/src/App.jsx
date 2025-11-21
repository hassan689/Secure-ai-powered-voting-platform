import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import Login from './pages/Login'
import Register from './pages/Register'
import VoterDashboard from './pages/VoterDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VoterList from './pages/VoterList'
import Elections from './pages/Elections'
import VotingPage from './pages/VotingPage'
import ResultsPage from './pages/ResultsPage'
import VoteHistory from './pages/VoteHistory'
import VoteReceipt from './pages/VoteReceipt'
import CandidateProfile from './pages/CandidateProfile'
import NotificationsPage from './pages/NotificationsPage'
import PollingStations from './pages/PollingStations'
import EducationResources from './pages/EducationResources'
import FeedbackPage from './pages/FeedbackPage'
import ElectionDetails from './pages/ElectionDetails'
import Layout from './components/Layout'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/login-old" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<VoterDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/voters" element={<VoterList />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/elections/:electionId" element={<ElectionDetails />} />
              <Route path="/vote/:electionId" element={<VotingPage />} />
              <Route path="/results/:electionId" element={<ResultsPage />} />
              <Route path="/vote-history" element={<VoteHistory />} />
              <Route path="/vote-receipt/:confirmationId" element={<VoteReceipt />} />
              <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/polling-stations" element={<PollingStations />} />
              <Route path="/education" element={<EducationResources />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Route>
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Redirect to dashboard if already authenticated (handled by ProtectedRoute) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

