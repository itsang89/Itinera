import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import LoginPage from '@/pages/LoginPage'
import MyTripsPage from '@/pages/MyTripsPage'
import CreateTripPage from '@/pages/CreateTripPage'
import EditTripPage from '@/pages/EditTripPage'
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-soft-gray dark:border-dark-elevated border-t-accent-blue-start dark:border-t-sky-500 animate-spin" />
          <span className="text-neutral-gray dark:text-neutral-400 text-sm">Loading...</span>
        </div>
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
        path="/trips/:tripId/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditTripPage />
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
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}
