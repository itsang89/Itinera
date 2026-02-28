import { useEffect, useState, useCallback } from 'react'
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Trip } from '@/types'

export type TripUpdates = Partial<
  Pick<Trip, 'title' | 'destination' | 'lat' | 'lng' | 'startDate' | 'endDate' | 'totalBudget' | 'currency'>
>

export function useTrip(tripId: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tripId) {
      setTrip(null)
      setLoading(false)
      return
    }

    const unsubscribe: Unsubscribe = onSnapshot(
      doc(db, 'trips', tripId),
      (snapshot) => {
        if (snapshot.exists()) {
          setTrip({ id: snapshot.id, ...snapshot.data() } as Trip)
        } else {
          setTrip(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tripId])

  const updateTrip = useCallback(
    async (updates: TripUpdates) => {
      if (!tripId) return
      await updateDoc(doc(db, 'trips', tripId), updates)
      if (updates.startDate != null && updates.endDate != null) {
        await syncTripDays(tripId, updates.startDate, updates.endDate)
      }
    },
    [tripId]
  )

  return { trip, loading, error, updateTrip }
}

async function syncTripDays(tripId: string, newStart: string, newEnd: string) {
  const daysRef = collection(db, 'trips', tripId, 'days')
  const daysSnap = await getDocs(query(daysRef, orderBy('dayNumber', 'asc')))
  const existingDays = daysSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Array<{ id: string; date: string; dayNumber: number }>

  const newStartDate = new Date(newStart)
  const newEndDate = new Date(newEnd)
  const newDates = new Set<string>()
  for (let d = new Date(newStartDate); d <= newEndDate; d.setDate(d.getDate() + 1)) {
    newDates.add(d.toISOString().split('T')[0])
  }

  const existingDates = new Set(existingDays.map((day) => day.date))
  const toDelete = existingDays.filter((day) => !newDates.has(day.date))
  const toAdd = [...newDates].filter((date) => !existingDates.has(date)).sort()

  for (const day of toDelete) {
    const actsRef = collection(db, 'trips', tripId, 'days', day.id, 'activities')
    const actsSnap = await getDocs(actsRef)
    for (const act of actsSnap.docs) {
      await deleteDoc(doc(db, 'trips', tripId, 'days', day.id, 'activities', act.id))
    }
    await deleteDoc(doc(db, 'trips', tripId, 'days', day.id))
  }

  const maxDayNumber = existingDays.length > 0 ? Math.max(...existingDays.map((d) => d.dayNumber)) : 0
  let dayNumber = maxDayNumber + 1
  for (const date of toAdd) {
    await addDoc(daysRef, { date, dayNumber: dayNumber++ })
  }
}
