import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name must be filled in!'],
    miLength: [2, 'The product name must consist of more than two characters!'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description must be filled in!'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'The price of the product must be filled in!'],
    min: 0.00
  },
  amount: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0.00
  },
  width: {
    type: Number,
    min: 0.00
  },
  photo: {
    type: String,
    trim: true
  }
}, { timestamps: true }
)

export default mongoose.model('Product', productSchema)