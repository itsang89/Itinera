import { useEffect, useState } from 'react'
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Trip } from '@/types'

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

  return { trip, loading, error }
}
