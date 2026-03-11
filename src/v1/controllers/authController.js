import config from '../../../config/default.js'
import UsersDBService from '../models/user/UsersDBService.js'
import { generateAccessToken, generateRefreshToken, parseRefreshBearer } from '../../../utils/jwtHelpers.js'

class AuthController {

 // Реєстрація нового користувача
  static async signup(req, res, next) {
    
    try {
      // use validated data (zod sanitises/normalises values)
      const validData = req.validated
      
      // Перевіряємо, чи існує користувач з таким email
      const existing = await UsersDBService.findOne({ email: validData.email })
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' })
      }

      // Створюємо нового користувача (model expects `name`, not `username`)
      const savedUser = await UsersDBService.createUser(validData)

      // Формуємо інформацію для токенів
      const userInfo = UsersDBService.getUserAuthInfo(savedUser)

      // Генеруємо accessToken і refreshToken
      const accessToken = generateAccessToken(userInfo, req.headers)
      const refreshToken = generateRefreshToken(
        { id: savedUser._id, type: 'refresh' },
        req.headers,
      )
      // Відправляємо refreshToken у httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // cookie недоступна з JS
        secure: config.nodeEnv === 'production',
        // secure: true, 
        sameSite: 'none', // дозволяємо відправляти cookie з інших доменів (для фронтенда на іншому домені)
        path: '/',
        maxAge: config.refreshCookiesExpires,
      })
      
      // Відправляємо accessToken у відповіді
      res.status(201).json({
        result: 'Signed up successfully',
        accessToken,
        user: userInfo,
      })
    } catch (err) {
      console.error('Signup failed:', err)
      res.status(500).json({ error: 'Signup error' })
    }
  }

   // Логін користувача
  static async login(req, res, next) {
    try {
      // Знаходимо користувача по email
      const user = await UsersDBService.findUser({ email: req.validated.email })

      if (!user) {
        return res.status(401).json({ error: 'Email or password is incorrect' })
      }

      // Перевіряємо пароль
      const isValid = await user.validPassword(req.validated.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Email or password is incorrect' })
      }

      // Формуємо інформацію для токенів
      const userInfo = UsersDBService.getUserAuthInfo(user)

      // Генеруємо accessToken і refreshToken
      const accessToken = generateAccessToken(userInfo, req.headers)
      const refreshToken = generateRefreshToken(
        { id: user._id, type: 'refresh' },
        req.headers,
      )

      // Відправляємо refreshToken у httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        // secure: true, 
        sameSite: 'none', // дозволяємо відправляти cookie з інших доменів (для фронтенда на іншому домені)
        path: '/',
        maxAge: config.refreshCookiesExpires,
      })
      
      // Відправляємо accessToken у відповіді
      res.json({
        result: 'Authorized',
        accessToken,
        user: userInfo,
      })
    } catch (err) {
      console.error('Login failed:', err)
      res.status(500).json({ error: 'Login error' })
    }
  }

  // Оновлення accessToken через refreshToken з cookie
  static async refreshToken(req, res, next) {
    try {
      // Дістаємо refreshToken з cookie
      const { refreshToken } = req.cookies
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' })
      }
      let decoded
      try {
        // Декодуємо refreshToken
        decoded = parseRefreshBearer(refreshToken, req.headers)
      } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }
      // Перевіряємо валідність токена
      if (!decoded || decoded.type !== 'refresh' || !decoded.id) {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }
      // Знаходимо користувача
      const user = await UsersDBService.findUserById(decoded.id)
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }
      // Формуємо інформацію для нового accessToken
      const userInfo = UsersDBService.getUserAuthInfo(user)

      // Генеруємо новий accessToken
      const accessToken = generateAccessToken(userInfo, req.headers)

      // Відправляємо accessToken у відповіді
      res.json({ accessToken, user: userInfo })
    } catch (err) {
      res.status(500).json({ error: 'Refresh token error' })
    }
  }

  // Логаут користувача
  static async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        // secure: true, 
        sameSite: "none", // дозволяємо відправляти cookie з інших доменів (для фронтенда на іншому домені)
        path: '/',
      })
      res.json({ result: 'Logged out' })
    } catch (err) {
      res.status(500).json({ error: 'Logout error' })
    }
  }

}

export default AuthController


