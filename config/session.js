import session from "express-session";
import config from './default.js'

const sessionConfig = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
})

export default sessionConfig