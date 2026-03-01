import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { setLastTripId } from '@/lib/lastTrip'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children?: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const showNav = !['/login'].includes(location.pathname)

  useEffect(() => {
    const match = location.pathname.match(/^\/trips\/([^/]+)(?:\/|$)/)
    if (match) {
      const tripId = match[1]
      if (tripId && tripId !== 'new') {
        setLastTripId(tripId)
      }
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto w-full bg-white dark:bg-dark-bg">
      <main className="flex-1 pb-24 animate-fade-in" key={location.pathname}>{children ?? <Outlet />}</main>
      {showNav && <BottomNav />}
    </div>
  )
}
