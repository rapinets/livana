import mongoose from 'mongoose'
const { Schema } = mongoose
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    // unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [16, 'Password must be at most 16 characters long'],
    // validate: {
    //   validator: function (v) {
    //     return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
    //       v,
    //     )
    //   },
    //   message: (props) =>
    //     'Password must contain at least one letter, one number, and one special character',
    // },
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Type',
  },
  img: {
    type: String,
  },
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) { return }
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hash(this.password, salt)

})

const User = mongoose.model('User', userSchema)
export default User