import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/trips', icon: 'luggage', label: 'Trips' },
  { to: '/profile', icon: 'account_circle', label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-t border-gray-100 dark:border-dark-border pt-3 px-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? 'text-neutral-charcoal dark:text-neutral-100' : 'text-neutral-gray dark:text-neutral-400 opacity-60'
              }`
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
