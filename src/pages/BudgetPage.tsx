import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { useTrip } from '@/hooks/useTrip'
import { useExpenses } from '@/hooks/useExpenses'
import { CURRENCY_SYMBOLS, formatDate, daysUntil } from '@/lib/utils'
import { PageSkeleton, ExpenseItemSkeleton } from '@/components/LoadingSkeleton'
import { ProgressRing } from '@/components/ProgressRing'
import { ConfirmModal } from '@/components/ConfirmModal'
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
  const { expenses, totalSpent, addExpense, updateExpense, deleteExpense, loading: expensesLoading, error: expensesError } =
    useExpenses(tripId)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<typeof expenses[0] | null>(null)
  const [showEditBudget, setShowEditBudget] = useState(false)
  const [editBudget, setEditBudget] = useState('')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [date, setDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updatingBudget, setUpdatingBudget] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount))
      setTitle(editingExpense.title)
      setCategory(editingExpense.category)
      setDate(editingExpense.date)
    } else if (showForm) {
      setAmount('')
      setTitle('')
      setCategory('Food')
      setDate('')
    }
  }, [editingExpense, showForm])

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
      const data = {
        title: title.trim() || 'Untitled expense',
        amount: amt,
        category,
        date: dateToUse,
      }
      if (editingExpense) {
        await updateExpense(editingExpense.id, data)
        showToast('Expense updated!')
      } else {
        await addExpense(data)
        showToast('Expense added!')
      }
      setEditingExpense(null)
      setAmount('')
      setTitle('')
      setCategory('Food')
      setDate('')
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditForm = (exp: typeof expenses[0]) => {
    setEditingExpense(exp)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingExpense(null)
    setAmount('')
    setTitle('')
    setCategory('Food')
    setDate('')
  }

  const handleEditBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(editBudget)
    if (isNaN(value) || value < 0) return
    setUpdatingBudget(true)
    try {
      await updateTrip({ totalBudget: value })
      showToast('Budget updated!')
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
            className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-dark-elevated"
            aria-label="Back to trip overview"
          >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100">
                chevron_left
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Budget Tracker
              </h1>
              <p className="text-[10px] font-semibold text-neutral-gray dark:text-neutral-400 truncate max-w-[180px]">
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
        <section className="px-6 py-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xs font-semibold text-neutral-gray dark:text-neutral-400 mb-1">
                Total budget
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
            {expensesError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
                Could not load expenses: {expensesError.message}
              </div>
            )}
            <div className="flex flex-col items-center gap-6">
              <ProgressRing
                value={percentSpent}
                max={100}
                size={140}
                strokeWidth={10}
                label="Spent"
                sublabel={`${percentSpent.toFixed(0)}%`}
              />
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white dark:bg-dark-surface p-5 rounded-ios border border-gray-100 dark:border-dark-border shadow-sm">
                  <p className="text-[10px] font-bold text-neutral-gray dark:text-neutral-400 mb-2">
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
                  <p className="text-[10px] font-bold text-neutral-gray dark:text-neutral-400 mb-2">
                    Remaining
                  </p>
                  <p className="text-xl font-bold text-accent-teal dark:text-teal-400">
                    {symbol}
                    {remaining.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-medium text-neutral-gray dark:text-neutral-400 mt-1">
                    {percentRemaining.toFixed(0)}% left
                  </p>
                </div>
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
                <ExpenseItemSkeleton />
                <ExpenseItemSkeleton />
                <ExpenseItemSkeleton />
                <ExpenseItemSkeleton />
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center py-12 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border bg-soft-gray/30 dark:bg-dark-elevated/30 text-center">
                <span className="material-symbols-outlined text-5xl text-neutral-300 dark:text-neutral-500 mb-4">
                  payments
                </span>
                <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-1">
                  No expenses yet
                </h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-5 max-w-[260px]">
                  Track what you spend on food, transport, and activities to stay within your budget.
                </p>
                <button
                  onClick={() => { setEditingExpense(null); setShowForm(true) }}
                  className="inline-flex items-center gap-2 py-3 px-5 gradient-accent text-sky-900 dark:text-sky-100 font-bold rounded-ios shadow-sm active:scale-[0.98] transition-transform"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  Add your first expense
                </button>
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
                      onClick={() => openEditForm(exp)}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-soft-gray dark:hover:bg-dark-elevated text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100 transition-colors text-sm font-medium"
                      title="Edit expense"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setExpenseToDelete(exp.id)}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium"
                      title="Delete expense"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <button
        onClick={() => { setEditingExpense(null); setShowForm(true) }}
        className="fixed bottom-36 right-6 size-14 min-w-[44px] min-h-[44px] gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-300/50 flex items-center justify-center active:scale-90 transition-all z-40"
        aria-label="Add expense"
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
                  Total budget
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
                  type="button"
                  onClick={closeForm}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                  {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </h1>
                <div className="w-10" />
              </div>
            </header>
            <form id="add-expense-form" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <div className="text-center">
                <label className="text-[11px] font-bold text-neutral-gray dark:text-neutral-400 block mb-2">
                  Total amount
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
                  Expense title
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
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                type="submit"
                form="add-expense-form"
                disabled={submitting || !amount || (date || defaultDate) < minDate || (date || defaultDate) > maxDate}
                className="w-full py-4 gradient-accent rounded-ios text-sky-900 font-bold text-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-sky-900 border-t-transparent rounded-full animate-spin" />
                    {editingExpense ? 'Saving...' : 'Adding...'}
                  </>
                ) : editingExpense ? (
                  'Save Changes'
                ) : (
                  'Add Expense'
                )}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!expenseToDelete}
        title="Delete expense"
        message="Are you sure you want to delete this expense? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (expenseToDelete) {
            await deleteExpense(expenseToDelete)
            showToast('Expense deleted')
          }
        }}
        onCancel={() => setExpenseToDelete(null)}
      />
    </>
  )
}
