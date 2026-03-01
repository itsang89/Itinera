import { useEffect, useState, useRef } from 'react'
import { collection, query, orderBy, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Activity } from '@/types'

export interface ActivityWithDay extends Activity {
  dayId: string
  date: string
  dayNumber: number
}

function mergeActivities(byDay: Record<string, ActivityWithDay[]>): ActivityWithDay[] {
  const dayIds = Object.keys(byDay).sort(
    (a, b) => (byDay[a][0]?.dayNumber ?? 0) - (byDay[b][0]?.dayNumber ?? 0)
  )
  return dayIds.flatMap((id) => byDay[id] ?? [])
}

export function useAllActivities(tripId: string | undefined) {
  const [activities, setActivities] = useState<ActivityWithDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const byDayRef = useRef<Record<string, ActivityWithDay[]>>({})

  useEffect(() => {
    if (!tripId) {
      setActivities([])
      setLoading(false)
      setError(null)
      return
    }

    setError(null)
    setLoading(true)
    byDayRef.current = {}
    const activityUnsubsRef = { current: [] as Unsubscribe[] }

    const daysRef = collection(db, 'trips', tripId, 'days')
    const daysQuery = query(daysRef, orderBy('dayNumber', 'asc'))

    const unsubDays = onSnapshot(
      daysQuery,
      (daysSnap) => {
        activityUnsubsRef.current.forEach((u) => u())
        activityUnsubsRef.current = []

        daysSnap.docs.forEach((dayDoc) => {
          const dayData = dayDoc.data()
          const dayId = dayDoc.id
          const actsRef = collection(db, 'trips', tripId!, 'days', dayId, 'activities')
          const actsQuery = query(actsRef, orderBy('order', 'asc'))

          const unsubActs = onSnapshot(
            actsQuery,
            (actsSnap) => {
              const dayActivities: ActivityWithDay[] = actsSnap.docs.map((actDoc) => ({
                ...actDoc.data(),
                id: actDoc.id,
                dayId,
                date: dayData.date,
                dayNumber: dayData.dayNumber,
              })) as ActivityWithDay[]
              byDayRef.current[dayId] = dayActivities
              setActivities(mergeActivities({ ...byDayRef.current }))
            },
            (err) => {
              setError(err as Error)
              setLoading(false)
            }
          )
          activityUnsubsRef.current.push(unsubActs)
        })
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => {
      unsubDays()
      activityUnsubsRef.current.forEach((u) => u())
    }
  }, [tripId])

  return { activities, loading, error }
}
