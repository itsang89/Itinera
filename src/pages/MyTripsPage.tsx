import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { useTrips } from '@/hooks/useTrips'
import { formatDateRange, daysUntil } from '@/lib/utils'
import { TripCardSkeleton } from '@/components/LoadingSkeleton'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function MyTripsPage() {
  const { user } = useAuth()
  const { trips, loading, error, deleteTrip } = useTrips(user?.uid)
  const { showToast } = useToast()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [tripToDelete, setTripToDelete] = useState<string | null>(null)

  const now = new Date().toISOString().split('T')[0]
  const upcoming = trips.filter((t) => t.endDate >= now)
  const past = trips.filter((t) => t.endDate < now)
  const displayed = tab === 'upcoming' ? upcoming : past

  const handleDelete = async (tripId: string) => {
    setDeletingId(tripId)
    try {
      await deleteTrip(tripId)
      showToast('Trip deleted')
      setTripToDelete(null)
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
            <p className="text-[11px] font-semibold text-neutral-gray dark:text-neutral-400 mt-0.5">
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
            <Link
              to="/trips/new"
              className="flex flex-col items-center py-14 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border bg-soft-gray/30 dark:bg-dark-elevated/30 text-center group active:scale-[0.99] transition-transform"
            >
              <span className="material-symbols-outlined text-5xl text-neutral-300 dark:text-neutral-500 mb-4 group-hover:text-accent-blue-start dark:group-hover:text-sky-400 transition-colors">
                flight_takeoff
              </span>
              <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-1">
                {tab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
              </h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-5 max-w-[240px]">
                {tab === 'upcoming'
                  ? 'Plan your next adventure. Create a trip to add destinations, build your itinerary, and track your budget.'
                  : 'Trips you\'ve completed will appear here.'}
              </p>
              {tab === 'upcoming' && (
                <span className="inline-flex items-center gap-2 py-3 px-5 gradient-accent text-sky-900 dark:text-sky-100 font-bold rounded-ios shadow-sm">
                  <span className="material-symbols-outlined text-xl">add</span>
                  Create your first trip
                </span>
              )}
            </Link>
          ) : (
            displayed.map((trip) => {
              const daysLeft = daysUntil(trip.startDate)
              const isUpcoming = trip.endDate >= now
              return (
                <div
                  key={trip.id}
                  className="group relative p-5 pr-24 rounded-ios bg-white dark:bg-dark-surface border border-border-gray/60 dark:border-dark-border shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none transition-all active:scale-[0.98] active:bg-soft-gray/50 dark:active:bg-dark-elevated"
                >
                  <Link to={`/trips/${trip.id}`} className="block">
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 leading-tight min-w-0 flex-1">
                        {trip.title}
                      </h3>
                      {isUpcoming && daysLeft > 0 && (
                        <span className="flex-shrink-0 bg-sky-50 dark:bg-sky-500/60 text-sky-700 dark:text-white text-[10px] font-bold px-2 py-1 rounded-md">
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setTripToDelete(trip.id)
                    }}
                    disabled={!!deletingId}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium"
                    title="Delete trip"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </main>
      <Link
        to="/trips/new"
        className="fixed bottom-36 right-6 size-14 min-w-[44px] min-h-[44px] gradient-accent text-sky-900 dark:text-sky-100 rounded-full shadow-lg shadow-sky-300/50 dark:shadow-sky-900/30 flex items-center justify-center active:scale-90 transition-all z-40"
        aria-label="Create new trip"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <ConfirmModal
        open={!!tripToDelete}
        title="Delete trip"
        message="Are you sure you want to delete this trip? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => { if (tripToDelete) await handleDelete(tripToDelete) }}
        onCancel={() => setTripToDelete(null)}
      />
    </>
  )
}
