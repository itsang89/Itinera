import { NavLink, useParams } from 'react-router-dom'

const tripsListNavItems = [
  { to: '/trips', icon: 'luggage', label: 'Trips' },
  { to: '/profile', icon: 'account_circle', label: 'Profile' },
]

function getTripNavItems(tripId: string) {
  const base = `/trips/${tripId}`
  return [
    { to: base, icon: 'dashboard', label: 'Overview' },
    { to: `${base}/itinerary`, icon: 'event_note', label: 'Itinerary' },
    { to: `${base}/map`, icon: 'map', label: 'Map' },
    { to: `${base}/budget`, icon: 'payments', label: 'Budget' },
  ]
}

export default function BottomNav() {
  const { tripId } = useParams<{ tripId?: string }>()
  const isTripContext = !!tripId && tripId !== 'new'
  const navItems = isTripContext ? getTripNavItems(tripId) : tripsListNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-t border-gray-100 dark:border-dark-border pt-3 px-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/trips' || (isTripContext && to === `/trips/${tripId}`)}
            aria-label={label}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 min-w-0 min-h-[44px] justify-center py-1 ${
                isActive ? 'text-neutral-charcoal dark:text-neutral-100' : 'text-neutral-gray dark:text-neutral-400 opacity-60'
              }`
            }
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
            <span className="text-[10px] font-bold truncate w-full text-center">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
