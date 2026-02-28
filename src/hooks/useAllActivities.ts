import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Activity } from '@/types'

export interface ActivityWithDay extends Activity {
  dayId: string
  date: string
  dayNumber: number
}

export function useAllActivities(tripId: string | undefined) {
  const [activities, setActivities] = useState<ActivityWithDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tripId) {
      setActivities([])
      setLoading(false)
      return
    }

    let cancelled = false
    async function fetchAll() {
      const daysRef = collection(db, 'trips', tripId!, 'days')
      const daysSnap = await getDocs(
        query(daysRef, orderBy('dayNumber', 'asc'))
      )
      const all: ActivityWithDay[] = []
      for (const dayDoc of daysSnap.docs) {
        const dayData = dayDoc.data()
        const actsRef = collection(db, 'trips', tripId!, 'days', dayDoc.id, 'activities')
        const actsSnap = await getDocs(
          query(actsRef, orderBy('order', 'asc'))
        )
        for (const actDoc of actsSnap.docs) {
          all.push({
            ...actDoc.data(),
            id: actDoc.id,
            dayId: dayDoc.id,
            date: dayData.date,
            dayNumber: dayData.dayNumber,
          } as ActivityWithDay)
        }
      }
      if (!cancelled) {
        setActivities(all)
      }
      setLoading(false)
    }
    fetchAll()
    return () => {
      cancelled = true
    }
  }, [tripId])

  return { activities, loading }
}
