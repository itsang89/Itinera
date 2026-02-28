import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { useExpenses } from '@/hooks/useExpenses'
import type { ExpenseCategory } from '@/types'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; icon: string }> = [
  { value: 'Food', icon: 'restaurant' },
  { value: 'Transport', icon: 'directions_car' },
  { value: 'Accommodation', icon: 'hotel' },
  { value: 'Activities', icon: 'attractions' },
  { value: 'Shopping', icon: 'shopping_bag' },
  { value: 'Other', icon: 'category' },
]

function getCategoryIcon(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.icon ?? 'category'
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return d.toLocaleDateString()
}

export default function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading: tripLoading } = useTrip(tripId)
  const { expenses, totalSpent, addExpense, loading: expensesLoading } =
    useExpenses(tripId)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [submitting, setSubmitting] = useState(false)

  if (tripLoading || !trip) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency
  const remaining = trip.totalBudget - totalSpent
  const percentSpent =
    trip.totalBudget > 0 ? (totalSpent / trip.totalBudget) * 100 : 0
  const percentRemaining = 100 - percentSpent

  const categoryTotals = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount
      return acc
    },
    {} as Record<string, number>
  )
  const categoryPercents = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat as ExpenseCategory,
    total,
    percent: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return
    setSubmitting(true)
    try {
      await addExpense({
        title: title.trim() || 'Untitled expense',
        amount: amt,
        category,
        date,
      })
      setAmount('')
      setTitle('')
      setCategory('Food')
      setDate(new Date().toISOString().split('T')[0])
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-5 border-b border-gray-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${tripId}`}
              className="p-1 -ml-1"
            >
              <span className="material-symbols-outlined text-neutral-charcoal">
                chevron_left
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal">
                Budget Tracker
              </h1>
              <p className="text-[10px] font-semibold text-neutral-gray uppercase tracking-wider">
                {trip.title}
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <section className="px-6 py-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xs font-semibold text-neutral-gray uppercase tracking-[0.1em] mb-1">
                Total Budget
              </p>
              <h2 className="text-4xl font-bold text-neutral-charcoal tracking-tight">
                {symbol}
                {trip.totalBudget.toLocaleString()}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-ios border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-neutral-gray uppercase tracking-wider mb-2">
                  Spent
                </p>
                <p className="text-xl font-bold text-neutral-charcoal">
                  {symbol}
                  {totalSpent.toLocaleString()}
                </p>
                <div className="mt-3 h-1.5 w-full bg-soft-gray rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-accent rounded-full transition-all"
                    style={{ width: `${Math.min(percentSpent, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white p-5 rounded-ios border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-neutral-gray uppercase tracking-wider mb-2">
                  Remaining
                </p>
                <p className="text-xl font-bold text-sky-600">
                  {symbol}
                  {remaining.toLocaleString()}
                </p>
                <p className="text-[10px] font-medium text-neutral-gray mt-1">
                  {percentRemaining.toFixed(0)}% left
                </p>
              </div>
            </div>
          </div>
        </section>
        {categoryPercents.length > 0 && (
          <section className="px-6 mb-10">
            <div className="bg-white p-6 rounded-ios border border-gray-100 shadow-sm flex items-center gap-8">
              <div
                className="w-32 h-32 flex-shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(${categoryPercents
                    .map(
                      (_, i) =>
                        `hsl(${200 - i * 40}, 70%, 80%) ${categoryPercents
                          .slice(0, i)
                          .reduce((s, x) => s + x.percent, 0)}% ${categoryPercents
                          .slice(0, i + 1)
                          .reduce((s, x) => s + x.percent, 0)}%`
                    )
                    .join(', ')})`,
                }}
              />
              <div className="flex-1 space-y-3">
                {categoryPercents.map((c, i) => (
                  <div key={c.category} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: `hsl(${200 - i * 40}, 70%, 60%)`,
                      }}
                    />
                    <span className="text-xs font-medium text-neutral-charcoal">
                      {c.category} ({c.percent.toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="px-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-neutral-charcoal">
              Recent Expenses
            </h3>
          </div>
          <div className="space-y-3">
            {expensesLoading ? (
              <div className="py-8 text-center text-neutral-gray">
                Loading...
              </div>
            ) : expenses.length === 0 ? (
              <div className="py-8 text-center text-neutral-gray">
                No expenses yet. Tap + to add one.
              </div>
            ) : (
              expenses.slice(0, 10).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center">
                      <span className="material-symbols-outlined text-neutral-charcoal text-xl">
                        {getCategoryIcon(exp.category)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-charcoal">
                        {exp.title}
                      </p>
                      <p className="text-[10px] text-neutral-gray">
                        {formatDate(exp.date)} • {exp.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-neutral-charcoal">
                    -{symbol}
                    {exp.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
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
                  <span className="material-symbols-outlined text-[22px]">
                    arrow_back_ios_new
                  </span>
                </button>
                <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal">
                  Add Expense
                </h1>
                <div className="w-10" />
              </div>
            </header>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 pb-32">
              <div className="text-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-gray block mb-2">
                  Total Amount
                </label>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-semibold text-neutral-charcoal">
                    {CURRENCY_SYMBOLS[trip.currency] ?? trip.currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full max-w-[200px] text-5xl font-bold border-none text-center bg-transparent p-0 focus:ring-0 placeholder:text-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal ml-1">
                  Expense Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dinner at Santorini Grill"
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
                    setCategory(e.target.value as ExpenseCategory)
                  }
                  className="w-full bg-soft-gray border-none rounded-xl px-4 py-4 text-[15px] appearance-none pr-10 text-neutral-charcoal"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal ml-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-soft-gray border-none rounded-xl px-4 py-4 text-[15px] text-neutral-charcoal"
                />
              </div>
            </form>
            <div className="fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 pb-10 z-50">
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !amount}
                  className="w-full py-4 gradient-accent rounded-ios text-sky-900 font-bold text-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
