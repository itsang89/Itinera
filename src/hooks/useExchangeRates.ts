import { useState, useEffect, useCallback } from 'react'
import { env } from '@/lib/env'
import { CURRENCIES, type CurrencyCode } from '@/lib/utils'

const API_BASE = 'https://v6.exchangerate-api.com/v6'

interface ExchangeRatesResponse {
  result: string
  base_code: string
  conversion_rates: Record<string, number>
}

export function useExchangeRates(baseCurrency: string) {
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    if (!env.exchangeRateApiKey) {
      setError('Currency conversion is not configured.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/${env.exchangeRateApiKey}/latest/${baseCurrency}`
      )
      const data = (await res.json()) as ExchangeRatesResponse
      if (data.result !== 'success') {
        throw new Error((data as { 'error-type'?: string })['error-type'] ?? 'Failed to fetch rates')
      }
      const supported: Record<string, number> = { [baseCurrency]: 1 }
      for (const code of CURRENCIES) {
        if (data.conversion_rates[code] != null) {
          supported[code] = data.conversion_rates[code]
        }
      }
      setRates(supported)
    } catch (err) {
      setError((err as Error).message)
      setRates(null)
    } finally {
      setLoading(false)
    }
  }, [baseCurrency])

  useEffect(() => {
    if (env.exchangeRateApiKey && CURRENCIES.includes(baseCurrency as CurrencyCode)) {
      fetchRates()
    } else {
      setRates(null)
      setError(null)
    }
  }, [baseCurrency, fetchRates])

  const convert = useCallback(
    (amount: number, from: string, to: string): number | null => {
      if (!rates || from === to) return amount
      const fromRate = from === baseCurrency ? 1 : rates[from]
      const toRate = to === baseCurrency ? 1 : rates[to]
      if (fromRate == null || toRate == null) return null
      return (amount / fromRate) * toRate
    },
    [rates, baseCurrency]
  )

  return { rates, loading, error, convert, refetch: fetchRates }
}
