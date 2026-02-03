export function ProductValidationMiddleware(schema) {
  const toNumber = v => v === '' || v === undefined ? undefined : Number(v)

  return (req, res, next) => {
    const data = {
      ...req.body,
      price: toNumber(req.body.price),
      amount: toNumber(req.body.amount),
      height: toNumber(req.body.height),
      width: toNumber(req.body.width)
    }
    if (req.file?.filename) {
      data.photo = req.file.filename
    }
    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = {}

      result.error.issues.forEach(issue => {
        const field = issue.path[0]
        if (!errors[field]) {
          errors[field] = issue.message
        }
      })

      return res.render('products/form', {
        title: 'Product Form',
        product: req.body,
        errors
      })
    }
    req.validationData = result.data
    next()
  }
}