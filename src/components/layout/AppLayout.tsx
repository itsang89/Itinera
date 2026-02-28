import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children?: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const showNav = !['/login'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto w-full bg-white dark:bg-dark-bg">
      <main className="flex-1 pb-24">{children ?? <Outlet />}</main>
      {showNav && <BottomNav />}
    </div>
  )
}
