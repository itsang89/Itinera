import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTrips } from '@/hooks/useTrips'

function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

function daysUntil(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function MyTripsPage() {
  const { user } = useAuth()
  const { trips, loading, deleteTrip } = useTrips(user?.uid)
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
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading trips...</div>
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-charcoal">
              My Trips
            </h1>
            <p className="text-[11px] font-semibold text-neutral-gray mt-0.5 uppercase tracking-[0.05em]">
              {upcoming.length} upcoming journey{upcoming.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <div className="px-6 py-4">
          <div className="flex bg-soft-gray p-1 rounded-xl">
            <button
              onClick={() => setTab('upcoming')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                tab === 'upcoming'
                  ? 'gradient-accent text-sky-900 shadow-sm'
                  : 'text-neutral-gray hover:text-neutral-charcoal'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab('past')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                tab === 'past'
                  ? 'gradient-accent text-sky-900 shadow-sm'
                  : 'text-neutral-gray hover:text-neutral-charcoal'
              }`}
            >
              Past
            </button>
          </div>
        </div>
        <div className="px-6 space-y-3 mt-2">
          {displayed.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray text-sm">
              No {tab} trips. Create one to get started!
            </div>
          ) : (
            displayed.map((trip) => {
              const daysLeft = daysUntil(trip.startDate)
              const isUpcoming = trip.endDate >= now
              return (
                <div
                  key={trip.id}
                  className="group relative p-5 rounded-ios bg-white border border-border-gray/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all active:scale-[0.98] active:bg-soft-gray/50"
                >
                  <Link to={`/trips/${trip.id}`} className="block">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-neutral-charcoal leading-tight">
                        {trip.title}
                      </h3>
                      {isUpcoming && daysLeft > 0 && daysLeft <= 30 && (
                        <span className="bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                          {daysLeft} Day{daysLeft !== 1 ? 's' : ''} left
                        </span>
                      )}
                      {!isUpcoming && (
                        <span className="text-neutral-gray/40 material-symbols-outlined text-[20px]">
                          chevron_right
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-gray mb-1">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      <p className="text-sm font-medium">{trip.destination}</p>
                    </div>
                    <p className="text-xs font-medium text-neutral-gray/70 ml-[22px]">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, trip.id)}
                    disabled={deletingId === trip.id}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 text-neutral-gray hover:text-red-500 transition-colors"
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
        className="fixed bottom-28 right-6 size-14 gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-200/50 flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>
    </>
  )
}
