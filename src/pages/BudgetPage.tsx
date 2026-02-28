import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { useExpenses } from '@/hooks/useExpenses'
import { CURRENCY_SYMBOLS, formatDate } from '@/lib/utils'
import { PageSkeleton } from '@/components/LoadingSkeleton'
import type { ExpenseCategory } from '@/types'

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

export default function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading: tripLoading, updateTrip } = useTrip(tripId)
  const { expenses, totalSpent, addExpense, deleteExpense, loading: expensesLoading } =
    useExpenses(tripId)
  const [showForm, setShowForm] = useState(false)
  const [showEditBudget, setShowEditBudget] = useState(false)
  const [editBudget, setEditBudget] = useState('')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [date, setDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updatingBudget, setUpdatingBudget] = useState(false)

  if (tripLoading || !trip) {
    return <PageSkeleton />
  }

  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency
  const defaultDate = date || new Date().toISOString().split('T')[0]
  const minDate = trip.startDate
  const maxDate = trip.endDate
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
    const dateToUse = date || defaultDate
    if (dateToUse < minDate || dateToUse > maxDate) return
    setSubmitting(true)
    try {
      await addExpense({
        title: title.trim() || 'Untitled expense',
        amount: amt,
        category,
        date: dateToUse,
      })
      setAmount('')
      setTitle('')
      setCategory('Food')
      setDate('')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(editBudget)
    if (isNaN(value) || value < 0) return
    setUpdatingBudget(true)
    try {
      await updateTrip({ totalBudget: value })
      setShowEditBudget(false)
      setEditBudget('')
    } finally {
      setUpdatingBudget(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-5 border-b border-gray-50 dark:border-dark-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${tripId}`}
              className="p-1 -ml-1"
            >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100">
                chevron_left
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Budget Tracker
              </h1>
              <p className="text-[10px] font-semibold text-neutral-gray dark:text-neutral-400 uppercase tracking-wider">
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
              <p className="text-xs font-semibold text-neutral-gray dark:text-neutral-400 uppercase tracking-[0.1em] mb-1">
                Total Budget
              </p>
              <button
                onClick={() => {
                  setEditBudget(String(trip.totalBudget))
                  setShowEditBudget(true)
                }}
                className="flex items-center justify-center gap-2 w-full py-2 -my-2 rounded-lg active:bg-soft-gray dark:bg-dark-elevated/50 transition-colors"
              >
                <h2 className="text-4xl font-bold text-neutral-charcoal dark:text-neutral-100 tracking-tight">
                  {symbol}
                  {trip.totalBudget.toLocaleString()}
                </h2>
                <span className="material-symbols-outlined text-neutral-gray dark:text-neutral-400 text-xl">
                  edit
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-surface p-5 rounded-ios border border-gray-100 dark:border-dark-border shadow-sm">
                <p className="text-[10px] font-bold text-neutral-gray dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Spent
                </p>
                <p className="text-xl font-bold text-neutral-charcoal dark:text-neutral-100">
                  {symbol}
                  {totalSpent.toLocaleString()}
                </p>
                <div className="mt-3 h-1.5 w-full bg-soft-gray dark:bg-dark-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-accent rounded-full transition-all"
                    style={{ width: `${Math.min(percentSpent, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-dark-surface p-5 rounded-ios border border-gray-100 dark:border-dark-border shadow-sm">
                <p className="text-[10px] font-bold text-neutral-gray dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Remaining
                </p>
                <p className="text-xl font-bold text-sky-600">
                  {symbol}
                  {remaining.toLocaleString()}
                </p>
                <p className="text-[10px] font-medium text-neutral-gray dark:text-neutral-400 mt-1">
                  {percentRemaining.toFixed(0)}% left
                </p>
              </div>
            </div>
          </div>
        </section>
        {categoryPercents.length > 0 && (
          <section className="px-6 mb-10">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-ios border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-8">
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
                    <span className="text-xs font-medium text-neutral-charcoal dark:text-neutral-100">
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
            <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100">
              Recent Expenses
            </h3>
          </div>
          <div className="space-y-3">
            {expensesLoading ? (
              <div className="space-y-3">
                <div className="h-16 bg-soft-gray dark:bg-dark-elevated rounded-2xl animate-pulse" />
                <div className="h-16 bg-soft-gray dark:bg-dark-elevated rounded-2xl animate-pulse" />
                <div className="h-16 bg-soft-gray dark:bg-dark-elevated rounded-2xl animate-pulse" />
              </div>
            ) : expenses.length === 0 ? (
              <div className="py-8 text-center text-neutral-gray dark:text-neutral-400">
                No expenses yet. Tap + to add one.
              </div>
            ) : (
              expenses.slice(0, 10).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-soft-gray dark:bg-dark-elevated flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-xl">
                        {getCategoryIcon(exp.category)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-charcoal dark:text-neutral-100 truncate">
                        {exp.title}
                      </p>
                      <p className="text-[10px] text-neutral-gray dark:text-neutral-400">
                        {formatDate(exp.date)} • {exp.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-bold text-neutral-charcoal dark:text-neutral-100">
                      -{symbol}
                      {exp.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('Delete this expense?')) deleteExpense(exp.id)
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Delete expense"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-36 right-6 size-14 gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-200/50 flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showEditBudget && (
        <div className="fixed inset-0 z-[60] bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Edit Budget
              </h2>
              <button
                onClick={() => setShowEditBudget(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleEditBudget} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal dark:text-neutral-100 ml-1">
                  Total Budget
                </label>
                <div className="flex items-center gap-2 bg-soft-gray dark:bg-dark-elevated rounded-xl px-4">
                  <span className="text-lg font-semibold text-neutral-charcoal dark:text-neutral-100">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    placeholder="0"
                    required
                    className="flex-1 bg-transparent border-none py-4 text-lg font-semibold text-neutral-charcoal dark:text-neutral-100 focus:ring-0"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={updatingBudget || !editBudget || parseFloat(editBudget) < 0}
                className="w-full py-4 gradient-accent rounded-ios text-sky-900 font-bold text-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {updatingBudget ? 'Saving...' : 'Save Budget'}
              </button>
            </form>
          </div>
        </div>
      )}

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
                  Add Expense
                </h1>
                <div className="w-10" />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto min-h-0">
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
              <div className="text-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-gray dark:text-neutral-400 block mb-2">
                  Total Amount
                </label>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-semibold text-neutral-charcoal dark:text-neutral-100">
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
                <label className="text-[13px] font-semibold text-neutral-charcoal dark:text-neutral-100 ml-1">
                  Expense Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dinner at Santorini Grill"
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
                    setCategory(e.target.value as ExpenseCategory)
                  }
                  className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl px-4 py-4 text-[15px] appearance-none pr-10 text-neutral-charcoal dark:text-neutral-100"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-neutral-charcoal dark:text-neutral-100 ml-1">
                  Date
                </label>
                <input
                  type="date"
                  value={defaultDate}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl px-4 py-4 text-[15px] text-neutral-charcoal dark:text-neutral-100"
                />
                <p className="text-xs text-neutral-gray dark:text-neutral-400">
                  Must be within trip dates ({trip.startDate} – {trip.endDate})
                </p>
              </div>
              </form>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                onClick={handleSubmit}
                disabled={submitting || !amount || (date || defaultDate) < minDate || (date || defaultDate) > maxDate}
                className="w-full py-4 gradient-accent rounded-ios text-sky-900 font-bold text-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-70"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
