import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { PackingItem } from '@/types'

export function usePackingItems(tripId: string | undefined) {
  const [items, setItems] = useState<PackingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tripId) {
      setItems([])
      setLoading(false)
      return
    }

    const unsubscribe: Unsubscribe = onSnapshot(
      collection(db, 'trips', tripId, 'packingItems'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PackingItem[]
        setItems(data)
        setLoading(false)
      },
      (err) => {
        setLoading(false)
        console.error('usePackingItems failed:', err)
      }
    )

    return () => unsubscribe()
  }, [tripId])

  const addItem = async (item: Omit<PackingItem, 'id'>) => {
    if (!tripId) return
    await addDoc(collection(db, 'trips', tripId, 'packingItems'), item)
  }

  const togglePacked = async (itemId: string, packed: boolean) => {
    if (!tripId) return
    await updateDoc(
      doc(db, 'trips', tripId, 'packingItems', itemId),
      { packed }
    )
  }

  const deleteItem = async (itemId: string) => {
    if (!tripId) return
    await deleteDoc(doc(db, 'trips', tripId, 'packingItems', itemId))
  }

  const packedCount = items.filter((i) => i.packed).length

  return { items, loading, addItem, togglePacked, deleteItem, packedCount }
}
