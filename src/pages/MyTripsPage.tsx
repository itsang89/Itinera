import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTrips } from '@/hooks/useTrips'
import { formatDateRange, daysUntil } from '@/lib/utils'
import { TripCardSkeleton } from '@/components/LoadingSkeleton'

export default function MyTripsPage() {
  const { user } = useAuth()
  const { trips, loading, error, deleteTrip } = useTrips(user?.uid)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const now = new Date().toISOString().split('T')[0]
  const upcoming = trips.filter((t) => t.endDate >= now)
  const past = trips.filter((t) => t.endDate < now)
  const displayed = tab === 'upcoming' ? upcoming : past

  const handleDelete = async (e: React.MouseEvent, tripId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this trip? This cannot be undone.')) return
    setDeletingId(tripId)
    try {
      await deleteTrip(tripId)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-6 space-y-3">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-6">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          <p className="font-medium mb-1">Could not load trips</p>
          <p className="text-red-500 dark:text-red-400/90">{error.message}</p>
          <p className="mt-2 text-xs">
            Try refreshing the page. If the problem persists, ensure Firestore indexes are deployed (run{' '}
            <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded">firebase deploy --only firestore:indexes</code>).
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
              My Trips
            </h1>
            <p className="text-[11px] font-semibold text-neutral-gray dark:text-neutral-400 mt-0.5 uppercase tracking-[0.05em]">
              {upcoming.length} upcoming journey{upcoming.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-6 py-4">
          <div className="flex bg-soft-gray dark:bg-dark-elevated p-1 rounded-xl">
            <button
              onClick={() => setTab('upcoming')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                tab === 'upcoming'
                  ? 'gradient-accent text-sky-900 shadow-sm'
                  : 'text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab('past')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                tab === 'past'
                  ? 'gradient-accent text-sky-900 shadow-sm'
                  : 'text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
              }`}
            >
              Past
            </button>
          </div>
        </div>
        <div className="px-6 space-y-3 mt-2">
          {displayed.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray dark:text-neutral-400 text-sm">
              No {tab} trips. Create one to get started!
            </div>
          ) : (
            displayed.map((trip) => {
              const daysLeft = daysUntil(trip.startDate)
              const isUpcoming = trip.endDate >= now
              return (
                <div
                  key={trip.id}
                  className="group relative p-5 pr-14 rounded-ios bg-white dark:bg-dark-surface border border-border-gray/60 dark:border-dark-border shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none transition-all active:scale-[0.98] active:bg-soft-gray/50 dark:active:bg-dark-elevated"
                >
                  <Link to={`/trips/${trip.id}`} className="block">
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 leading-tight min-w-0 flex-1">
                        {trip.title}
                      </h3>
                      {isUpcoming && daysLeft > 0 && daysLeft <= 30 && (
                        <span className="flex-shrink-0 bg-sky-50 dark:bg-sky-500/60 text-sky-700 dark:text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                          {daysLeft} Day{daysLeft !== 1 ? 's' : ''} left
                        </span>
                      )}
                      {!isUpcoming && (
                        <span className="flex-shrink-0 text-neutral-gray/40 dark:text-neutral-500 material-symbols-outlined text-[20px]">
                          chevron_right
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-gray dark:text-neutral-400 mb-1">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      <p className="text-sm font-medium">{trip.destination}</p>
                    </div>
                    <p className="text-xs font-medium text-neutral-gray/70 dark:text-neutral-500 ml-[22px]">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, trip.id)}
                    disabled={deletingId === trip.id}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete trip"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </main>
      <Link
        to="/trips/new"
        className="fixed bottom-36 right-6 size-14 gradient-accent text-sky-900 dark:text-sky-100 rounded-full shadow-lg shadow-sky-200/50 dark:shadow-sky-900/30 flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>
    </>
  )
}
