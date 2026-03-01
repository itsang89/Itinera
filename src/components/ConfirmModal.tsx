import { useState } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const isDanger = variant === 'danger'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await Promise.resolve(onConfirm())
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  const closeOnBackdrop = variant !== 'danger'

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={closeOnBackdrop ? onCancel : undefined}
    >
      <div
        className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-ios font-semibold bg-soft-gray dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-ios font-semibold flex items-center justify-center gap-2 disabled:opacity-60 ${
              isDanger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'gradient-accent text-sky-900'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {confirmLabel}...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
