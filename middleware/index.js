import express from 'express'
import cookieParser from 'cookie-parser'
import loggerConfig from '../config/logger.js'
import sessionConfig from '../config/session.js'
import auth from './auth.js'
import dotenv from 'dotenv'
import { applySecurity } from './security/index.js'
import { setupStaticFiles } from './staticFiles.js'

import { errorMiddlewareHandler } from './error/index.js'

const middleware = (app, opts = {}) => {
  // Завантаження змінних середовища
  dotenv.config()

  // Middleware для парсингу cookies (move to top)
  app.use(cookieParser())

  // Підключення security middleware bundle (helmet, cors, rateLimit, body limits, requestId, env marker)
  applySecurity(app, opts.security)

  // Middleware для логування запитів
  app.use(loggerConfig)

  // Middleware для налаштування сесій
  app.use(sessionConfig)

  // Middleware для обробки статичних файлів (public, uploads)
  setupStaticFiles(app)

  // Middleware для аутентифікації та авторизації
  auth(app)
}

export { middleware, errorMiddlewareHandler }







