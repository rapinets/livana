import mongoose from "mongoose";
import config from "../config/default.js"

const connectDB = async () => {
  try {
    mongoose.set('sanitizeFilter', true)

    mongoose.set('strictQuery', true)

    mongoose.set('sanitizeProjection', true)

    await mongoose.connect(config.mongoURI)

    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB