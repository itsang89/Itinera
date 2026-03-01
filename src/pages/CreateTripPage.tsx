import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { addDoc, collection } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { useTrips } from '@/hooks/useTrips'
import { useUserProfile, type CurrencyCode } from '@/hooks/useUserProfile'
import { db } from '@/lib/firebase'
import { PlacesAutocomplete } from '@/components/places/PlacesAutocomplete'
import { DEFAULT_PACKING_ITEMS } from '@/lib/packing'
import { CURRENCY_OPTIONS } from '@/lib/utils'
import type { Trip } from '@/types'

function toDateString(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function CreateTripPage() {
  const { user } = useAuth()
  const { createTrip } = useTrips(user?.uid)
  const { defaultCurrency } = useUserProfile(user?.uid)
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [lat, setLat] = useState<number>(0)
  const [lng, setLng] = useState<number>(0)
  const today = toDateString(new Date())
  const defaultEnd = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return toDateString(d)
  })()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [currency, setCurrency] = useState(defaultCurrency)
  const [totalBudget, setTotalBudget] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dateError, setDateError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    setCurrency(defaultCurrency)
  }, [defaultCurrency])

  useEffect(() => {
    if (!startDate || !endDate) {
      setDateError('')
      return
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) {
      setDateError('End date must be after start date')
    } else {
      setDateError('')
    }
  }, [startDate, endDate])

  const handlePlaceSelect = (place: { formatted_address: string; lat?: number; lng?: number }) => {
    setDestination(place.formatted_address)
    if (place.lat != null) setLat(place.lat)
    if (place.lng != null) setLng(place.lng)
  }

  const canProceedStep1 = title.trim().length > 0 && destination.trim().length > 0
  const canSubmitStep2 = !dateError && startDate && endDate

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
    if (!user) return
    setSubmitting(true)
    try {
      const tripData: Omit<Trip, 'id'> = {
        title: title.trim(),
        destination: destination.trim(),
        lat,
        lng,
        startDate,
        endDate,
        totalBudget: parseFloat(totalBudget) || 0,
        currency,
        createdBy: user.uid,
      }
      const tripId = await createTrip(tripData)
      showToast('Trip created!')

      let dayNumber = 1
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        await addDoc(collection(db, 'trips', tripId, 'days'), {
          date: d.toISOString().split('T')[0],
          dayNumber: dayNumber++,
        })
      }

      for (const item of DEFAULT_PACKING_ITEMS) {
        await addDoc(collection(db, 'trips', tripId, 'packingItems'), {
          name: item.name,
          category: item.category,
          packed: false,
        })
      }

      navigate(`/trips/${tripId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link
            to="/trips"
            className="text-slate-400 dark:text-neutral-400 flex size-11 min-w-[44px] min-h-[44px] items-center justify-start active:opacity-50 transition-opacity"
            aria-label="Back to trips"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </Link>
          <h2 className="text-slate-900 dark:text-neutral-100 text-[17px] font-semibold flex-1 text-center pr-10">
            New Trip
          </h2>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              step === 1 ? 'gradient-accent' : 'bg-soft-gray dark:bg-dark-elevated'
            }`}
            aria-label="Step 1"
          />
          <button
            type="button"
            onClick={() => step === 1 && canProceedStep1 && setStep(2)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              step === 2 ? 'gradient-accent' : 'bg-soft-gray dark:bg-dark-elevated'
            }`}
            aria-label="Step 2"
          />
        </div>
      </header>
      <div className="px-6 pb-2">
        <h1 className="font-serif text-slate-900 dark:text-neutral-100 text-page-title font-normal tracking-tight pt-4">
          {step === 1 ? 'Basics' : 'Dates & budget'}
        </h1>
        <p className="text-slate-400 dark:text-neutral-400 text-[15px] mt-1">
          {step === 1
            ? 'Name your trip and choose a destination.'
            : 'Set your travel dates and budget.'}
        </p>
      </div>
      <form
        onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2) }}
        className="flex flex-col gap-6 px-6 py-6 pb-36"
      >
        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
            {error}
          </div>
        )}
        {step === 1 && (
          <>
            <div className="flex flex-col w-full">
              <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium mb-2 ml-1">
                Trip name
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
              <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium mb-2 ml-1">
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
          </>
        )}
        {step === 2 && (
          <>
            <div className="flex flex-col w-full">
              <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium mb-2 ml-1">
                Select dates
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
              {dateError && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5">{dateError}</p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col w-1/3">
                <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium mb-2 ml-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full rounded-ios text-slate-900 dark:text-neutral-100 border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface h-[52px] pl-4 pr-10 text-base font-normal focus:border-accent-blue-start dark:focus:border-sky-500 focus:ring-2 focus:ring-accent-blue-start/20 dark:focus:ring-sky-500/20"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-slate-500 dark:text-neutral-400 text-[13px] font-medium mb-2 ml-1">
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
          </>
        )}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white to-transparent dark:from-dark-bg dark:via-dark-bg z-[60] flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 h-[56px] rounded-ios font-bold text-lg border-2 border-slate-200 dark:border-dark-border text-slate-700 dark:text-neutral-300 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={
              submitting ||
              (step === 1 && !canProceedStep1) ||
              (step === 2 && (!canSubmitStep2 || !!dateError))
            }
            className={`${step === 2 ? 'flex-1' : 'w-full'} h-[56px] gradient-accent text-white rounded-ios font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70`}
          >
            <span>
              {submitting
                ? 'Creating...'
                : step === 1
                  ? 'Next'
                  : 'Create Trip'}
            </span>
            {step === 2 && (
              <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
