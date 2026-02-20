import { z } from 'zod'
import TypesDBService from "../../models/type/TypesDBService.js"

export const signupSchema = z.object({
  // Name: обов'язковий, мінімум 3 символи, максимум 50, без пробілів на початку/кінці
  name: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be at most 50 characters long')
    .nonempty('Name is required')
    .trim(),
  // Email: обов'язковий, валідний email, нормалізація
  email: z
    .email('Invalid email address')
    .min(5, 'Email is required')
    .max(100, 'Email too long')
    .transform((val) => val.trim().toLowerCase()),

  // Password: мінімум 6, максимум 16, хоча б 1 літера, 1 цифра, 1 спецсимвол
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one letter, one number, and one special character',
    ),

  // img: опціонально, додається у контролері якщо є файл
  img: z.string().optional()
})

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function validationUser(schema) {
  return async (req, res, next) => {
    try {
      const email = req.session.registerEmail || ''

      if (!email) {
        return res.redirect('/users/register')
      }

      const type = await TypesDBService.getOne('user')

      const safeBody = {
        name: req.body.name ?? '',
        password: req.body.password ?? '',
        email,
        type: type._id
      }

      if (req.file?.filename) {
        safeBody.img = req.file.filename
      }

      const result = schema.safeParse(safeBody)

      if (!result.success) {
        const errors = {}
        result.error.issues.forEach(issue => {
          const field = issue.path[0]
          if (!errors[field]) {
            errors[field] = issue.message
          }
        })

        return res.render('users/register', {
          data: req.body,
          user: req.user,
          errors,
          email
        })
      }

      req.validated = result.data
      next()

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}