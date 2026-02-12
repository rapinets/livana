import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '../models/user/User.js'
import UsersDBService from '../models/user/UsersDBService.js'

// Налаштування локальної стратегії
passport.use(
  new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
    try {
      const user = await UsersDBService.findOne({ name }, {}, ['type'])
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' })
      }

      return done(null, user)
    } catch (error) {

      return done(error)
    }
  }),
)

// Серіалізація користувача
passport.serializeUser((user, done) => {

  done(null, user._id)
})

// Десеріалізація користувача
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersDBService.findOne({ _id: id }, {}, ['type'])
    // Додаємо поле role для зручності (title з type)
    if (user && user.type && user.type.title) {
      user.role = user.type.title
    }
    done(null, user)
  } catch (error) {
    done(error)
  }
})

export default passport
