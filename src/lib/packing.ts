import type { PackingCategory } from '@/types'

export interface DefaultPackingItem {
  name: string
  category: PackingCategory
}

export const DEFAULT_PACKING_ITEMS: DefaultPackingItem[] = [
  // Documents & Essentials
  { name: 'Passport', category: 'Documents' },
  { name: 'Credit/debit cards + cash', category: 'Documents' },
  // Clothing (Core)
  { name: 'Clothes', category: 'Clothes' },
  { name: 'Jacket', category: 'Clothes' },
  // Footwear
  { name: 'Sandals or flip-flops', category: 'Footwear' },
  // Toiletries & Personal Care
  { name: 'Toothbrush', category: 'Toiletries' },
  { name: 'Toothpaste', category: 'Toiletries' },
  { name: 'Deodorant', category: 'Toiletries' },
  { name: 'Shampoo, conditioner, body wash', category: 'Toiletries' },
  { name: 'Skincare products', category: 'Toiletries' },
  { name: 'Sunscreen', category: 'Toiletries' },
  // Health & First Aid
  { name: 'Medicine', category: 'Health' },
  // Electronics
  { name: 'Charger', category: 'Electronics' },
  { name: 'Portable power bank', category: 'Electronics' },
  { name: 'Universal travel adapter', category: 'Electronics' },
  { name: 'Earphones', category: 'Electronics' },
  // Travel Accessories & Comfort
  { name: 'Water bottle', category: 'Accessories' },
  { name: 'Pen', category: 'Accessories' },
  { name: 'SIM card removal pin', category: 'Accessories' },
]
