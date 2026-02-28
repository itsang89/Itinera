import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTrip } from '@/hooks/useTrip'
import type { CurrencyCode } from '@/hooks/useUserProfile'
import { PlacesAutocomplete } from '@/components/places/PlacesAutocomplete'
import { PageSkeleton } from '@/components/LoadingSkeleton'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD (HK$)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
]

export default function EditTripPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { trip, loading, updateTrip } = useTrip(tripId)
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [totalBudget, setTotalBudget] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (trip) {
      setTitle(trip.title)
      setDestination(trip.destination)
      setLat(trip.lat)
      setLng(trip.lng)
      setStartDate(trip.startDate)
      setEndDate(trip.endDate)
      setCurrency((trip.currency as CurrencyCode) || 'USD')
      setTotalBudget(String(trip.totalBudget || ''))
    }
  }, [trip])

  const handlePlaceSelect = (place: { formatted_address: string; lat: number; lng: number }) => {
    setDestination(place.formatted_address)
    setLat(place.lat)
    setLng(place.lng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Trip name is required')
      return
    }
    if (!destination.trim()) {
      setError('Destination is required')
      return
    }
    if (!startDate || !endDate) {
      setError('Start and end dates are required')
      return
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) {
      setError('End date must be after start date')
      return
    }
    if (!tripId) return
    setSubmitting(true)
    try {
      await updateTrip({
        title: title.trim(),
        destination: destination.trim(),
        lat,
        lng,
        startDate,
        endDate,
        totalBudget: parseFloat(totalBudget) || 0,
        currency,
      })
      navigate(`/trips/${tripId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !trip) {
    return <PageSkeleton />
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => navigate(`/trips/${tripId}`)}
            className="text-slate-400 dark:text-neutral-400 flex size-10 items-center justify-start active:opacity-50 transition-opacity"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <h2 className="text-slate-900 dark:text-neutral-100 text-[17px] font-semibold flex-1 text-center pr-10">
            Edit Trip
          </h2>
        </div>
      </header>
      <div className="px-6 pb-2">
        <h1 className="text-slate-900 dark:text-neutral-100 tracking-tight text-2xl font-bold pt-4">
          Update trip details
        </h1>
        <p className="text-slate-400 dark:text-neutral-400 text-[15px] mt-1">
          Change any of the details below.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 px-6 py-6 pb-36"
      >
        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
            {error}
          </div>
        )}
        <div className="flex flex-col w-full">
          <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium uppercase tracking-wider mb-2 ml-1">
            Trip Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekend in Paris"
            className="flex w-full rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] placeholder:text-slate-300 dark:placeholder:text-neutral-500 px-4 text-base font-normal focus:border-accent-blue-start dark:focus:border-sky-500 focus:ring-2 focus:ring-accent-blue-start/20 dark:focus:ring-sky-500/20 transition-colors"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium uppercase tracking-wider mb-2 ml-1">
            Destination
          </label>
          <PlacesAutocomplete
            value={destination}
            onChange={setDestination}
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search cities or countries"
            className="flex w-full rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] placeholder:text-slate-300 dark:placeholder:text-neutral-500 pl-4 pr-12 text-base font-normal focus:border-accent-blue-start dark:focus:border-sky-500 focus:ring-2 focus:ring-accent-blue-start/20 dark:focus:ring-sky-500/20 transition-colors"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium uppercase tracking-wider mb-2 ml-1">
            Select Dates
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] px-4 text-base"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] px-4 text-base"
            />
          </div>
          <p className="text-xs text-neutral-gray dark:text-neutral-400 mt-1.5">
            Shortening dates will remove activities on removed days.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col w-1/3">
            <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium uppercase tracking-wider mb-2 ml-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] pl-4 pr-10 text-base font-normal focus:border-accent-blue-start dark:focus:border-sky-500 focus:ring-2 focus:ring-accent-blue-start/20 dark:focus:ring-sky-500/20"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium uppercase tracking-wider mb-2 ml-1">
              Budget
            </label>
            <input
              type="number"
              step="0.01"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="0.00"
              className="flex w-full rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] placeholder:text-slate-300 dark:placeholder:text-neutral-500 px-4 text-base font-normal focus:border-accent-blue-start dark:focus:border-sky-500 focus:ring-2 focus:ring-accent-blue-start/20 dark:focus:ring-sky-500/20"
            />
          </div>
        </div>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent dark:from-dark-bg dark:via-dark-bg z-[60]">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[56px] gradient-accent text-white rounded-ios font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </button>
        </div>
      </form>
    </>
  )
}
