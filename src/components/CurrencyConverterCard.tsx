import { useState, useMemo } from 'react'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { CURRENCY_SYMBOLS, CURRENCIES, type CurrencyCode } from '@/lib/utils'

interface CurrencyConverterCardProps {
  tripCurrency: string
  userCurrency: CurrencyCode
}

export function CurrencyConverterCard({ tripCurrency, userCurrency }: CurrencyConverterCardProps) {
  const [inputAmount, setInputAmount] = useState('')
  const { convert, loading, error, refetch } = useExchangeRates(tripCurrency)

  const tripSymbol = CURRENCY_SYMBOLS[tripCurrency] ?? tripCurrency
  const userSymbol = CURRENCY_SYMBOLS[userCurrency] ?? userCurrency

  const parsedAmount = useMemo(() => {
    const cleaned = inputAmount.replace(/,/g, '')
    const num = parseFloat(cleaned)
    return Number.isNaN(num) ? null : num
  }, [inputAmount])

  const convertedAmount = useMemo(() => {
    if (parsedAmount == null || parsedAmount < 0) return null
    if (tripCurrency === userCurrency) return parsedAmount
    return convert(parsedAmount, tripCurrency, userCurrency)
  }, [parsedAmount, tripCurrency, userCurrency, convert])

  const showConverter = CURRENCIES.includes(tripCurrency as CurrencyCode) && tripCurrency !== userCurrency

  if (!showConverter) return null

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
          <span className="material-symbols-outlined">currency_exchange</span>
        </div>
        <div>
          <p className="font-bold text-sm text-neutral-charcoal dark:text-neutral-100">
            Currency Converter
          </p>
          <p className="text-xs text-neutral-gray dark:text-neutral-400">
            {tripCurrency} → {userCurrency}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-xs font-medium text-neutral-gray dark:text-neutral-400">
          Amount in {tripCurrency}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-charcoal dark:text-neutral-100 font-medium">
            {tripSymbol}
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-soft-gray dark:bg-dark-elevated border border-gray-100 dark:border-dark-border text-neutral-charcoal dark:text-neutral-100 font-medium placeholder:text-neutral-gray dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-blue-start/50 dark:focus:ring-accent-blue-end/50"
            aria-label={`Amount in ${tripCurrency}`}
          />
        </div>
        {loading && (
          <p className="text-xs text-neutral-gray dark:text-neutral-400 flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading exchange rates...
          </p>
        )}
        {error && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            {error}
            <button
              onClick={() => refetch()}
              className="text-accent-blue-start dark:text-accent-blue-end font-medium underline"
            >
              Retry
            </button>
          </p>
        )}
        {!loading && !error && parsedAmount != null && parsedAmount >= 0 && (
          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-xs text-neutral-gray dark:text-neutral-400">≈</span>
            <span className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100">
              {convertedAmount != null
                ? `${userSymbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '—'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
