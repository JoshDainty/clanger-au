import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext'
import { ToastProvider } from '@/components/Toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'

// Auth pages (no layout)
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'

// App pages (with layout)
import Dashboard from '@/pages/Dashboard'
import ContestsList from '@/pages/contests/ContestsList'
import ContestDetail from '@/pages/contests/ContestDetail'
import ContestDraft from '@/pages/contests/ContestDraft'
import ContestMatchup from '@/pages/contests/ContestMatchup'
import LeaguesList from '@/pages/leagues/LeaguesList'
import LeagueCreate from '@/pages/leagues/LeagueCreate'
import LeagueDetail from '@/pages/leagues/LeagueDetail'
import PlayersList from '@/pages/players/PlayersList'
import PlayerDetail from '@/pages/players/PlayerDetail'
import Profile from '@/pages/profile/Profile'
import ProfileSettings from '@/pages/profile/Settings'
import Wallet from '@/pages/profile/Wallet'
import Chat from '@/pages/Chat'
import Notifications from '@/pages/Notifications'
import StatesDemo from '@/pages/StatesDemo'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Auth routes — no layout, no protection */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App routes — with layout, auth-protected */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/contests" element={<ContestsList />} />
            <Route path="/contests/:id" element={<ContestDetail />} />
            <Route path="/contests/:id/draft" element={<ContestDraft />} />
            <Route path="/contests/:id/matchup" element={<ContestMatchup />} />

            <Route path="/leagues" element={<LeaguesList />} />
            <Route path="/leagues/create" element={<LeagueCreate />} />
            <Route path="/leagues/:id" element={<LeagueDetail />} />

            <Route path="/players" element={<PlayersList />} />
            <Route path="/players/:id" element={<PlayerDetail />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/profile/wallet" element={<Wallet />} />

            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/states-demo" element={<StatesDemo />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
