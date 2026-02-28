import { Link, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import { useAllActivities } from '@/hooks/useAllActivities'
import { useExpenses } from '@/hooks/useExpenses'
import { usePackingItems } from '@/hooks/usePackingItems'
import { useWeather } from '@/hooks/useWeather'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

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
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getWeatherIcon(code: number) {
  if (code === 0) return 'wb_sunny'
  if (code <= 3) return 'cloud'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 51 && code <= 67) return 'water_drop'
  if (code >= 71 && code <= 77) return 'ac_unit'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 95) return 'thunderstorm'
  return 'wb_sunny'
}

export default function TripOverviewPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading } = useTrip(tripId)
  const { activities } = useAllActivities(tripId)
  const { totalSpent } = useExpenses(tripId)
  const { items, packedCount } = usePackingItems(tripId)
  const { data: weather } = useWeather(
    trip?.lat ?? 0,
    trip?.lng ?? 0,
    !!(trip?.lat && trip?.lng)
  )

  if (loading || !trip) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency
  const remaining = trip.totalBudget - totalSpent
  const daysLeft = daysUntil(trip.startDate)
  const firstActivity = activities[0]
  const heroImage = `https://source.unsplash.com/800x400/?${encodeURIComponent(trip.destination)}`

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
      <div className="flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 justify-between border-b border-gray-100">
        <Link
          to="/trips"
          className="text-dark-gray flex size-10 items-center justify-start rounded-full active:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined !text-2xl">
            arrow_back_ios_new
          </span>
        </Link>
        <h2 className="text-dark-gray text-base font-semibold leading-tight tracking-tight flex-1 text-center">
          Trip Overview
        </h2>
        <div className="flex w-10 items-center justify-end" />
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
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent-blue-start/50 p-6 shadow-sm border border-blue-100/50">
            <div className="flex flex-col">
              <p className="text-neutral-gray text-[10px] font-bold uppercase tracking-wider mb-1">
                Upcoming Departure
              </p>
              <p className="text-neutral-charcoal text-2xl font-bold tracking-tight">
                {daysLeft} Day{daysLeft !== 1 ? 's' : ''} Left
              </p>
            </div>
            <div className="flex items-center justify-center bg-white/60 rounded-xl p-3 shadow-sm">
              <span className="material-symbols-outlined text-neutral-charcoal text-3xl">
                flight_takeoff
              </span>
            </div>
          </div>
        )}
        {weather && (
          <div className="p-6 rounded-2xl bg-white border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-gray text-[10px] font-bold uppercase tracking-wider">
                Local Weather
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-neutral-charcoal">
                  {weather.current.temp}°C
                </p>
                <p className="text-neutral-gray text-sm font-medium">
                  {weather.current.description}
                </p>
              </div>
              <p className="text-neutral-gray text-xs font-medium">
                Feels like {weather.current.feelsLike}°C
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="material-symbols-outlined text-5xl text-yellow-500"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {getWeatherIcon(weather.current.weatherCode)}
              </span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to={`/trips/${tripId}/map`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white border border-gray-100 p-5 active:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 text-neutral-charcoal border border-gray-100">
              <span className="material-symbols-outlined">map</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal">Map</p>
              <p className="text-xs text-neutral-gray mt-0.5">
                View activities on map
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/itinerary`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white border border-gray-100 p-5 active:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent-blue-start/50 text-neutral-charcoal shadow-sm">
              <span className="material-symbols-outlined">event_note</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal">
                Itinerary
              </p>
              <p className="text-xs text-neutral-gray mt-0.5">
                {activities.length} activities planned
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/budget`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white border border-gray-100 p-5 active:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 text-neutral-charcoal border border-gray-100">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal">Budget</p>
              <p className="text-xs text-neutral-gray mt-0.5">
                {symbol}
                {remaining.toLocaleString()} remaining
              </p>
            </div>
          </Link>
          <Link
            to={`/trips/${tripId}/packing`}
            className="flex flex-col items-start gap-4 rounded-2xl bg-white border border-gray-100 p-5 active:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gray-50 text-neutral-charcoal border border-gray-100">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <p className="font-bold text-sm text-neutral-charcoal">
                Packing List
              </p>
              <p className="text-xs text-neutral-gray mt-0.5">
                {packedCount} / {items.length} items
              </p>
            </div>
          </Link>
        </div>
        {firstActivity && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neutral-charcoal font-bold text-lg px-1">
                Upcoming Activity
              </h3>
              <Link
                to={`/trips/${tripId}/itinerary`}
                className="text-xs font-bold text-neutral-gray uppercase tracking-widest"
              >
                View All
              </Link>
            </div>
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 flex gap-4 shadow-sm active:bg-gray-50 transition-colors block"
            >
              <div className="size-20 rounded-xl bg-soft-gray shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-neutral-charcoal">
                  place
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold text-neutral-charcoal">
                  {firstActivity.name}
                </p>
                <p className="text-xs text-neutral-gray font-medium">
                  {firstActivity.date} {firstActivity.startTime}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-neutral-charcoal">
                    location_on
                  </span>
                  <span className="text-[11px] text-neutral-charcoal font-bold uppercase tracking-tight">
                    {firstActivity.location || 'No location'}
                  </span>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <span className="material-symbols-outlined text-neutral-gray">
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
