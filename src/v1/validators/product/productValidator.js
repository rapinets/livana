import { z } from "zod"

export const productSchema = z.object({
  name: z.string().nonempty({ message: 'Product name must be filled in!' }).min(2, { message: 'The product name must consist of more than two characters!' }).trim(),
  description: z.string().nonempty({ message: 'Product description must be filled in!' }).trim(),
  price: z.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' }).positive({ message: 'Price must be greater than 0' }),
  amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' }).int({ message: 'Amount must be an integer' }).min(0, { message: 'Amount cannot be negative' }),
  height: z.number({ invalid_type_error: 'Height must be a number' }).optional(),
  width: z.number({ invalid_type_error: 'Width must be a number' }).optional(),
  photo: z.string().optional()
})

export function validateProduct(schema) {
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
      const errors = result.error.issues.map((err) => err.message)
      return res.status(400).json({ errors })
    }
    req.validated = result.data
    next()
  }
}