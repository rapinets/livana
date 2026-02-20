import { escapeRegex } from '../helpers.js'
import mongoose from 'mongoose'

export const PRODUCT_ALLOWED_FILTERS = {
  name: (v) => {
    const raw = String(v ?? '').trim()
    if (!raw) return undefined
    const safe = escapeRegex(raw)
    return { name: new RegExp(safe, 'i') }
  },
  category: (v) => {
    const raw = String(v ?? '').trim()
    if (!raw) return undefined
    const safe = escapeRegex(raw)
    return { category: new RegExp(safe, 'i') }
  },
  type: (v) => {
    if (!v) return undefined
    try {
      return { type: new mongoose.Types.ObjectId(v) }
    } catch {
      return undefined
    }
  },
}

export function buildProductFilter(query) {
  const filter = {}
  for (const key in PRODUCT_ALLOWED_FILTERS) {
    if (query[key] !== undefined && query[key] !== '') {
      const value = PRODUCT_ALLOWED_FILTERS[key](query[key])
      if (value !== undefined && value !== null) {
        Object.assign(filter, value)
      }
    }
  }
  return filter
}
