import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const {
    defaultCurrency,
    updateDefaultCurrency,
    currencyLabel,
    currencies,
  } = useUserProfile(user?.uid)
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [updatingCurrency, setUpdatingCurrency] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-dark-elevated transition-colors -ml-2"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-[22px]">
              arrow_back_ios_new
            </span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100 flex-1 text-center">
            Profile
          </h1>
          <button
            onClick={() => setShowComingSoon(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 -mr-2"
            aria-label="Settings"
          >
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
            <h3 className="text-xs font-bold text-neutral-gray dark:text-neutral-400 mb-4 px-1">
              Account settings
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                      (theme === 'light' || (theme === 'system' && resolvedTheme === 'light'))
                        ? 'bg-white dark:bg-dark-surface text-neutral-charcoal dark:text-neutral-100 shadow-sm'
                        : 'text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                      (theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark'))
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
            <h3 className="text-xs font-bold text-neutral-gray dark:text-neutral-400 mb-4 px-1">
              Support
            </h3>
            <div className="bg-white dark:bg-dark-surface rounded-ios border border-gray-100 dark:border-dark-border overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none">
              <button
                onClick={() => setShowHelpModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors border-b border-gray-50 dark:border-dark-border"
              >
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
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-soft-gray dark:hover:bg-dark-elevated transition-colors"
              >
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
              onClick={async () => {
                setSigningOut(true)
                try {
                  await signOut()
                } finally {
                  setSigningOut(false)
                }
              }}
              disabled={signingOut}
              className="text-red-500 dark:text-red-400 font-semibold text-sm hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-2 px-6 py-2 disabled:opacity-60"
            >
              {signingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    logout
                  </span>
                  Logout
                </>
              )}
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
                  disabled={updatingCurrency}
                  onClick={async () => {
                    setUpdatingCurrency(true)
                    try {
                      await updateDefaultCurrency(code)
                      setShowCurrencyPicker(false)
                    } finally {
                      setUpdatingCurrency(false)
                    }
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors disabled:opacity-60 ${
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

      {(showComingSoon || showHelpModal || showPrivacyModal) && (
        <div
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-end sm:items-center justify-center"
          onClick={() => {
            setShowComingSoon(false)
            setShowHelpModal(false)
            setShowPrivacyModal(false)
          }}
        >
          <div
            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center py-4">
              <span className="material-symbols-outlined text-5xl text-orange-400 dark:text-orange-400 mb-4">
                {showHelpModal ? 'help' : showPrivacyModal ? 'verified_user' : 'notifications_active'}
              </span>
              <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">
                {showHelpModal ? 'Help Center' : showPrivacyModal ? 'Privacy Policy' : 'Coming Soon'}
              </h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-6">
                {showHelpModal
                  ? 'Documentation and FAQs are being prepared. Check back soon!'
                  : showPrivacyModal
                    ? 'Our privacy policy is being updated. We take your data seriously.'
                    : 'Push notifications for trip reminders and updates are on the way.'}
              </p>
              <button
                onClick={() => {
                  setShowComingSoon(false)
                  setShowHelpModal(false)
                  setShowPrivacyModal(false)
                }}
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
