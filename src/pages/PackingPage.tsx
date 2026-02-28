import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { usePackingItems } from '@/hooks/usePackingItems'
import { PageSkeleton, ListSkeleton } from '@/components/LoadingSkeleton'
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
    addItem,
    togglePacked,
    deleteItem,
    packedCount,
  } = usePackingItems(tripId)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PackingCategory>('Clothes')
  const [submitting, setSubmitting] = useState(false)

  const itemsByCategory = PACKING_CATEGORIES.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

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
              className="w-8 h-8 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
            >
              <span className="material-symbols-outlined text-xl text-neutral-charcoal dark:text-neutral-100">
                arrow_back_ios_new
              </span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Packing List
              </h1>
              <p className="text-xs font-medium text-neutral-gray dark:text-neutral-400 mt-0.5 uppercase tracking-wider">
                {trip.title}
              </p>
            </div>
          </div>
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
          {itemsLoading ? (
            <div className="px-6">
              <ListSkeleton count={5} />
            </div>
          ) : itemsByCategory.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray dark:text-neutral-400">
              No items yet. Tap + to add one.
            </div>
          ) : (
            itemsByCategory.map(({ category: cat, items: catItems }) => {
              const packed = catItems.filter((i) => i.packed).length
              return (
                <section key={cat}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100">
                      {cat}
                    </h2>
                    <span className="text-xs font-bold text-neutral-gray dark:text-neutral-400 bg-soft-gray dark:bg-dark-elevated px-2.5 py-1 rounded-md">
                      {packed}/{catItems.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl shadow-sm"
                      >
                        <label className="flex-1 flex items-center cursor-pointer active:scale-[0.99] transition-transform min-w-0">
                          <span
                            className={`text-[15px] font-medium ${
                              item.packed
                                ? 'text-neutral-gray dark:text-neutral-400 line-through'
                                : 'text-neutral-charcoal dark:text-neutral-100'
                            }`}
                          >
                            {item.name}
                          </span>
                          <div className="relative flex items-center ml-2 shrink-0">
                            <input
                              type="checkbox"
                              checked={item.packed}
                              onChange={() => togglePacked(item.id, !item.packed)}
                              className="absolute opacity-0 w-6 h-6 cursor-pointer"
                            />
                            <div
                              className={`w-6 h-6 border-2 rounded-lg transition-all flex items-center justify-center ${
                                item.packed
                                  ? 'gradient-accent border-transparent'
                                  : 'border-gray-200 dark:border-dark-border'
                              }`}
                            >
                              {item.packed && (
                                <span className="material-symbols-outlined text-sky-800 text-[16px]">
                                  check
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                        <button
                          onClick={() => {
                            if (confirm('Remove this item?')) deleteItem(item.id)
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>
      </main>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-36 right-6 size-14 gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-200/50 flex items-center justify-center active:scale-90 transition-all z-40"
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
    </>
  )
}
