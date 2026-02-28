import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Trip } from '@/types'

export function useTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setTrips([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'trips'),
      where('createdBy', '==', userId),
      orderBy('startDate', 'asc')
    )

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Trip[]
        setTrips(data)
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  const createTrip = async (trip: Omit<Trip, 'id'>) => {
    const docRef = await addDoc(collection(db, 'trips'), trip)
    return docRef.id
  }

  const deleteTrip = async (tripId: string) => {
    await deleteDoc(doc(db, 'trips', tripId))
  }

  return { trips, loading, error, createTrip, deleteTrip }
}
