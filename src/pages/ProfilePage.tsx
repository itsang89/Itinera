import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const {
    defaultCurrency,
    updateDefaultCurrency,
    currencyLabel,
    currencies,
  } = useUserProfile(user?.uid)
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
            Profile
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full px-6 pb-32">
        <section className="mt-4 mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center shadow-inner overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-sky-800 dark:text-sky-200 text-5xl">
                  person
                </span>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-charcoal dark:text-neutral-100">
            {user?.displayName ?? 'User'}
          </h2>
          <p className="text-neutral-gray dark:text-neutral-400 text-sm mt-1">{user?.email ?? ''}</p>
        </section>
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-bold text-neutral-gray dark:text-neutral-400 uppercase tracking-widest mb-4 px-1">
              Account Settings
            </h3>
            <div className="bg-white dark:bg-dark-surface rounded-ios border border-gray-100 dark:border-dark-border overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none">
              <button
                onClick={() => setShowCurrencyPicker(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors border-b border-gray-50 dark:border-dark-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <span className="material-symbols-outlined text-[20px]">
                      payments
                    </span>
                  </div>
                  <span className="font-medium text-[15px] text-neutral-charcoal dark:text-neutral-100">
                    Default Currency
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-gray dark:text-neutral-400 text-sm">
                    {currencyLabel(defaultCurrency)}
                  </span>
                  <span className="material-symbols-outlined text-gray-300 dark:text-neutral-500 text-[20px]">
                    chevron_right
                  </span>
                </div>
              </button>
              <button
                onClick={() => setShowComingSoon(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors border-b border-gray-50 dark:border-dark-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-400 dark:text-orange-400">
                    <span className="material-symbols-outlined text-[20px]">
                      notifications_active
                    </span>
                  </div>
                  <span className="font-medium text-[15px] text-neutral-charcoal dark:text-neutral-100">
                    Notifications
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-gray dark:text-neutral-400 text-sm">Coming soon</span>
                  <span className="material-symbols-outlined text-gray-300 dark:text-neutral-500 text-[20px]">
                    chevron_right
                  </span>
                </div>
              </button>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-400 dark:text-purple-400">
                    <span className="material-symbols-outlined text-[20px]">
                      palette
                    </span>
                  </div>
                  <span className="font-medium text-[15px] text-neutral-charcoal dark:text-neutral-100">App Theme</span>
                </div>
                <div className="flex bg-soft-gray dark:bg-dark-elevated p-1 rounded-full">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      resolvedTheme === 'light'
                        ? 'bg-white dark:bg-dark-surface text-neutral-charcoal dark:text-neutral-100 shadow-sm'
                        : 'text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      resolvedTheme === 'dark'
                        ? 'bg-white dark:bg-dark-surface text-neutral-charcoal dark:text-neutral-100 shadow-sm'
                        : 'text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-gray dark:text-neutral-400 uppercase tracking-widest mb-4 px-1">
              Support
            </h3>
            <div className="bg-white dark:bg-dark-surface rounded-ios border border-gray-100 dark:border-dark-border overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none">
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors border-b border-gray-50 dark:border-dark-border">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center text-neutral-gray dark:text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      help
                    </span>
                  </div>
                  <span className="font-medium text-[15px] text-neutral-charcoal dark:text-neutral-100">Help Center</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 dark:text-neutral-500 text-[20px]">
                  chevron_right
                </span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-dark-elevated flex items-center justify-center text-neutral-gray dark:text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">
                      verified_user
                    </span>
                  </div>
                  <span className="font-medium text-[15px] text-neutral-charcoal dark:text-neutral-100">Privacy Policy</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 dark:text-neutral-500 text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <button
              onClick={signOut}
              className="text-red-500 dark:text-red-400 font-semibold text-sm hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-2 px-6 py-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              Logout
            </button>
          </div>
        </div>
      </main>

      {showCurrencyPicker && (
        <div
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-end sm:items-center justify-center"
          onClick={() => setShowCurrencyPicker(false)}
        >
          <div
            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-4">
              Default Currency
            </h3>
            <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-4">
              New trips will use this currency by default.
            </p>
            <div className="space-y-1">
              {currencies.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    updateDefaultCurrency(code)
                    setShowCurrencyPicker(false)
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    defaultCurrency === code
                      ? 'bg-soft-gray dark:bg-dark-elevated'
                      : 'hover:bg-soft-gray/50 dark:hover:bg-dark-elevated/50'
                  }`}
                >
                  <span className="font-medium text-neutral-charcoal dark:text-neutral-100">
                    {currencyLabel(code)}
                  </span>
                  {defaultCurrency === code && (
                    <span className="material-symbols-outlined text-sky-500">check</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCurrencyPicker(false)}
              className="mt-4 w-full py-3 text-neutral-gray dark:text-neutral-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-end sm:items-center justify-center"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center py-4">
              <span className="material-symbols-outlined text-5xl text-orange-400 dark:text-orange-400 mb-4">
                notifications_active
              </span>
              <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">
                Coming Soon
              </h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-6">
                Push notifications for trip reminders and updates are on the way.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full py-3 rounded-ios font-semibold gradient-accent text-sky-900 dark:text-sky-100"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
