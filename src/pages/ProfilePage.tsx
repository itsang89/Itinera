import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user, signOut } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-charcoal">
            Profile
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray text-neutral-charcoal">
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
                <span className="material-symbols-outlined text-sky-800 text-5xl">
                  person
                </span>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-charcoal">
            {user?.displayName ?? 'User'}
          </h2>
          <p className="text-neutral-gray text-sm mt-1">{user?.email ?? ''}</p>
        </section>
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-bold text-neutral-gray uppercase tracking-widest mb-4 px-1">
              Account Settings
            </h3>
            <div className="bg-white rounded-ios border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined text-[20px]">
                      payments
                    </span>
                  </div>
                  <span className="font-medium text-[15px]">
                    Default Currency
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-gray text-sm">USD ($)</span>
                  <span className="material-symbols-outlined text-gray-300 text-[20px]">
                    chevron_right
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
                    <span className="material-symbols-outlined text-[20px]">
                      notifications_active
                    </span>
                  </div>
                  <span className="font-medium text-[15px]">Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-gray text-sm">Push only</span>
                  <span className="material-symbols-outlined text-gray-300 text-[20px]">
                    chevron_right
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-400">
                    <span className="material-symbols-outlined text-[20px]">
                      palette
                    </span>
                  </div>
                  <span className="font-medium text-[15px]">App Theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-gray text-sm">System</span>
                  <span className="material-symbols-outlined text-gray-300 text-[20px]">
                    chevron_right
                  </span>
                </div>
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-gray uppercase tracking-widest mb-4 px-1">
              Support
            </h3>
            <div className="bg-white rounded-ios border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-neutral-gray">
                    <span className="material-symbols-outlined text-[20px]">
                      help
                    </span>
                  </div>
                  <span className="font-medium text-[15px]">Help Center</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-[20px]">
                  chevron_right
                </span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-soft-gray transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-neutral-gray">
                    <span className="material-symbols-outlined text-[20px]">
                      verified_user
                    </span>
                  </div>
                  <span className="font-medium text-[15px]">Privacy Policy</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <button
              onClick={signOut}
              className="text-red-500 font-semibold text-sm hover:text-red-600 transition-colors flex items-center gap-2 px-6 py-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              Logout
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
