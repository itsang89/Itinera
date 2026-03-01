import { useEffect, useState, useCallback } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CURRENCY_SYMBOLS, CURRENCIES, type CurrencyCode } from '@/lib/utils'

export type { CurrencyCode }

export function useUserProfile(userId: string | undefined) {
  const [defaultCurrency, setDefaultCurrencyState] = useState<CurrencyCode>('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const userRef = doc(db, 'users', userId)
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data()
        const currency = data.defaultCurrency
        if (CURRENCIES.includes(currency)) {
          setDefaultCurrencyState(currency)
        }
      }
      setLoading(false)
    })
  }, [userId])

  const updateDefaultCurrency = useCallback(
    async (currency: CurrencyCode) => {
      if (!userId) return
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { defaultCurrency: currency })
      setDefaultCurrencyState(currency)
    },
    [userId]
  )

  const currencyLabel = (code: CurrencyCode) =>
    `${code} (${CURRENCY_SYMBOLS[code] ?? code})`

  return {
    defaultCurrency,
    updateDefaultCurrency,
    currencyLabel,
    currencies: CURRENCIES,
    loading,
  }
}
