import { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
              t.type === 'success'
                ? 'bg-emerald-500 text-white'
                : t.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-dark-surface text-neutral-charcoal dark:text-neutral-100 border border-gray-200 dark:border-dark-border'
            }`}
          >
            {t.type === 'success' && (
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            )}
            <span className="font-medium text-sm">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { showToast: () => {} }
  return ctx
}
