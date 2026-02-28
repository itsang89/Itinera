import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { TripDay } from '@/types'

export function useTripDays(tripId: string | undefined) {
  const [days, setDays] = useState<TripDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tripId) {
      setDays([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'trips', tripId, 'days'),
      orderBy('dayNumber', 'asc')
    )

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as TripDay[]
        setDays(data)
        setLoading(false)
      },
      (err) => {
        setLoading(false)
        console.error('useTripDays failed:', err)
      }
    )

    return () => unsubscribe()
  }, [tripId])

  const createDays = async (
    startDate: string,
    endDate: string
  ): Promise<void> => {
    if (!tripId) return
    const start = new Date(startDate)
    const end = new Date(endDate)
    let dayNumber = 1
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      await addDoc(collection(db, 'trips', tripId, 'days'), {
        date: d.toISOString().split('T')[0],
        dayNumber: dayNumber++,
      })
    }
  }

  return { days, loading, createDays }
}
