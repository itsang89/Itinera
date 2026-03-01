export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  JPY: '¥',
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'JPY'] as const
export type CurrencyCode = (typeof CURRENCIES)[number]

export const CURRENCY_OPTIONS: Array<{ code: CurrencyCode; symbol: string; label: string }> = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD (HK$)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
]

export function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function formatDateRangeShort(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export function daysUntil(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return d.toLocaleDateString()
}

export function getWeatherIcon(code: number) {
  if (code === 0) return 'wb_sunny'
  if (code <= 3) return 'cloud'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 51 && code <= 67) return 'water_drop'
  if (code >= 71 && code <= 77) return 'ac_unit'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 95) return 'thunderstorm'
  return 'wb_sunny'
}

/** Returns the next upcoming activity by date+time, or the first activity if trip is in the past */
export function getUpcomingActivity<T extends { date: string; startTime: string }>(
  activities: T[]
): T | undefined {
  if (activities.length === 0) return undefined
  const now = new Date()
  const nowStr = now.toISOString().split('T')[0]
  const nowTime = now.getHours() * 60 + now.getMinutes()

  const sorted = [...activities].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return (a.startTime || '00:00').localeCompare(b.startTime || '00:00')
  })

  for (const a of sorted) {
    const dateCompare = a.date.localeCompare(nowStr)
    if (dateCompare > 0) return a
    if (dateCompare === 0) {
      const [h, m] = (a.startTime || '00:00').split(':').map(Number)
      const actTime = h * 60 + m
      if (actTime >= nowTime) return a
    }
  }
  return sorted[0]
}
