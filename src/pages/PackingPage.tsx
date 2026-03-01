import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import { useTrip } from '@/hooks/useTrip'
import { usePackingItems } from '@/hooks/usePackingItems'
import { PageSkeleton, PackingItemSkeleton } from '@/components/LoadingSkeleton'
import { daysUntil } from '@/lib/utils'
import { ConfirmModal } from '@/components/ConfirmModal'
import type { PackingCategory } from '@/types'

const PACKING_CATEGORIES: PackingCategory[] = [
  'Documents',
  'Clothes',
  'Footwear',
  'Toiletries',
  'Health',
  'Electronics',
  'Accessories',
  'Other',
]

export default function PackingPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading: tripLoading } = useTrip(tripId)
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    addItem,
    togglePacked,
    deleteItem,
    packedCount,
  } = usePackingItems(tripId)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PackingCategory>('Clothes')
  const [submitting, setSubmitting] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const { showToast } = useToast()

  const unpackedByCategory = PACKING_CATEGORIES.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category === cat && !i.packed),
  })).filter((g) => g.items.length > 0)

  const packedItems = items.filter((i) => i.packed)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await addItem({
        name: name.trim(),
        category,
        packed: false,
      })
      showToast('Item added!')
      setName('')
      setCategory('Clothes')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (tripLoading || !trip) {
    return <PageSkeleton />
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
<Link
            to={`/trips/${tripId}`}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
            aria-label="Back to trip overview"
          >
              <span className="material-symbols-outlined text-xl text-neutral-charcoal dark:text-neutral-100">
                arrow_back_ios_new
              </span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Packing List
              </h1>
              <p className="text-xs font-medium text-neutral-gray dark:text-neutral-400 mt-0.5 truncate max-w-[180px]">
                {trip.destination}
              </p>
              {daysUntil(trip.startDate) > 0 && (
                <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                  {daysUntil(trip.startDate)} day{daysUntil(trip.startDate) !== 1 ? 's' : ''} until departure
                </p>
              )}
            </div>
          </div>
          <Link
            to="/profile"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100">
              account_circle
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-6 py-6">
          <div className="bg-soft-gray dark:bg-dark-elevated rounded-ios p-5">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-semibold text-neutral-charcoal dark:text-neutral-100">
                Total Progress
              </span>
              <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                {packedCount}/{items.length} Items
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-dark-elevated rounded-full overflow-hidden">
              <div
                className="h-full gradient-accent rounded-full transition-all"
                style={{
                  width:
                    items.length > 0 ? `${(packedCount / items.length) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>
        <div className="px-6 space-y-8">
          {itemsError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
              Could not load packing list: {itemsError.message}
            </div>
          )}
          {itemsLoading ? (
            <div className="space-y-3">
              <PackingItemSkeleton />
              <PackingItemSkeleton />
              <PackingItemSkeleton />
              <PackingItemSkeleton />
              <PackingItemSkeleton />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center py-14 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border bg-soft-gray/30 dark:bg-dark-elevated/30 text-center">
              <span className="material-symbols-outlined text-5xl text-neutral-300 dark:text-neutral-500 mb-4">
                inventory_2
              </span>
              <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-1">
                No items yet
              </h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-5 max-w-[260px]">
                Build your packing list by category. Check items off as you pack.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 py-3 px-5 gradient-accent text-sky-900 dark:text-sky-100 font-bold rounded-ios shadow-sm active:scale-[0.98] transition-transform"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Add your first item
              </button>
            </div>
          ) : (
            <>
            {unpackedByCategory.map(({ category: cat, items: catItems }) => (
                <section key={cat}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100">
                      {cat}
                    </h2>
                    <span className="text-xs font-bold text-neutral-gray dark:text-neutral-400 bg-soft-gray dark:bg-dark-elevated px-2.5 py-1 rounded-md">
                      {catItems.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {catItems.map((item) => {
                      const isToggling = togglingIds.has(item.id)
                      return (
                      <motion.div
                        key={item.id}
                        layout
                        layoutId={item.id}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm"
                      >
                        <label className={`flex-1 flex items-center gap-3 min-w-0 ${isToggling ? 'cursor-wait opacity-70' : 'cursor-pointer active:scale-[0.99] transition-transform'}`}>
                          <div className="relative flex items-center shrink-0">
                            <input
                              type="checkbox"
                              checked={item.packed}
                              disabled={isToggling}
                              onChange={async () => {
                                setTogglingIds((prev) => new Set(prev).add(item.id))
                                try {
                                  await togglePacked(item.id, !item.packed)
                                } finally {
                                  setTogglingIds((prev) => {
                                    const next = new Set(prev)
                                    next.delete(item.id)
                                    return next
                                  })
                                }
                              }}
                              className="absolute opacity-0 w-6 h-6 cursor-pointer disabled:cursor-wait"
                            />
                            <div
                              className={`w-6 h-6 border-2 rounded-lg transition-all flex items-center justify-center ${
                                item.packed
                                  ? 'gradient-accent border-transparent'
                                  : 'border-gray-200 dark:border-dark-border'
                              }`}
                            >
                              {isToggling ? (
                                <span className="w-3 h-3 border-2 border-sky-800 border-t-transparent rounded-full animate-spin" />
                              ) : item.packed ? (
                                <span className="material-symbols-outlined text-sky-800 text-[16px]">
                                  check
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <span
                            className={`text-[15px] font-medium ${
                              item.packed
                                ? 'text-neutral-gray dark:text-neutral-400 line-through'
                                : 'text-neutral-charcoal dark:text-neutral-100'
                            }`}
                          >
                            {item.name}
                          </span>
                        </label>
                        <button
                          onClick={() => setItemToDelete(item.id)}
                          disabled={togglingIds.size > 0}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 disabled:opacity-60 text-sm font-medium"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )})}
                  </div>
                </section>
              ))}
            {packedItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100">
                    Packed
                  </h2>
                  <span className="text-xs font-bold text-neutral-gray dark:text-neutral-400 bg-soft-gray dark:bg-dark-elevated px-2.5 py-1 rounded-md">
                    {packedItems.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {packedItems.map((item) => {
                    const isToggling = togglingIds.has(item.id)
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        layoutId={item.id}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm"
                      >
                        <label className={`flex-1 flex items-center gap-3 min-w-0 ${isToggling ? 'cursor-wait opacity-70' : 'cursor-pointer active:scale-[0.99] transition-transform'}`}>
                          <div className="relative flex items-center shrink-0">
                            <input
                              type="checkbox"
                              checked={item.packed}
                              disabled={isToggling}
                              onChange={async () => {
                                setTogglingIds((prev) => new Set(prev).add(item.id))
                                try {
                                  await togglePacked(item.id, !item.packed)
                                } finally {
                                  setTogglingIds((prev) => {
                                    const next = new Set(prev)
                                    next.delete(item.id)
                                    return next
                                  })
                                }
                              }}
                              className="absolute opacity-0 w-6 h-6 cursor-pointer disabled:cursor-wait"
                            />
                            <div
                              className={`w-6 h-6 border-2 rounded-lg transition-all flex items-center justify-center ${
                                item.packed
                                  ? 'gradient-accent border-transparent'
                                  : 'border-gray-200 dark:border-dark-border'
                              }`}
                            >
                              {isToggling ? (
                                <span className="w-3 h-3 border-2 border-sky-800 border-t-transparent rounded-full animate-spin" />
                              ) : item.packed ? (
                                <span className="material-symbols-outlined text-sky-800 text-[16px]">
                                  check
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <span
                            className={`text-[15px] font-medium ${
                              item.packed
                                ? 'text-neutral-gray dark:text-neutral-400 line-through'
                                : 'text-neutral-charcoal dark:text-neutral-100'
                            }`}
                          >
                            {item.name}
                          </span>
                        </label>
                        <button
                          onClick={() => setItemToDelete(item.id)}
                          disabled={togglingIds.size > 0}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 disabled:opacity-60 text-sm font-medium"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )}
            </>
          )}
        </div>
      </main>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-36 right-6 size-14 min-w-[44px] min-h-[44px] gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-300/50 flex items-center justify-center active:scale-90 transition-all z-40"
        aria-label="Add packing item"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-dark-surface w-full max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl max-w-md mx-auto shadow-xl">
            <header className="flex-shrink-0 bg-white dark:bg-dark-surface px-6 py-5 border-b border-gray-100 dark:border-dark-border rounded-t-2xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                  Add Item
                </h1>
                <div className="w-10" />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto min-h-0">
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-neutral-charcoal dark:text-neutral-100 ml-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Passport"
                    required
                    className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl px-4 py-4 text-[15px] placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-neutral-charcoal dark:text-neutral-100 ml-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PackingCategory)
                    }
                    className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl px-4 py-4 text-[15px] appearance-none pr-10 text-neutral-charcoal dark:text-neutral-100"
                  >
                    {PACKING_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                onClick={handleSubmit}
                disabled={submitting || !name.trim()}
                className="w-full py-4 gradient-accent rounded-ios text-sky-900 font-bold text-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!itemToDelete}
        title="Remove item"
        message="Are you sure you want to remove this item from your packing list?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={async () => {
          if (itemToDelete) {
            await deleteItem(itemToDelete)
            showToast('Item removed')
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  )
}
