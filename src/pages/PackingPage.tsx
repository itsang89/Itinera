import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { usePackingItems } from '@/hooks/usePackingItems'
import type { PackingCategory } from '@/types'

const PACKING_CATEGORIES: PackingCategory[] = [
  'Clothes',
  'Electronics',
  'Toiletries',
  'Documents',
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
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${tripId}`}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-soft-gray"
            >
              <span className="material-symbols-outlined text-xl text-neutral-charcoal">
                arrow_back_ios_new
              </span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-charcoal">
                Packing List
              </h1>
              <p className="text-xs font-medium text-neutral-gray mt-0.5 uppercase tracking-wider">
                {trip.title}
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-6 py-6">
          <div className="bg-soft-gray rounded-ios p-5">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-semibold text-neutral-charcoal">
                Total Progress
              </span>
              <span className="text-sm font-bold text-sky-700">
                {packedCount}/{items.length} Items
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
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
            <div className="py-12 text-center text-neutral-gray">
              Loading...
            </div>
          ) : itemsByCategory.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray">
              No items yet. Tap + to add one.
            </div>
          ) : (
            itemsByCategory.map(({ category: cat, items: catItems }) => {
              const packed = catItems.filter((i) => i.packed).length
              return (
                <section key={cat}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-neutral-charcoal">
                      {cat}
                    </h2>
                    <span className="text-xs font-bold text-neutral-gray bg-soft-gray px-2.5 py-1 rounded-md">
                      {packed}/{catItems.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {catItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer active:scale-[0.99] transition-all"
                      >
                        <span
                          className={`text-[15px] font-medium ${
                            item.packed
                              ? 'text-neutral-gray line-through'
                              : 'text-neutral-charcoal'
                          }`}
                        >
                          {item.name}
                        </span>
                        <div className="relative flex items-center">
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
                                : 'border-gray-200'
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
        className="fixed bottom-28 right-6 size-14 gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-200/50 flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl max-w-md mx-auto shadow-xl">
            <header className="sticky top-0 z-30 bg-white px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal">
                  Add Item
                </h1>
                <div className="w-10" />
              </div>
            </header>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 pb-32">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal ml-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Passport"
                  required
                  className="w-full bg-soft-gray border-none rounded-xl px-4 py-4 text-[15px] placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal ml-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PackingCategory)
                  }
                  className="w-full bg-soft-gray border-none rounded-xl px-4 py-4 text-[15px] appearance-none pr-10 text-neutral-charcoal"
                >
                  {PACKING_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 pb-10 z-50">
              <div className="max-w-md mx-auto">
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
        </div>
      )}
    </>
  )
}
