export function UserValidationMiddleware(schema) {
  return (req, res, next) => {
    const data = req.body

    if (req.file?.filename) {
      data.photo = req.file.filename
    }

    const result = schema.saveParse(data)

    if (!result.success) {
      const errors = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0]
        if (!errors[field]) {
          errors[field] = issue.message
        }
      })

      return res.render('users/form', {
        title: 'Register Form',
        product: req.body,
        errors
      })
    }
    req.validationData = result.data
    next()
  }
}