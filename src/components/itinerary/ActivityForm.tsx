import { useState, useEffect } from 'react'
import { PlacesAutocomplete } from '@/components/places/PlacesAutocomplete'
import type { Activity, ActivityCategory } from '@/types'

const CATEGORIES: ActivityCategory[] = ['Food', 'Transport', 'Attraction', 'Hotel']

interface ActivityFormProps {
  tripId: string
  dayId: string
  activity: Activity | null
  currencySymbol?: string
  onSave: (data: Omit<Activity, 'id'>) => void | Promise<void>
  onClose: () => void
}

export default function ActivityForm({
  activity,
  currencySymbol = '$',
  onSave,
  onClose,
}: ActivityFormProps) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [lat, setLat] = useState<number | undefined>()
  const [lng, setLng] = useState<number | undefined>()
  const [category, setCategory] = useState<ActivityCategory>('Attraction')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (activity) {
      setName(activity.name)
      setStartTime(activity.startTime)
      setEndTime(activity.endTime)
      setLocation(activity.location)
      setLat(activity.lat)
      setLng(activity.lng)
      setCategory(activity.category)
      setEstimatedCost(String(activity.estimatedCost || ''))
      setNotes(activity.notes || '')
    }
  }, [activity])

  const handlePlaceSelect = (place: {
    formatted_address: string
    lat?: number
    lng?: number
  }) => {
    setLocation(place.formatted_address)
    if (place.lat != null) setLat(place.lat)
    if (place.lng != null) setLng(place.lng)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await Promise.resolve(onSave({
        name: name.trim(),
        startTime,
        endTime,
        location,
        lat,
        lng,
        category,
        notes,
        estimatedCost: parseFloat(estimatedCost) || 0,
        order: activity?.order ?? 0,
      }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl max-w-md mx-auto shadow-xl">
        <header className="flex-shrink-0 bg-white dark:bg-dark-surface px-6 py-5 border-b border-gray-100 dark:border-dark-border rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
            >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-xl">
                close
              </span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
              {activity ? 'Edit Activity' : 'Add Activity'}
            </h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto min-h-0">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6" id="activity-form">
          <div className="space-y-1">
            <label
              htmlFor="activity-name"
              className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1"
            >
              Activity name
            </label>
            <input
              id="activity-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Surfing Lesson"
              className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 px-4 text-neutral-charcoal dark:text-neutral-100 placeholder:text-neutral-gray dark:text-neutral-400/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1">
                Start time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 px-4 text-neutral-charcoal dark:text-neutral-100 font-medium appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray dark:text-neutral-400 pointer-events-none">
                  schedule
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1">
                End time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 px-4 text-neutral-charcoal dark:text-neutral-100 font-medium appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray dark:text-neutral-400 pointer-events-none">
                  schedule
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1">
              Location
            </label>
            <PlacesAutocomplete
              value={location}
              onChange={setLocation}
              onPlaceSelect={handlePlaceSelect}
              placeholder="Search for a place..."
              className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 pl-4 pr-12 text-neutral-charcoal dark:text-neutral-100 placeholder:text-neutral-gray dark:text-neutral-400/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="category"
                className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 px-4 text-neutral-charcoal dark:text-neutral-100 font-medium appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="cost"
                className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1"
              >
                Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray dark:text-neutral-400 font-medium">
                  {currencySymbol}
                </span>
                <input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 pl-8 pr-4 text-neutral-charcoal dark:text-neutral-100 font-medium"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="notes"
              className="block text-[11px] font-bold text-neutral-gray dark:text-neutral-400 mb-2 ml-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details, booking codes, or reminders..."
              rows={4}
              className="w-full bg-soft-gray dark:bg-dark-elevated border-none rounded-xl py-4 px-4 text-neutral-charcoal dark:text-neutral-100 placeholder:text-neutral-gray dark:text-neutral-400/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm resize-none"
            />
          </div>
        </form>
        </div>
        <div className="flex-shrink-0 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <button
            form="activity-form"
            type="submit"
            disabled={submitting}
            className="w-full py-4 gradient-accent text-sky-900 font-bold rounded-2xl shadow-lg shadow-sky-300/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-sky-900 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Save Activity
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
