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
import type { Expense } from '@/types'

export function useExpenses(tripId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tripId) {
      setExpenses([])
      setLoading(false)
      setError(null)
      return
    }

    setError(null)
    const q = query(
      collection(db, 'trips', tripId, 'expenses'),
      orderBy('date', 'desc')
    )

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Expense[]
        setExpenses(data)
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [tripId])

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!tripId) return
    await addDoc(collection(db, 'trips', tripId, 'expenses'), expense)
  }

  const updateExpense = async (expenseId: string, data: Partial<Omit<Expense, 'id'>>) => {
    if (!tripId) return
    await updateDoc(doc(db, 'trips', tripId, 'expenses', expenseId), data)
  }

  const deleteExpense = async (expenseId: string) => {
    if (!tripId) return
    await deleteDoc(doc(db, 'trips', tripId, 'expenses', expenseId))
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense, totalSpent }
}
