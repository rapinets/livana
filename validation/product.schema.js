import { z } from "zod"

export const ProductValidationSchema = z.object({
  name: z.string().nonempty({ message: 'Product name must be filled in!' }).min(2, { message: 'The product name must consist of more than two characters!' }).trim(),
  description: z.string().nonempty({ message: 'Product description must be filled in!' }).trim(),
  price: z.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' }).positive({ message: 'Price must be greater than 0' }),
  amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' }).int({ message: 'Amount must be an integer' }).min(0, { message: 'Amount cannot be negative' }),
  height: z.number({ invalid_type_error: 'Height must be a number' }).optional(),
  width: z.number({ invalid_type_error: 'Width must be a number' }).optional(),
  photo: z.string().optional()
})