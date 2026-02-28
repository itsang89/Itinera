import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import MyTripsPage from '@/pages/MyTripsPage'
import CreateTripPage from '@/pages/CreateTripPage'
import TripOverviewPage from '@/pages/TripOverviewPage'
import ItineraryPage from '@/pages/ItineraryPage'
import MapViewPage from '@/pages/MapViewPage'
import BudgetPage from '@/pages/BudgetPage'
import PackingPage from '@/pages/PackingPage'
import ProfilePage from '@/pages/ProfilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/trips" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyTripsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateTripPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TripOverviewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/itinerary"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ItineraryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/map"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MapViewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/budget"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BudgetPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/:tripId/packing"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PackingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
