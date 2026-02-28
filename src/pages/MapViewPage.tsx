import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { useTrip } from '@/hooks/useTrip'
import { useAllActivities } from '@/hooks/useAllActivities'
import { getCategoryIcon } from '@/hooks/useActivities'
import type { ActivityCategory } from '@/types'

function MapContent({
  activities,
  center,
}: {
  activities: Array<{
    id: string
    name: string
    location: string
    lat?: number
    lng?: number
    category: ActivityCategory
  }>
  center: { lat: number; lng: number }
}) {
  const validActivities = activities.filter((a) => a.lat != null && a.lng != null)

  return (
    <Map
      defaultCenter={center}
      defaultZoom={12}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="w-full h-full min-h-[400px]"
    >
      {validActivities.map((activity) => (
        <Marker
          key={activity.id}
          position={{ lat: activity.lat!, lng: activity.lng! }}
          title={activity.name}
        />
      ))}
    </Map>
  )
}

export default function MapViewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading: tripLoading } = useTrip(tripId)
  const { activities } = useAllActivities(tripId)
  const [view, setView] = useState<'map' | 'list'>('map')

  const center = useMemo(() => {
    if (trip?.lat && trip?.lng) {
      return { lat: trip.lat, lng: trip.lng }
    }
    const withCoords = activities.filter((a) => a.lat != null && a.lng != null)
    if (withCoords.length > 0) {
      const lat =
        withCoords.reduce((s, a) => s + (a.lat ?? 0), 0) / withCoords.length
      const lng =
        withCoords.reduce((s, a) => s + (a.lng ?? 0), 0) / withCoords.length
      return { lat, lng }
    }
    return { lat: 48.8566, lng: 2.3522 }
  }, [trip, activities])

  if (tripLoading || !trip) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-6rem)]">
      <header className="relative z-10 px-6 py-5 flex items-center justify-between bg-white/90 backdrop-blur-md">
        <Link
          to={`/trips/${tripId}`}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-neutral-charcoal">
            chevron_left
          </span>
        </Link>
        <div className="flex bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg border border-gray-100">
          <button
            onClick={() => setView('list')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
              view === 'list' ? 'text-sky-900 gradient-accent shadow-sm' : 'text-neutral-gray'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
              view === 'map' ? 'text-sky-900 gradient-accent shadow-sm' : 'text-neutral-gray'
            }`}
          >
            Map
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray">
              No activities with locations yet.
            </div>
          ) : (
            activities.map((a) => (
              <Link
                key={a.id}
                to={`/trips/${tripId}/itinerary`}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-soft-gray flex items-center justify-center">
                  <span className="material-symbols-outlined text-neutral-charcoal">
                    {getCategoryIcon(a.category)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-charcoal truncate">
                    {a.name}
                  </p>
                  <p className="text-xs text-neutral-gray truncate">
                    {a.location || 'No location'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-neutral-gray">
                  chevron_right
                </span>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 relative min-h-[400px]">
          <MapContent activities={activities} center={center} />
        </div>
      )}
    </div>
  )
}
