export const PRODUCT_ALLOWED_FIELDS = [
  'name',
  'description',
  'price',
  'amount',
  'height',
  'width',
  'photo'
]

export function sanitizeProductInput(input) {
  const sanitized = {}
  for (const key of PRODUCT_ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      sanitized[key] = input[key]
    }
  }
  return sanitized
}