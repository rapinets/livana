import TypesDBService from "../models/type/TypesDBService.js"

export function UserValidationMiddleware(schema) {
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

      req.validationData = result.data
      next()

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}