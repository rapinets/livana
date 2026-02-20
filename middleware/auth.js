import { parseAccessBearer } from '../utils/jwtHelpers.js'

// Список відкритих шляхів (не потребують авторизації)
const openPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/signup',
  '/api/v1/products',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/logout',
]

// Middleware для перевірки ролей (приклад: тільки admin)
// Middleware для перевірки ролей (можна передати одну або декілька ролей)
export function requireRole(roles) {
  // Дозволяється як рядок, так і масив ролей
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ result: 'Forbidden: insufficient rights' })
    }
    next()
  }
}

// Middleware для аутентифікації
export function authenticate(req, res, next) {
  if (openPaths.includes(req.path)) {
    return next()
  }
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ result: 'No token provided' })
    }
    req.user = parseAccessBearer(authHeader, req.headers)
    next()
  } catch (err) {
    return res.status(401).json({ result: 'Access Denied', error: err.message })
  }
}

// Головна функція для підключення middleware
const auth = (app) => {
  // Підключення middleware для аутентифікації
  app.use(authenticate)
}

export default auth
