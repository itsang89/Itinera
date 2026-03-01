import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Activity, ActivityCategory } from '@/types'

const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  Food: 'restaurant',
  Transport: 'directions_car',
  Attraction: 'museum',
  Hotel: 'hotel',
}

export function getCategoryIcon(category: ActivityCategory) {
  return CATEGORY_ICONS[category] ?? 'place'
}

export function useActivities(tripId: string | undefined, dayId: string | undefined) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tripId || !dayId) {
      setActivities([])
      setLoading(false)
      setError(null)
      return
    }

    setError(null)
    const q = query(
      collection(db, 'trips', tripId, 'days', dayId, 'activities'),
      orderBy('order', 'asc')
    )

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Activity[]
        data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.startTime || '').localeCompare(b.startTime || ''))
        setActivities(data)
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tripId, dayId])

  const addActivity = async (
    activity: Omit<Activity, 'id'> & { order?: number }
  ) => {
    if (!tripId || !dayId) return
    const order = activity.order ?? activities.length
    const { order: _o, ...data } = activity
    await addDoc(collection(db, 'trips', tripId, 'days', dayId, 'activities'), {
      ...data,
      order,
    })
  }

  const updateActivity = async (
    activityId: string,
    updates: Partial<Omit<Activity, 'id'>>
  ) => {
    if (!tripId || !dayId) return
    await updateDoc(
      doc(db, 'trips', tripId, 'days', dayId, 'activities', activityId),
      updates
    )
  }

  const deleteActivity = async (activityId: string) => {
    if (!tripId || !dayId) return
    await deleteDoc(
      doc(db, 'trips', tripId, 'days', dayId, 'activities', activityId)
    )
  }

  const reorderActivities = async (newOrder: Activity[]) => {
    if (!tripId || !dayId) return
    await Promise.all(
      newOrder.map((a, i) =>
        updateDoc(
          doc(db, 'trips', tripId, 'days', dayId, 'activities', a.id),
          { order: i }
        )
      )
    )
  }

  return {
    activities,
    loading,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
  }
}
