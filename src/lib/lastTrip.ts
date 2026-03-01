const STORAGE_KEY = 'itinera-last-trip-id'

export function getLastTripId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setLastTripId(tripId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, tripId)
  } catch {
    // ignore
  }
}

export function clearLastTripId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
