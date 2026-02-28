import { useState, useEffect } from 'react'
import { PlacesAutocomplete } from '@/components/places/PlacesAutocomplete'
import type { Activity, ActivityCategory } from '@/types'

const CATEGORIES: ActivityCategory[] = ['Food', 'Transport', 'Attraction', 'Hotel']

interface ActivityFormProps {
  tripId: string
  dayId: string
  activity: Activity | null
  onSave: (data: Omit<Activity, 'id'>) => void
  onClose: () => void
}

export default function ActivityForm({
  activity,
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
    lat: number
    lng: number
  }) => {
    setLocation(place.formatted_address)
    setLat(place.lat)
    setLng(place.lng)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
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
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl max-w-md mx-auto shadow-xl">
        <header className="sticky top-0 z-30 bg-white px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-neutral-charcoal text-xl">
                  close
                </span>
              </button>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal">
                {activity ? 'Edit Activity' : 'Add Activity'}
              </h1>
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 pb-32">
          <div className="space-y-1">
            <label
              htmlFor="activity-name"
              className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1"
            >
              Activity Name
            </label>
            <input
              id="activity-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Surfing Lesson"
              className="w-full bg-soft-gray border-none rounded-xl py-4 px-4 text-neutral-charcoal placeholder:text-neutral-gray/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-soft-gray border-none rounded-xl py-4 px-4 text-neutral-charcoal font-medium appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray pointer-events-none">
                  schedule
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1">
                End Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-soft-gray border-none rounded-xl py-4 px-4 text-neutral-charcoal font-medium appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray pointer-events-none">
                  schedule
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1">
              Location
            </label>
            <PlacesAutocomplete
              value={location}
              onChange={setLocation}
              onPlaceSelect={handlePlaceSelect}
              placeholder="Search for a place..."
              className="w-full bg-soft-gray border-none rounded-xl py-4 pl-4 pr-12 text-neutral-charcoal placeholder:text-neutral-gray/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="category"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full bg-soft-gray border-none rounded-xl py-4 px-4 text-neutral-charcoal font-medium appearance-none"
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
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1"
              >
                Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray font-medium">
                  $
                </span>
                <input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-soft-gray border-none rounded-xl py-4 pl-8 pr-4 text-neutral-charcoal font-medium"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="notes"
              className="block text-[11px] font-bold uppercase tracking-wider text-neutral-gray mb-2 ml-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details, booking codes, or reminders..."
              rows={4}
              className="w-full bg-soft-gray border-none rounded-xl py-4 px-4 text-neutral-charcoal placeholder:text-neutral-gray/50 focus:ring-2 focus:ring-accent-blue-end/50 transition-all text-sm resize-none"
            />
          </div>
        </form>
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full py-4 gradient-accent text-sky-900 font-bold rounded-2xl shadow-lg shadow-sky-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Save Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
