export interface UserProfile {
  displayName: string
  email: string
}

export interface Trip {
  id: string
  title: string
  destination: string
  lat: number
  lng: number
  startDate: string
  endDate: string
  totalBudget: number
  currency: string
  createdBy: string
}

export interface TripDay {
  id: string
  date: string
  dayNumber: number
}

export type ActivityCategory = 'Food' | 'Transport' | 'Attraction' | 'Hotel'

export interface Activity {
  id: string
  name: string
  startTime: string
  endTime: string
  location: string
  lat?: number
  lng?: number
  category: ActivityCategory
  notes: string
  estimatedCost: number
  order: number
}

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Accommodation'
  | 'Activities'
  | 'Shopping'
  | 'Other'

export interface Expense {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  date: string
}

export type PackingCategory =
  | 'Clothes'
  | 'Electronics'
  | 'Toiletries'
  | 'Documents'
  | 'Other'

export interface PackingItem {
  id: string
  name: string
  category: PackingCategory
  packed: boolean
}
