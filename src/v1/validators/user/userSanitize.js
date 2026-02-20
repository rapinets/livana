// sanitize user input fields to prevent injection and allow only whitelisted fields

export const USER_ALLOWED_FIELDS = ['name', 'email', 'password', 'type', 'img']

export function sanitizeUserInput(input) {
  const sanitized = {}
  for (const key of USER_ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      sanitized[key] = input[key]
    }
  }
  return sanitized
}
