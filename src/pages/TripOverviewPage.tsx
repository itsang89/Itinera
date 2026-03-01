import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { clearLastTripId } from '@/lib/lastTrip'
import { useAuth } from '@/context/AuthContext'
import { useTrip } from '@/hooks/useTrip'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAllActivities } from '@/hooks/useAllActivities'
import { useExpenses } from '@/hooks/useExpenses'
import { usePackingItems } from '@/hooks/usePackingItems'
import { useWeather } from '@/hooks/useWeather'
import { CURRENCY_SYMBOLS, formatDateRange, daysUntil, getWeatherIcon, getUpcomingActivity } from '@/lib/utils'
import { TripOverviewSkeleton } from '@/components/LoadingSkeleton'
import { ProgressRing } from '@/components/ProgressRing'
import { CurrencyConverterCard } from '@/components/CurrencyConverterCard'

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { user } = useAuth()
  const { defaultCurrency } = useUserProfile(user?.uid)
  const { trip, loading, error } = useTrip(tripId)
  const { activities } = useAllActivities(tripId)
  const { totalSpent } = useExpenses(tripId)
  const { items, packedCount } = usePackingItems(tripId)
  const hasCoordinates = !!(trip?.lat && trip?.lng && (trip.lat !== 0 || trip.lng !== 0))
  const { data: weather, loading: weatherLoading, error: weatherError } = useWeather(
    trip?.lat ?? 0,
    trip?.lng ?? 0,
    hasCoordinates
  )
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  if (loading) {
    return <TripOverviewSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-dark-bg">
        <span className="material-symbols-outlined text-5xl text-red-400 dark:text-red-500 mb-4">error</span>
        <h2 className="text-xl font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">Failed to load trip</h2>
        <p className="text-neutral-gray dark:text-neutral-400 text-sm text-center mb-6">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="py-3 px-6 gradient-accent rounded-ios text-sky-900 font-bold"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!trip) {
    clearLastTripId()
    return <Navigate to="/trips" replace />
  }

  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency
  const remaining = trip.totalBudget - totalSpent
  const daysLeft = daysUntil(trip.startDate)
  const upcomingActivity = getUpcomingActivity(activities)

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
      <div className="flex items-center bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 justify-between border-b border-gray-100 dark:border-dark-border">
        <Link
          to="/trips"
          className="text-neutral-charcoal dark:text-neutral-100 flex size-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-dark-elevated transition-colors"
          aria-label="Back to trips"
        >
          <span className="material-symbols-outlined !text-2xl">
            home
          </span>
        </Link>
        <h2 className="text-neutral-charcoal dark:text-neutral-100 text-base font-semibold leading-tight tracking-tight flex-1 text-center">
          Trip Overview
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-dark-elevated transition-colors"
            aria-label="More options"
          >
            <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-[22px]">
              more_vert
            </span>
          </button>
          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMoreMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] py-2 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-lg overflow-hidden">
                <Link
                  to="/profile"
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-charcoal dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors min-h-[44px]"
                  aria-label="Profile"
                >
                  <span className="material-symbols-outlined text-[22px]">account_circle</span>
                  <span className="font-medium text-[15px]">Profile</span>
                </Link>
                <Link
                  to={`/trips/${tripId}/edit`}
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-charcoal dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors min-h-[44px]"
                  aria-label="Edit trip"
                >
                  <span className="material-symbols-outlined text-[22px]">edit</span>
                  <span className="font-medium text-[15px]">Edit trip</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="px-6 pt-6 pb-4">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-accent-blue-start/20 to-accent-blue-end/20 dark:from-sky-900/30 dark:to-sky-800/30 border border-gray-100 dark:border-dark-border p-6">
          <span className="text-[10px] font-bold text-neutral-gray dark:text-neutral-400">
            {trip.title}
          </span>
          <h1 className="text-2xl font-bold text-neutral-charcoal dark:text-neutral-100 tracking-tight mt-1">
            {trip.destination}
          </h1>
          <div className="flex items-center gap-2 text-neutral-gray dark:text-neutral-400 text-sm mt-2">
            <span className="material-symbols-outlined text-sm">
              calendar_month
            </span>
            <p className="font-medium">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 mt-6 flex flex-col gap-6">
        {daysLeft > 0 && (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent-blue-start/50 gradient-accent-trip-overview p-6 shadow-sm border border-blue-100/50 dark:border-sky-300/40">
            <div className="flex flex-col">
              <p className="text-neutral-gray text-[10px] font-bold mb-1">
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
              <p className="text-neutral-gray dark:text-neutral-400 text-[10px] font-bold">
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
        <CurrencyConverterCard tripCurrency={trip.currency} userCurrency={defaultCurrency} />
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
            className="relative flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="absolute top-3 right-3">
              <ProgressRing
                value={trip.totalBudget > 0 ? (totalSpent / trip.totalBudget) * 100 : 0}
                max={100}
                size={40}
                strokeWidth={4}
                variant="compact"
              />
            </div>
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
            className="relative flex flex-col items-start gap-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 active:bg-gray-50 dark:active:bg-dark-elevated transition-colors shadow-sm dark:shadow-none"
          >
            <div className="absolute top-3 right-3">
              <ProgressRing
                value={items.length > 0 ? packedCount : 0}
                max={items.length || 1}
                size={40}
                strokeWidth={4}
                sublabel={items.length > 0 ? `${packedCount}/${items.length}` : '0/0'}
                variant="compact"
              />
            </div>
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
                className="text-xs font-bold text-neutral-gray dark:text-neutral-400"
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
                  <span className="text-[11px] text-neutral-charcoal dark:text-neutral-100 font-bold">
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
