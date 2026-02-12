import session from "express-session";
import config from './default.js'

const sessionConfig = session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
})

export default sessionConfig