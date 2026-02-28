import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { useAllActivities } from '@/hooks/useAllActivities'
import { useExpenses } from '@/hooks/useExpenses'
import { usePackingItems } from '@/hooks/usePackingItems'
import { useWeather } from '@/hooks/useWeather'
import { CURRENCY_SYMBOLS, formatDateRange, daysUntil, getWeatherIcon, getUpcomingActivity } from '@/lib/utils'
import { PageSkeleton } from '@/components/LoadingSkeleton'

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading } = useTrip(tripId)
  const { activities } = useAllActivities(tripId)
  const { totalSpent } = useExpenses(tripId)
  const { items, packedCount } = usePackingItems(tripId)
  const hasCoordinates = !!(trip?.lat && trip?.lng && (trip.lat !== 0 || trip.lng !== 0))
  const { data: weather, loading: weatherLoading, error: weatherError } = useWeather(
    trip?.lat ?? 0,
    trip?.lng ?? 0,
    hasCoordinates
  )

  if (loading || !trip) {
    return <PageSkeleton />
  }

  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency
  const remaining = trip.totalBudget - totalSpent
  const daysLeft = daysUntil(trip.startDate)
  const upcomingActivity = getUpcomingActivity(activities)
  const heroImage = `https://picsum.photos/800/400?random=${trip.id}`

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
      <div className="flex items-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 justify-between border-b border-gray-100 dark:border-dark-border">
        <Link
          to="/trips"
          className="text-neutral-charcoal dark:text-neutral-100 flex size-10 items-center justify-start rounded-full active:bg-gray-100 dark:active:bg-dark-elevated transition-colors"
        >
          <span className="material-symbols-outlined !text-2xl">
            arrow_back_ios_new
          </span>
        </Link>
        <h2 className="text-neutral-charcoal dark:text-neutral-100 text-base font-semibold leading-tight tracking-tight flex-1 text-center">
          Trip Overview
        </h2>
        <Link
          to={`/trips/${tripId}/edit`}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-dark-elevated transition-colors"
        >
          <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-[22px]">
            edit
          </span>
        </Link>
      </div>
      <div className="relative w-full h-80 px-4 pt-4">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex flex-col gap-1">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white w-fit mb-2 border border-white/30">
                {trip.title}
              </span>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {trip.destination}
              </h1>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="material-symbols-outlined text-sm">
                  calendar_month
                </span>
                <p className="font-medium">
                  {formatDateRange(trip.startDate, trip.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 mt-6 flex flex-col gap-6">
        {daysLeft > 0 && (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent-blue-start/50 gradient-accent-trip-overview p-6 shadow-sm border border-blue-100/50 dark:border-sky-300/40">
            <div className="flex flex-col">
              <p className="text-neutral-gray text-[10px] font-bold uppercase tracking-wider mb-1">
                Upcoming Departure
              </p>
              <p className="text-neutral-charcoal text-2xl font-bold tracking-tight">
                {daysLeft} Day{daysLeft !== 1 ? 's' : ''} Left
              </p>
            </div>
            <div className="flex items-center justify-center bg-white/60 dark:bg-dark-elevated rounded-xl p-3 shadow-sm">
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-3xl">
                flight_takeoff
              </span>
            </div>
          </div>
        )}
        {weather && (
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center justify-between gap-4 shadow-sm dark:shadow-none min-w-0">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <p className="text-neutral-gray dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                Local Weather
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl font-bold text-neutral-charcoal dark:text-neutral-100">
                  {weather.current.temp}°C
                </p>
                <p className="text-neutral-gray dark:text-neutral-400 text-sm font-medium">
                  {weather.current.description}
                </p>
              </div>
              <p className="text-neutral-gray dark:text-neutral-400 text-xs font-medium">
                Feels like {weather.current.feelsLike}°C
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className="material-symbols-outlined text-5xl text-yellow-500 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {getWeatherIcon(weather.current.weatherCode)}
              </span>
            </div>
          </div>
        )}
        {!hasCoordinates && (
          <div className="p-6 rounded-2xl bg-soft-gray/50 dark:bg-dark-elevated/50 border border-dashed border-gray-200 dark:border-dark-border flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-neutral-gray dark:text-neutral-500">cloud_off</span>
            <div>
              <p className="font-medium text-neutral-charcoal dark:text-neutral-100">Weather unavailable</p>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mt-0.5">
                Select a destination from the map when creating a trip to see local weather.
              </p>
            </div>
          </div>
        )}
        {hasCoordinates && weatherLoading && (
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-4 animate-pulse">
            <div className="h-10 w-24 bg-soft-gray dark:bg-dark-elevated rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-soft-gray dark:bg-dark-elevated rounded" />
              <div className="h-3 w-24 bg-soft-gray dark:bg-dark-elevated rounded" />
            </div>
          </div>
        )}
        {hasCoordinates && weatherError && (
          <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-red-400 dark:text-red-500">error</span>
            <div>
              <p className="font-medium text-neutral-charcoal dark:text-neutral-100">Weather unavailable</p>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mt-0.5">
                Could not load weather. Please try again later.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to={`/trips/${tripId}/map`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 border border-gray-100 dark:border-dark-border">
              <span className="material-symbols-outlined">map</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal dark:text-neutral-100">Map</p>
              <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">
                View activities on map
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/itinerary`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent-blue-start/50 gradient-accent-trip-overview text-neutral-charcoal shadow-sm">
              <span className="material-symbols-outlined">event_note</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal dark:text-neutral-100">
                Itinerary
              </p>
              <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">
                {activities.length} activities planned
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/budget`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 border border-gray-100 dark:border-dark-border">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal dark:text-neutral-100">Budget</p>
              <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">
                {symbol}
                {remaining.toLocaleString()} remaining
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/packing`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 border border-gray-100 dark:border-dark-border">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal dark:text-neutral-100">
                Packing List
              </p>
              <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-0.5">
                {packedCount} / {items.length} items
              </p>
            </div>
          </Link>
        </div>
        {upcomingActivity && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neutral-charcoal dark:text-neutral-100 font-bold text-lg px-1">
                Upcoming Activity
              </h3>
              <Link
                to={`/trips/${tripId}/itinerary`}
                className="text-xs font-bold text-neutral-gray dark:text-neutral-400 uppercase tracking-widest"
              >
                View All
              </Link>
            </div>
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-4 flex gap-4 shadow-sm dark:shadow-none active:bg-gray-50 dark:active:bg-dark-elevated transition-colors block"
            >
              <div className="size-20 rounded-xl bg-soft-gray dark:bg-dark-elevated shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-neutral-charcoal dark:text-neutral-100">
                  place
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold text-neutral-charcoal dark:text-neutral-100">
                  {upcomingActivity.name}
                </p>
                <p className="text-xs text-neutral-gray dark:text-neutral-400 font-medium">
                  {upcomingActivity.date} {upcomingActivity.startTime}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-neutral-charcoal dark:text-neutral-100">
                    location_on
                  </span>
                  <span className="text-[11px] text-neutral-charcoal dark:text-neutral-100 font-bold uppercase tracking-tight">
                    {upcomingActivity.location || 'No location'}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <span className="material-symbols-outlined text-neutral-gray dark:text-neutral-400">
                  chevron_right
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
